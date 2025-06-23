import { NextResponse } from 'next/server';
import { Design } from '@/models/Design';
import { DBconection } from '@/utils/DBconection';

export async function GET(request) {
  try {
    await DBconection();

    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: "Missing userId parameter" }, { status: 400 });
    }

    const designs = await Design.find({ creator: userId });

    return NextResponse.json(designs, { status: 200 });
  } catch (error) {
    console.error("Error fetching designs:", error);
    return NextResponse.json({ message: "Error fetching designs" }, { status: 500 });
  }
}
