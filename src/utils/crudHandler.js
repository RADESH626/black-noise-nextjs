import { NextResponse } from 'next/server';
import connectDB from '@/utils/DBconection';
import { handleError, NotFoundError, ValidationError } from './errorHandler';

export const createHandler = (Model, requiredFields = []) => async (request) => {
    try {
        await connectDB();
        const data = await request.json();

        // Basic validation for required fields
        if (requiredFields.length > 0) {
            const missingFields = requiredFields.filter(field => !data[field]);
            if (missingFields.length > 0) {
                throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
            }
        }

        const newItem = new Model(data);
        const savedItem = await newItem.save();

        return NextResponse.json({
            success: true,
            message: `${Model.modelName} created successfully`,
            data: savedItem.toObject()
        }, { status: 201 });

    } catch (error) {
        if (error instanceof ValidationError) {
            return handleError(error, error.message, error.statusCode);
        }
        return handleError(error, `Error creating ${Model.modelName}`);
    }
};

export const getAllHandler = (Model, populateFields = []) => async () => {
    try {
        await connectDB();
        let query = Model.find({}, { fue_cancelado: 1 }); // Include fue_cancelado field

        if (populateFields.length > 0) {
            populateFields.forEach(field => {
                query = query.populate(field);
            });
        }

        const items = await query.lean().sort({ createdAt: -1 }).exec();

        const serializedItems = items.map(item => {
            const serializedItem = { ...item, _id: item._id.toString() };
            // Convert Date objects to ISO strings for consistency
            for (const key in serializedItem) {
                if (serializedItem[key] instanceof Date) {
                    serializedItem[key] = serializedItem[key].toISOString();
                }
            }
            return serializedItem;
        });

        return NextResponse.json({
            data: serializedItems,
            count: serializedItems.length
        });
    } catch (error) {
        return handleError(error, `Error fetching ${Model.modelName}s`);
    }
};

export const getByIdHandler = (Model, populateFields = []) => async (request, { params }) => {
    try {
        await connectDB();
        const { id } = params;
        let query = Model.findById(id, { fue_cancelado: 1 }); // Include fue_cancelado field

        if (populateFields.length > 0) {
            populateFields.forEach(field => {
                query = query.populate(field);
            });
        }

        const item = await query.lean().exec();

        if (!item) {
            throw new NotFoundError(`${Model.modelName} not found`);
        }

        const serializedItem = { ...item, _id: item._id.toString() };
        for (const key in serializedItem) {
            if (serializedItem[key] instanceof Date) {
                serializedItem[key] = serializedItem[key].toISOString();
            }
        }

        return NextResponse.json({ data: serializedItem });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return handleError(error, error.message, error.statusCode);
        }
        return handleError(error, `Error fetching ${Model.modelName}`);
    }
};

export const updateHandler = (Model, requiredFields = []) => async (request, { params }) => {
    try {
        await connectDB();
        const { id } = params;
        const data = await request.json();

        // Basic validation for required fields
        if (requiredFields.length > 0) {
            const missingFields = requiredFields.filter(field => !data[field]);
            if (missingFields.length > 0) {
                throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
            }
        }

        const updatedItem = await Model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean().exec();

        if (!updatedItem) {
            throw new NotFoundError(`${Model.modelName} not found`);
        }

        const serializedItem = { ...updatedItem, _id: updatedItem._id.toString() };
        for (const key in serializedItem) {
            if (serializedItem[key] instanceof Date) {
                serializedItem[key] = serializedItem[key].toISOString();
            }
        }

        return NextResponse.json({
            success: true,
            message: `${Model.modelName} updated successfully`,
            data: serializedItem
        });
    } catch (error) {
        if (error instanceof ValidationError || error instanceof NotFoundError) {
            return handleError(error, error.message, error.statusCode);
        }
        return handleError(error, `Error updating ${Model.modelName}`);
    }
};

export const deleteHandler = (Model) => async (request, { params }) => {
    try {
        await connectDB();
        const { id } = params;

        const deletedItem = await Model.findByIdAndDelete(id).exec();

        if (!deletedItem) {
            throw new NotFoundError(`${Model.modelName} not found`);
        }

        return NextResponse.json({
            success: true,
            message: `${Model.modelName} deleted successfully`
        });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return handleError(error, error.message, error.statusCode);
        }
        return handleError(error, `Error deleting ${Model.modelName}`);
    }
};
