import connectDB from '@/utils/DBconection';
import Design from '@/models/Design';
import logger from '@/utils/logger';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    await connectDB();
    const { id } = params;
    logger.debug(`Attempting to retrieve image for design ID: ${id}`);

    try {
        const design = await Design.findById(id).select('imageData imageMimeType').lean();

        if (!design) {
            logger.warn(`Design with ID ${id} not found.`);
            return new NextResponse('Image not found', { status: 404 });
        }

        if (!design.imageData || !design.imageMimeType) {
            logger.warn(`Image data or mime type missing for design ID: ${id}`);
            return new NextResponse('Image data missing', { status: 404 });
        }

        // Set the appropriate content type header
        const headers = new Headers();
        headers.set('Content-Type', design.imageMimeType);
        headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // Cache for 1 year

        // Return the image data as a Buffer
        return new NextResponse(design.imageData, { status: 200, headers });

    } catch (error) {
        logger.error(`Error retrieving image for design ID ${id}:`, error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
