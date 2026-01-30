// app/api/upload/spaces/route.ts
// API route that generates presigned URLs for direct browser-to-DO Spaces uploads

import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const dynamic = 'force-dynamic';

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

const ALLOWED_FOLDERS = [
  'blog-images',
  'blog-media',
  'legal-blog-images',
  'legal-blog-media',
];

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DIGITALOCEAN_ACCESS_KEY || !process.env.DIGITALOCEAN_SECRET_KEY) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const { fileName, contentType, folder } = await request.json();

    if (!fileName || !contentType || !folder) {
      return NextResponse.json({ error: 'Missing fileName, contentType, or folder' }, { status: 400 });
    }

    if (!ALLOWED_FOLDERS.includes(folder)) {
      return NextResponse.json({ error: `Invalid folder. Allowed: ${ALLOWED_FOLDERS.join(', ')}` }, { status: 400 });
    }

    // Generate unique key
    const timestamp = Date.now();
    const ext = fileName.split('.').pop()?.toLowerCase() || 'bin';
    const sanitized = fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .substring(0, 50);
    const key = `${folder}/${timestamp}-${sanitized}.${ext}`;

    // Generate presigned URL (valid for 10 minutes)
    const command = new PutObjectCommand({
      Bucket: SPACE_NAME,
      Key: key,
      ContentType: contentType,
      ACL: 'public-read',
      CacheControl: 'max-age=31536000',
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });
    const publicUrl = `https://${SPACE_NAME}.${REGION}.digitaloceanspaces.com/${key}`;

    return NextResponse.json({ presignedUrl, publicUrl, key });
  } catch (error: unknown) {
    console.error('Presign error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to generate upload URL: ${msg}` }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'DigitalOcean Spaces upload endpoint',
    status: 'operational',
    spaceName: SPACE_NAME,
    region: REGION,
  });
}
