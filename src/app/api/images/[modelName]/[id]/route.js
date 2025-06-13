import { NextResponse } from 'next/server';
import connectDB from '@/utils/DBconection';
import Design from '@/models/Design';
import Usuario from '@/models/Usuario';
import logger from '@/utils/logger';

export async function GET(request, { params }) {
    await connectDB();
    const { modelName, id } = await params;

    logger.debug(`Attempting to retrieve image for model: ${modelName}, ID: ${id}`);

    let Model;
    switch (modelName) {
        case 'design':
            Model = Design;
            break;
        case 'usuario':
            Model = Usuario;
            break;
        default:
            logger.warn(`Invalid modelName requested: ${modelName}`);
            return NextResponse.json({ error: 'Modelo no válido.' }, { status: 400 });
    }

    try {
        const document = await Model.findById(id).lean();

        if (!document) {
            logger.warn(`Document not found for model: ${modelName}, ID: ${id}`);
            return NextResponse.json({ error: 'Imagen no encontrada.' }, { status: 404 });
        }

        const imageData = document.imageData;
        const imageMimeType = document.imageMimeType;

        logger.debug(`[GET /api/images] Retrieved imageData length: ${imageData ? imageData.length : 'null'}, MimeType: ${imageMimeType}`);
        if (imageData) {
            logger.debug(`[GET /api/images] Retrieved imageData hex snippet: ${imageData.toString('hex').substring(0, 60)}...`);
        }

        if (!imageData || !imageMimeType) {
            logger.warn(`Image data or mime type missing for model: ${modelName}, ID: ${id}`);
            return NextResponse.json({ error: 'Datos de imagen incompletos.' }, { status: 404 });
        }

        // Set appropriate headers for image response
        const headers = new Headers();
        headers.set('Content-Type', imageMimeType);
        headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // Cache for 1 year

        return new NextResponse(imageData, { status: 200, headers });

    } catch (error) {
        logger.error(`ERROR retrieving image for model: ${modelName}, ID: ${id}:`, error);
        return NextResponse.json({ error: 'Error interno del servidor al obtener la imagen.' }, { status: 500 });
    }
}
