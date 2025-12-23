// app/api/service-cards/upload-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const cardId = formData.get('cardId') as string;
    const oldImageUrl = formData.get('oldImageUrl') as string;

    // Validate inputs
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!cardId) {
      return NextResponse.json(
        { error: 'No card ID provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${cardId}-${timestamp}.${fileExt}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('service-cards')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('service-cards')
      .getPublicUrl(fileName);

    if (!urlData.publicUrl) {
      return NextResponse.json(
        { error: 'Failed to generate public URL' },
        { status: 500 }
      );
    }

    // Update database record with new image URL
    const { error: updateError } = await supabase
      .from('service_cards')
      .update({ 
        image_url: urlData.publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', cardId);

    if (updateError) {
      console.error('Database update error:', updateError);
      
      // Attempt to clean up uploaded file
      await supabase.storage
        .from('service-cards')
        .remove([fileName]);

      return NextResponse.json(
        { error: `Database update failed: ${updateError.message}` },
        { status: 500 }
      );
    }

    // Delete old image if it exists and is from our storage
    if (oldImageUrl && oldImageUrl.includes('supabase.co/storage')) {
      try {
        const oldFileName = oldImageUrl.split('/').pop();
        if (oldFileName && oldFileName !== fileName) {
          await supabase.storage
            .from('service-cards')
            .remove([oldFileName]);
        }
      } catch (deleteError) {
        // Log but don't fail the request if old file deletion fails
        console.warn('Failed to delete old file:', deleteError);
      }
    }

    return NextResponse.json({
      success: true,
      imageUrl: urlData.publicUrl,
      message: 'Image uploaded successfully'
    });

  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Add a GET handler to check if the endpoint is working
export async function GET() {
  return NextResponse.json({
    message: 'Service cards image upload endpoint',
    status: 'operational'
  });
}