#!/usr/bin/env node

/**
 * Migration Script: Supabase Storage → DigitalOcean Spaces
 *
 * This script:
 * 1. Fetches all blog posts from Supabase database
 * 2. Downloads media files from Supabase Storage
 * 3. Uploads them to DigitalOcean Spaces
 * 4. Updates database URLs to point to DigitalOcean
 *
 * Usage: node scripts/migrate-to-digitalocean.mjs
 *
 * Make sure to set environment variables in .env.local before running.
 */

import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env.local') });

// Validate environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'DIGITALOCEAN_ACCESS_KEY',
  'DIGITALOCEAN_SECRET_KEY',
  'DIGITALOCEAN_SPACE_NAME',
  'DIGITALOCEAN_REGION',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Initialize S3 client for DigitalOcean Spaces
const s3Client = new S3Client({
  forcePathStyle: false,
  endpoint: `https://${process.env.DIGITALOCEAN_REGION}.digitaloceanspaces.com`,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.DIGITALOCEAN_ACCESS_KEY,
    secretAccessKey: process.env.DIGITALOCEAN_SECRET_KEY,
  },
});

const SPACE_NAME = process.env.DIGITALOCEAN_SPACE_NAME;
const REGION = process.env.DIGITALOCEAN_REGION;
const DO_BASE_URL = `https://${SPACE_NAME}.${REGION}.digitaloceanspaces.com`;

// Track migration stats
const stats = {
  totalPosts: 0,
  migratedFiles: 0,
  skippedFiles: 0,
  failedFiles: 0,
  updatedPosts: 0,
};

/**
 * Check if URL is from Supabase storage
 */
function isSupabaseUrl(url) {
  return url && url.includes('supabase.co/storage');
}

/**
 * Extract filename from Supabase URL
 */
function extractFilename(url) {
  if (!url) return null;
  const parts = url.split('/');
  return parts[parts.length - 1];
}

/**
 * Determine folder based on original bucket
 */
function determineFolder(url) {
  if (url.includes('/blog-images/')) return 'blog-images';
  if (url.includes('/blog-media/')) return 'blog-media';
  if (url.includes('/legal-blog-images/')) return 'legal-blog-images';
  if (url.includes('/legal-blog-media/')) return 'legal-blog-media';
  return 'misc';
}

/**
 * Download file from URL
 */
async function downloadFile(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    return { buffer: Buffer.from(buffer), contentType };
  } catch (error) {
    console.error(`  ❌ Failed to download: ${error.message}`);
    return null;
  }
}

/**
 * Upload file to DigitalOcean Spaces
 */
async function uploadToSpaces(buffer, key, contentType) {
  try {
    const command = new PutObjectCommand({
      Bucket: SPACE_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: 'public-read',
      CacheControl: 'max-age=31536000',
    });

    await s3Client.send(command);
    return `${DO_BASE_URL}/${key}`;
  } catch (error) {
    console.error(`  ❌ Failed to upload: ${error.message}`);
    return null;
  }
}

/**
 * Migrate a single file
 */
async function migrateFile(url) {
  if (!url || !isSupabaseUrl(url)) {
    return url; // Return as-is if not a Supabase URL
  }

  const filename = extractFilename(url);
  const folder = determineFolder(url);
  const key = `${folder}/${filename}`;

  console.log(`  📥 Downloading: ${filename}`);
  const downloaded = await downloadFile(url);

  if (!downloaded) {
    stats.failedFiles++;
    return url; // Keep original URL if download fails
  }

  console.log(`  📤 Uploading to: ${key}`);
  const newUrl = await uploadToSpaces(downloaded.buffer, key, downloaded.contentType);

  if (!newUrl) {
    stats.failedFiles++;
    return url; // Keep original URL if upload fails
  }

  stats.migratedFiles++;
  console.log(`  ✅ Migrated: ${newUrl}`);
  return newUrl;
}

/**
 * Migrate blogs table
 */
async function migrateBlogs() {
  console.log('\n📚 Migrating blogs table...\n');

  const { data: posts, error } = await supabase
    .from('blogs')
    .select('id, title, featured_image, media_url');

  if (error) {
    console.error('❌ Failed to fetch blogs:', error.message);
    return;
  }

  console.log(`Found ${posts.length} blog posts\n`);
  stats.totalPosts += posts.length;

  for (const post of posts) {
    console.log(`\n📝 Processing: "${post.title}" (ID: ${post.id})`);

    let featuredImage = post.featured_image;
    let mediaUrl = post.media_url;
    let needsUpdate = false;

    // Migrate featured image
    if (isSupabaseUrl(featuredImage)) {
      const newUrl = await migrateFile(featuredImage);
      if (newUrl !== featuredImage) {
        featuredImage = newUrl;
        needsUpdate = true;
      }
    } else if (featuredImage) {
      console.log('  ⏭️  Featured image already migrated or external');
      stats.skippedFiles++;
    }

    // Migrate media file
    if (isSupabaseUrl(mediaUrl)) {
      const newUrl = await migrateFile(mediaUrl);
      if (newUrl !== mediaUrl) {
        mediaUrl = newUrl;
        needsUpdate = true;
      }
    } else if (mediaUrl) {
      console.log('  ⏭️  Media URL already migrated or external');
      stats.skippedFiles++;
    }

    // Update database if URLs changed
    if (needsUpdate) {
      const { error: updateError } = await supabase
        .from('blogs')
        .update({
          featured_image: featuredImage,
          media_url: mediaUrl,
        })
        .eq('id', post.id);

      if (updateError) {
        console.error(`  ❌ Failed to update database: ${updateError.message}`);
      } else {
        stats.updatedPosts++;
        console.log('  💾 Database updated');
      }
    }
  }
}

/**
 * Migrate legal_blogs table
 */
async function migrateLegalBlogs() {
  console.log('\n⚖️  Migrating legal_blogs table...\n');

  const { data: posts, error } = await supabase
    .from('legal_blogs')
    .select('id, title, featured_image, media_url');

  if (error) {
    console.error('❌ Failed to fetch legal_blogs:', error.message);
    return;
  }

  console.log(`Found ${posts.length} legal blog posts\n`);
  stats.totalPosts += posts.length;

  for (const post of posts) {
    console.log(`\n📝 Processing: "${post.title}" (ID: ${post.id})`);

    let featuredImage = post.featured_image;
    let mediaUrl = post.media_url;
    let needsUpdate = false;

    // Migrate featured image
    if (isSupabaseUrl(featuredImage)) {
      const newUrl = await migrateFile(featuredImage);
      if (newUrl !== featuredImage) {
        featuredImage = newUrl;
        needsUpdate = true;
      }
    } else if (featuredImage) {
      console.log('  ⏭️  Featured image already migrated or external');
      stats.skippedFiles++;
    }

    // Migrate media file
    if (isSupabaseUrl(mediaUrl)) {
      const newUrl = await migrateFile(mediaUrl);
      if (newUrl !== mediaUrl) {
        mediaUrl = newUrl;
        needsUpdate = true;
      }
    } else if (mediaUrl) {
      console.log('  ⏭️  Media URL already migrated or external');
      stats.skippedFiles++;
    }

    // Update database if URLs changed
    if (needsUpdate) {
      const { error: updateError } = await supabase
        .from('legal_blogs')
        .update({
          featured_image: featuredImage,
          media_url: mediaUrl,
        })
        .eq('id', post.id);

      if (updateError) {
        console.error(`  ❌ Failed to update database: ${updateError.message}`);
      } else {
        stats.updatedPosts++;
        console.log('  💾 Database updated');
      }
    }
  }
}

/**
 * Main migration function
 */
async function main() {
  console.log('🚀 Starting Supabase → DigitalOcean Spaces Migration\n');
  console.log('Configuration:');
  console.log(`  Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
  console.log(`  DO Space: ${SPACE_NAME}`);
  console.log(`  DO Region: ${REGION}`);
  console.log(`  DO Base URL: ${DO_BASE_URL}`);
  console.log('\n' + '='.repeat(60));

  // Migrate both tables
  await migrateBlogs();
  await migrateLegalBlogs();

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Migration Summary:\n');
  console.log(`  Total posts processed: ${stats.totalPosts}`);
  console.log(`  Files migrated: ${stats.migratedFiles}`);
  console.log(`  Files skipped: ${stats.skippedFiles}`);
  console.log(`  Files failed: ${stats.failedFiles}`);
  console.log(`  Database records updated: ${stats.updatedPosts}`);

  if (stats.failedFiles > 0) {
    console.log('\n⚠️  Some files failed to migrate. Please check the logs above.');
  } else {
    console.log('\n✅ Migration completed successfully!');
  }
}

// Run migration
main().catch(console.error);
