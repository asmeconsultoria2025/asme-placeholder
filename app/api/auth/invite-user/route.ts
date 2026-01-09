import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { email, role = 'team_member' } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Create user with admin API - sends invite email automatically
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://asmeconsultoria.com';
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${baseUrl}/set-password`,
      data: {
        role: role,
        invited_at: new Date().toISOString()
      }
    });

    if (error) {
      console.error('Invite error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      user: data.user,
      message: 'Invite sent successfully' 
    });

  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
