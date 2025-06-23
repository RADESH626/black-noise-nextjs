import { NextResponse } from 'next/server';
import getPagoModel from '@/models/Pago';
import connectDB from '@/utils/DBconection';

export async function GET() {
  try {
    await connectDB();
    const Pago = await getPagoModel();
    const pagos = await Pago.find({});
    return NextResponse.json(pagos);
  } catch (error) {
    console.error('Error fetching pagos:', error);
    return NextResponse.json({ message: 'Error fetching pagos' }, { status: 500 });
  }
}
