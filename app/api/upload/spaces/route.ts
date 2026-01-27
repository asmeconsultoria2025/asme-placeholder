// app/api/upload/spaces/route.ts
// API route for uploading files to DigitalOcean Spaces

import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Next.js App Router config - no body size limit for large uploads
export const maxDuration = 300; // 5 minutes timeout
export const dynamic = 'force-dynamic';

// Initialize S3 client for DigitalOcean Spaces
const s3Client = new S3Client({
  forcePathStyle: false,
  endpoint: `https://${process.env.DIGITALOCEAN_REGION}.digitaloceanspaces.com`,
  region: 'us-east-1', // Required by SDK but doesn't affect actual location
  credentials: {
    accessKeyId: process.env.DIGITALOCEAN_ACCESS_KEY!,
    secretAccessKey: process.env.DIGITALOCEAN_SECRET_KEY!,
  },
});

const SPACE_NAME = process.env.DIGITALOCEAN_SPACE_NAME!;
const REGION = process.env.DIGITALOCEAN_REGION!;

// Allowed folders for organization
const ALLOWED_FOLDERS = [
  'blog-images',
  'blog-media',
  'legal-blog-images',
  'legal-blog-media',
];

// Max file sizes (in bytes) - No restriction for media, DO handles limits
const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 50MB for images

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.DIGITALOCEAN_ACCESS_KEY || !process.env.DIGITALOCEAN_SECRET_KEY) {
      console.error('Missing DigitalOcean credentials');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;

    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate folder
    if (!folder || !ALLOWED_FOLDERS.includes(folder)) {
      return NextResponse.json(
        { error: `Invalid folder. Allowed: ${ALLOWED_FOLDERS.join(', ')}` },
        { status: 400 }
      );
    }

    // Determine file type and validate size (only for images)
    const isMedia = folder.includes('media');

    if (!isMedia && file.size > MAX_IMAGE_SIZE) {
      const maxSizeMB = MAX_IMAGE_SIZE / (1024 * 1024);
      return NextResponse.json(
        { error: `Image size must be less than ${maxSizeMB}MB` },
        { status: 400 }
      );
    }

    // Validate file type based on folder
    if (!isMedia && !file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    if (isMedia && !file.type.startsWith('video/') && !file.type.startsWith('audio/')) {
      return NextResponse.json(
        { error: 'File must be a video or audio file' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const sanitizedName = file.name
      .replace(/\.[^/.]+$/, '') // Remove extension
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Sanitize
      .substring(0, 50); // Limit length
    const fileName = `${folder}/${timestamp}-${sanitizedName}.${fileExt}`;

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to DigitalOcean Spaces
    const uploadCommand = new PutObjectCommand({
      Bucket: SPACE_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read', // Make file publicly accessible
      CacheControl: 'max-age=31536000', // Cache for 1 year
    });

    await s3Client.send(uploadCommand);

    // Construct public URL
    // Format: https://{space-name}.{region}.digitaloceanspaces.com/{file-path}
    const publicUrl = `https://${SPACE_NAME}.${REGION}.digitaloceanspaces.com/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
      message: 'File uploaded successfully',
    });

  } catch (error: unknown) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Upload failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    message: 'DigitalOcean Spaces upload endpoint',
    status: 'operational',
    spaceName: SPACE_NAME,
    region: REGION,
  });
}
