import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { email, token, type } = await request.json();
    console.log('[VERIFY] Verification request:', { email, token: token?.substring(0, 3) + '***', type });

    if (!email || !token) {
      console.log('[VERIFY] Missing email or token');
      return NextResponse.json({ error: 'Email and token are required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log('[VERIFY] Calling verifyOtp...');
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: type || 'signup',
    });

    if (error) {
      console.log('[VERIFY] Verification failed:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('[VERIFY] Success! User verified:', data.user?.id);
    return NextResponse.json({
      success: true,
      session: data.session,
      user: data.user
    });

  } catch (error: any) {
    console.error('[VERIFY] Caught exception:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
