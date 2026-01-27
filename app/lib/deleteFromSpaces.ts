"use client";

/**
 * Delete a file from DigitalOcean Spaces via our API route
 * @param url - The full URL of the file to delete
 */
export async function deleteFromSpaces(url: string): Promise<boolean> {
  if (!url) return true;

  try {
    const response = await fetch('/api/upload/spaces/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const result = await response.json();

    if (!response.ok && !result.skipped) {
      console.error('Delete error:', result.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}
