// app/api/upload/spaces/delete/route.ts
// API route for deleting files from DigitalOcean Spaces

import { NextRequest, NextResponse } from 'next/server';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  forcePathStyle: false,
  endpoint: `https://${process.env.DIGITALOCEAN_REGION}.digitaloceanspaces.com`,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.DIGITALOCEAN_ACCESS_KEY!,
    secretAccessKey: process.env.DIGITALOCEAN_SECRET_KEY!,
  },
});

const SPACE_NAME = process.env.DIGITALOCEAN_SPACE_NAME!;
const REGION = process.env.DIGITALOCEAN_REGION!;
const DO_BASE_URL = `https://${SPACE_NAME}.${REGION}.digitaloceanspaces.com`;

/**
 * Extract the key (path) from a DigitalOcean Spaces URL
 */
function extractKeyFromUrl(url: string): string | null {
  if (!url) return null;

  // Handle DO Spaces URLs: https://space-name.region.digitaloceanspaces.com/folder/file.ext
  if (url.includes('digitaloceanspaces.com')) {
    const urlObj = new URL(url);
    // Remove leading slash from pathname
    return urlObj.pathname.slice(1);
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'No URL provided' },
        { status: 400 }
      );
    }

    // Only delete files from our DigitalOcean Space
    if (!url.includes('digitaloceanspaces.com')) {
      return NextResponse.json(
        { error: 'URL is not from DigitalOcean Spaces', skipped: true },
        { status: 200 }
      );
    }

    const key = extractKeyFromUrl(url);

    if (!key) {
      return NextResponse.json(
        { error: 'Could not extract file key from URL' },
        { status: 400 }
      );
    }

    const deleteCommand = new DeleteObjectCommand({
      Bucket: SPACE_NAME,
      Key: key,
    });

    await s3Client.send(deleteCommand);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
      key,
    });

  } catch (error: unknown) {
    console.error('Delete error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Delete failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
