"use client";

/**
 * Upload a file to DigitalOcean Spaces via presigned URL (direct browser upload).
 * This bypasses Vercel's 4.5MB body size limit.
 */
export async function uploadToBucket(bucket: string, file: File): Promise<string> {
  // Step 1: Get presigned URL from our API
  const res = await fetch('/api/upload/spaces', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
      folder: bucket,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to get upload URL');

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

  if (!upload.ok) throw new Error('Failed to upload file to storage');

  return data.publicUrl;
}
