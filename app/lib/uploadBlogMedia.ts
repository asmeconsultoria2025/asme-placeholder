"use client";

/**
 * Upload a file to DigitalOcean Spaces via our API route
 * @param bucket - The folder to upload to: 'blog-images' or 'blog-media'
 * @param file - The file to upload
 * @returns The public URL of the uploaded file
 */
export async function uploadToBucket(bucket: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', bucket);

  const response = await fetch('/api/upload/spaces', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    console.error('Upload error:', result.error);
    throw new Error(result.error || 'Error uploading file');
  }

  return result.url;
}
