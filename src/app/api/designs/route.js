import { NextResponse } from 'next/server';
import getDesignModel from '@/models/Design';
import connectDB from '@/utils/DBconection';

export async function GET(request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: "Missing userId parameter" }, { status: 400 });
    }

    const Design = getDesignModel(); // Get the Design model
    const designs = await Design.find({ usuarioId: userId }); // Use usuarioId as per schema

    return NextResponse.json(designs, { status: 200 });
  } catch (error) {
    console.error("Error fetching designs:", error);
    return NextResponse.json({ message: "Error fetching designs" }, { status: 500 });
  }
}
