import { NextResponse } from 'next/server';
import connectDB from '@/utils/DBconection';
import Usuario from '@/models/Usuario';

export async function GET(request, { params }) {
    await connectDB();
    const { id } = params;

    try {
        const user = await Usuario.findById(id).lean();

        if (!user || !user.imageData || !user.imageMimeType) {
            // Return a default image if no image data is found
            return new NextResponse(null, {
                status: 404,
                headers: {
                    'Content-Type': 'image/webp',
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            });
        }

        return new NextResponse(user.imageData, {
            status: 200,
            headers: {
                'Content-Type': user.imageMimeType,
                'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
            },
        });
    } catch (error) {
        console.error('Error fetching user image:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
