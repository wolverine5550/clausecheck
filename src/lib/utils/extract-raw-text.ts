import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Extracts raw text from a file buffer based on its MIME type.
 * Supports PDF and DOCX. DOC is not supported in MVP (placeholder).
 *
 * @param fileBuffer - The file buffer (from upload or download)
 * @param mimeType - The MIME type of the file
 * @returns The extracted raw text as a string
 * @throws Error if extraction fails or file type is unsupported
 */
export async function extractRawText(fileBuffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === 'application/pdf') {
    // Extract text from PDF using pdf-parse
    const data = await pdfParse(fileBuffer);
    return data.text;
  } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    // Extract text from DOCX using mammoth
    const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
    return value;
  } else if (mimeType === 'application/msword') {
    // DOC support not implemented in MVP
    throw new Error('DOC extraction not supported in MVP.');
  } else {
    throw new Error('Unsupported file type for extraction.');
  }
}

/**
 * Unit test instructions:
 * - Place sample PDF and DOCX files in a test fixtures directory.
 * - Write tests to ensure correct extraction for each type.
 * - Test error handling for unsupported types.
 */ 