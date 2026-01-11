import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  getContactEmailTemplate,
  getLegalAppointmentEmailTemplate,
  getASMEAppointmentEmailTemplate,
} from '@/app/lib/email-templates';

export const dynamic = 'force-dynamic';

// GET - Fetch appointments from database
export async function GET(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    if (all) {
      // Return all appointments
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ data: data || [], totalPages: 1 });
    }

    // Paginated
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('appointments')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({ data: data || [], totalPages });
  } catch (err: any) {
    console.error('GET /api/appointments error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Moved inside the handler to avoid execution at build time
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const body = await request.json();
    const { name, email, phone, message, service, participants, source } = body;

    let emailHtml = '';
    let subject = '';

    if (source === 'legal') {
      subject = `⚖️ Nueva Cita Legal - ${service}`;
      emailHtml = getLegalAppointmentEmailTemplate({
        name,
        email,
        phone,
        service,
      });
    } else if (source === 'asme') {
      subject = `🛡️ Nueva Cita ASME - ${service}`;
      emailHtml = getASMEAppointmentEmailTemplate({
        name,
        email,
        phone,
        service,
        participants,
      });
    } else {
      subject = '📧 Nuevo Mensaje de Contacto';
      emailHtml = getContactEmailTemplate({
        name,
        email,
        phone,
        message,
      });
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.RESEND_TO_EMAIL!,
      subject: subject,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}