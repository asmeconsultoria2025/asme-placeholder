// app/api/service-cards/upload-image/route.ts
// This is the CORRECT, COMPLETE API route for uploads

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// CRITICAL: This must use service role key, not anon key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ← Must be service role key
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const cardId = formData.get('cardId') as string;

    if (!file || !cardId) {
      return NextResponse.json(
        { error: 'Missing file or cardId' },
        { status: 400 }
      );
    }

    // Check if SUPABASE_SERVICE_ROLE_KEY exists
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: Missing service role key' },
        { status: 500 }
      );
    }

    // Get current card to find old image
    const { data: card, error: fetchError } = await supabase
      .from('service_cards')
      .select('image_url')
      .eq('id', cardId)
      .single();

    if (fetchError) {
      console.error('Error fetching card:', fetchError);
      return NextResponse.json(
        { error: 'Card not found: ' + fetchError.message },
        { status: 404 }
      );
    }

    // Delete old image if it exists and is in our bucket
    if (card.image_url && card.image_url.includes('service-cards')) {
      const oldPath = card.image_url.split('/').pop();
      if (oldPath) {
        const { error: deleteError } = await supabase.storage
          .from('service-cards')
          .remove([oldPath]);
        
        if (deleteError) {
          console.warn('Could not delete old image:', deleteError);
          // Continue anyway - not critical
        }
      }
    }

    // Upload new image
    const fileExt = file.name.split('.').pop();
    const fileName = `${cardId}-${Date.now()}.${fileExt}`;
    const fileBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from('service-cards')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Upload failed: ' + uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('service-cards')
      .getPublicUrl(fileName);

    if (!urlData.publicUrl) {
      return NextResponse.json(
        { error: 'Failed to get public URL' },
        { status: 500 }
      );
    }

    // Update database
    const { error: updateError } = await supabase
      .from('service_cards')
      .update({ image_url: urlData.publicUrl })
      .eq('id', cardId);

    if (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update database: ' + updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      imageUrl: urlData.publicUrl 
    });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}