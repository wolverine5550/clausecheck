"use server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { extractRawText } from '@/lib/utils/extract-raw-text';

const RATE_LIMIT = 5; // uploads per hour
const RATE_LIMIT_WINDOW = 60 * 60; // 1 hour in seconds
const BUCKET_NAME = "contracts";

export async function POST(request: Request) {
  try {
    // Use cookies() synchronously for Supabase session detection
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
    const { error: dbError } = await supabase.from("contracts").insert({
      user_id: user.id,
      file_name: (file as File).name,
      file_url: fileUrl,
      uploaded_at: new Date().toISOString(),
      raw_text: rawText,
    });
    if (dbError) {
      console.error("DB insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save contract metadata", message: "Failed to save contract metadata." },
        { status: 500 }
      );
    }

    // Always return a message field. If extraction failed, include warning.
    return NextResponse.json({
      success: true,
      message: rawText
        ? "File uploaded and text extracted successfully."
        : "File uploaded, but text extraction failed.",
      fileUrl,
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