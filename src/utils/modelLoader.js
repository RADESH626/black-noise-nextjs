// src/utils/modelLoader.js
import mongoose from 'mongoose';
import connectDB from './DBconection';
import '../models'; // Asegura que todos los modelos se registren al importar este archivo
import logger from './logger'; // Import the logger utility

export async function getModel(modelName) {
    logger.debug(`Attempting to get model: ${modelName}`);
    await connectDB(); // Asegura que la base de datos esté conectada

    if (mongoose.models[modelName]) {
        logger.debug(`Model '${modelName}' found in mongoose.models. Returning existing model.`);
        return mongoose.models[modelName];
    }

    logger.debug(`Model '${modelName}' not found in mongoose.models. Attempting to get it via mongoose.model().`);
    try {
        const modelInstance = mongoose.model(modelName);
        logger.debug(`Successfully retrieved model '${modelName}' via mongoose.model().`);
        return modelInstance;
    } catch (error) {
        logger.error(`Error retrieving model '${modelName}': ${error.message}`);
        throw error; // Re-throw the error to propagate it
    }
}
