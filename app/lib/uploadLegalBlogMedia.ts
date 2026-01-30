"use client";

/**
 * Upload a file to DigitalOcean Spaces via presigned URL (direct browser upload).
 * This bypasses Vercel's 4.5MB body size limit.
 */
export async function uploadToLegalBucket(
  bucketName: 'legal-blog-images' | 'legal-blog-media',
  file: File
): Promise<string | null> {
  try {
    // Step 1: Get presigned URL from our API
    const res = await fetch('/api/upload/spaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
        folder: bucketName,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error(`Error uploading to ${bucketName}:`, data.error);
      return null;
    }

    // Step 2: Upload directly to DO Spaces using presigned URL
    const upload = await fetch(data.presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
        'x-amz-acl': 'public-read',
        'Cache-Control': 'max-age=31536000',
      },
      body: file,
    });

    if (!upload.ok) {
      console.error(`Failed to upload to ${bucketName}`);
      return null;
    }

    return data.publicUrl;
  } catch (error) {
    console.error(`Error uploading to ${bucketName}:`, error);
    return null;
  }
}
