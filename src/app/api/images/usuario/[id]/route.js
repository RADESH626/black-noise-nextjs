import { NextResponse } from 'next/server';
import connectDB from '@/utils/DBconection';
import getUsuarioModel from '@/models/Usuario';

export async function GET(request, { params }) {
    // console.log('GET request received for user image.');
    // console.log('Params received (before await):', params);

    await connectDB();
    // Await params to resolve the promise-like object
    const resolvedParams = await params;
    const id = resolvedParams.id;
    // console.log('Extracted ID (after await):', id);

    try {
        const Usuario = await getUsuarioModel();
        // console.log('Usuario model obtained.');
        const user = await Usuario.findById(id).lean();
        console.log('User found:', !!user);

        if (!user || !user.imageData || !user.imageMimeType) {
            console.log('No user or image data found for ID:', id);
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

        console.log('Image data found. Mime type:', user.imageMimeType);
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
