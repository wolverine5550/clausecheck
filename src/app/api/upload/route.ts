"use server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { extractRawText } from '@/lib/utils/extract-raw-text';
import { extractClauses } from '@/lib/utils/extractClauses';

const RATE_LIMIT = 5; // uploads per hour
const RATE_LIMIT_WINDOW = 60 * 60; // 1 hour in seconds
const BUCKET_NAME = "contracts";

export async function POST(request: Request) {
  try {
    // Use cookies() synchronously for Supabase session detection (Next.js 15 API routes)
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check rate limit
    const hourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW * 1000).toISOString();
    const { data: recentUploads, error: countError } = await supabase
      .from("contracts")
      .select("id", { count: "exact" })
      .eq("user_id", user.id)
      .gte("uploaded_at", hourAgo);

    if (countError) {
      console.error("Error checking rate limit:", countError);
      return NextResponse.json(
        { error: "Error checking rate limit" },
        { status: 500 }
      );
    }

    const uploadCount = recentUploads?.length ?? 0;
    if (uploadCount >= RATE_LIMIT) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: `You can only upload ${RATE_LIMIT} contracts per hour. Please try again later.`,
          nextAllowedUpload: hourAgo
        },
        { status: 429 }
      );
    }

    // Parse multipart/form-data
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Generate a unique file path
    const fileExt = (file as File).name?.split(".").pop() || "bin";
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Upload file to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        upsert: false,
        contentType: file.type,
      });

    if (storageError) {
      console.error("Storage upload error:", storageError);
      return NextResponse.json(
        { error: "Failed to upload file to storage" },
        { status: 500 }
      );
    }

    // Get public URL (or signed URL if private)
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    const fileUrl = urlData?.publicUrl || filePath;

    // --- Extract raw text from the uploaded file ---
    let rawText: string | null = null;
    let extractionWarning: string | null = null;
    try {
      // Read the file as an ArrayBuffer and convert to Buffer
      const arrayBuffer = await (file as File).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      rawText = await extractRawText(buffer, (file as File).type);
    } catch (extractErr) {
      console.error('Raw text extraction failed:', extractErr);
      extractionWarning =
        'Text extraction failed. File uploaded, but no text was extracted.';
      // Proceed with null raw_text, but notify user in response
    }

    // Insert metadata and raw text into contracts table
    // Use .select() to get the inserted contract's ID
    const { data: contractInsertData, error: dbError } = await supabase.from("contracts").insert({
      user_id: user.id,
      file_name: (file as File).name,
      file_url: fileUrl,
      uploaded_at: new Date().toISOString(),
      raw_text: rawText,
    }).select();
    if (dbError || !contractInsertData || !contractInsertData[0]?.id) {
      console.error("DB insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save contract metadata", message: "Failed to save contract metadata." },
        { status: 500 }
      );
    }
    const contractId = contractInsertData[0].id;

    // --- Audit log: record upload action ---
    // Insert a row into audit_history after successful contract upload
    const auditLog = {
      user_id: user.id,
      contract_id: contractId,
      action: 'upload',
      details: {
        file_name: (file as File).name,
        file_url: fileUrl,
      },
    };
    // Insert audit log (do not block response on error)
    await supabase.from('audit_history').insert(auditLog);

    // --- Extract and store clauses if raw text extraction succeeded ---
    if (rawText) {
      try {
        // Use the clause extraction utility
        const clauses = extractClauses(rawText);
        if (clauses.length > 0) {
          // Prepare bulk insert payload for clauses table
          const clauseRows = clauses.map((c, idx) => ({
            contract_id: contractId,
            clause_text: c.clauseText,
            clause_index: idx, // Store the original order
            // AI fields left null for now
          }));
          const { error: clauseInsertError } = await supabase.from("clauses").insert(clauseRows);
          if (clauseInsertError) {
            console.error("Clause insert error:", clauseInsertError);
            // Do not fail the whole request, but include a warning
            extractionWarning = (extractionWarning ? extractionWarning + ' ' : '') +
              'Clause extraction failed to save. Please try again.';
          }
        }
      } catch (clauseErr) {
        console.error('Clause extraction failed:', clauseErr);
        extractionWarning = (extractionWarning ? extractionWarning + ' ' : '') +
          'Clause extraction failed. Please try again.';
      }
    }

    // Always return a message field. If extraction failed, include warning.
    return NextResponse.json({
      success: true,
      message: rawText
        ? "File uploaded and text extracted successfully."
        : "File uploaded, but text extraction failed.",
      fileUrl,
      contractId,
      extracted: !!rawText,
      warning: extractionWarning || undefined,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: "Internal server error." },
      { status: 500 }
    );
  }
} 