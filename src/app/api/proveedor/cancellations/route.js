import { NextResponse } from 'next/server';
import connectDB from '@/utils/DBconection';
import Pedido from '@/models/Pedido';

export async function GET() {
  try {
    await connectDB();

    // Fetch cancellations data from the database
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching cancellations:', error);
    return NextResponse.json({ message: 'Error fetching cancellations' }, { status: 500 });
  }
}
