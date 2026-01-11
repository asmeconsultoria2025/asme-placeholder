import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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

    // Use standard signup flow (not admin.createUser) to trigger OTP
    // First, create a client with anon key for user signup
    const anonSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Use signUp instead of admin.createUser - this triggers OTP email
    const { data, error } = await anonSupabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          is_admin: true,
          created_at: new Date().toISOString()
        }
      }
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
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
