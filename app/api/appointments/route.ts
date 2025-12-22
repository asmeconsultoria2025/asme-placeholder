import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import {
  getContactEmailTemplate,
  getLegalAppointmentEmailTemplate,
  getASMEAppointmentEmailTemplate,
} from '@/app/lib/email-templates';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
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