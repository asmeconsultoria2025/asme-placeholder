// lib/uploadLegalBlogMedia.ts
// Upload helper for legal blog images and media files via DigitalOcean Spaces

"use client";

/**
 * Upload a file to DigitalOcean Spaces via our API route
 * @param bucketName - The folder to upload to: 'legal-blog-images' or 'legal-blog-media'
 * @param file - The file to upload
 * @returns The public URL of the uploaded file, or null if upload fails
 */
export async function uploadToLegalBucket(
  bucketName: 'legal-blog-images' | 'legal-blog-media',
  file: File
): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', bucketName);

    const response = await fetch('/api/upload/spaces', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error(`Error uploading to ${bucketName}:`, result.error);
      return null;
    }

    return result.url;
  } catch (error) {
    console.error(`Error uploading to ${bucketName}:`, error);
    return null;
  }
}
