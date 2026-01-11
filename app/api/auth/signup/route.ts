import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    console.log('[SIGNUP] Starting signup request');
    console.log('[SIGNUP] Supabase URL:', supabaseUrl);
    console.log('[SIGNUP] Has Anon Key:', !!supabaseAnonKey);

    const { email, password, name } = await request.json();
    console.log('[SIGNUP] Request data:', { email, hasPassword: !!password, name });

    if (!email || !password) {
      console.log('[SIGNUP] Missing email or password');
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Use the anon client to do a proper signup (not admin API)
    // This ensures OTP tokens are generated correctly
    const anonSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('[SIGNUP] Signing up user with regular flow...');
    const { data: signupData, error: signupError } = await anonSupabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          is_admin: true,
          created_at: new Date().toISOString()
        },
        emailRedirectTo: undefined, // No redirect, pure OTP
      }
    });

    if (signupError) {
      console.log('[SIGNUP] Signup error:', signupError);
      return NextResponse.json({ error: signupError.message }, { status: 400 });
    }

    console.log('[SIGNUP] User created:', signupData.user?.id);
    console.log('[SIGNUP] User confirmation status:', signupData.user?.email_confirmed_at ? 'confirmed' : 'pending');

    return NextResponse.json({
      success: true,
      user: signupData.user,
      requiresVerification: !signupData.user?.email_confirmed_at
    });

  } catch (error: any) {
    console.error('[SIGNUP] Caught exception:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
