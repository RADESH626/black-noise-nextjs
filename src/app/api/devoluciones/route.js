import { NextResponse } from 'next/server';
import { sendEmail } from '@/utils/nodemailer';

export async function POST(request) {
  try {
    const { pedidoId, returnReason } = await request.json();

    console.log('Pedido ID:', pedidoId);
    console.log('Razón de la devolución:', returnReason);

    // TODO: Get supplier email from database based on pedidoId
    const supplierEmail = 'test@example.com';

    const emailSubject = `Solicitud de Devolución para el pedido ${pedidoId}`;
    const emailBody = `Se ha solicitado una devolución para el pedido ${pedidoId} con la siguiente razón: ${returnReason}`;

    await sendEmail({ to: supplierEmail, subject: emailSubject, body: emailBody });

    return NextResponse.json({ message: 'Solicitud de devolución enviada correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al enviar la solicitud de devolución:', error);
    return NextResponse.json({ message: 'Error al enviar la solicitud de devolución' }, { status: 500 });
  }
}
