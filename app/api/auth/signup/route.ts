import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const users = existingUsers?.users || [];
    const existingUser = users.find((u: any) => u.email === email);
    
    if (existingUser) {
      // Delete existing user and recreate fresh
      await supabase.auth.admin.deleteUser(existingUser.id);
    }

    // Create user with email verification required
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: {
        name,
        is_admin: true,
        created_at: new Date().toISOString()
      }
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Manually send OTP email (admin.createUser doesn't auto-send)
    const { error: otpError } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email: email,
      password: password,
    });

    if (otpError) {
      console.error('Failed to send OTP:', otpError);
      // Don't fail the request, user can resend from verify page
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      requiresVerification: true
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
