import { Schema, model, models } from 'mongoose';
import connectDB from '@/utils/DBconection';

let mongoose;

async function getMongoose() {
  if (!mongoose) {
    const { mongoose: mongooseInstance } = await connectDB();
    mongoose = mongooseInstance;
  }
  return mongoose;
}

const CartSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  items: [
    {
      designId: {
        type: Schema.Types.ObjectId, // Use ObjectId to reference Design model
        ref: 'Design', // Reference the Design model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
      },
      proveedorId: {
        type: Schema.Types.ObjectId,
        ref: 'Proveedor',
        required: false, // Make it optional, as a design might not always have a direct supplier in all contexts
      },
    },
  ],
});

// Check if the model exists before creating a new one
export default async function getCartModel() {
  const mongooseInstance = await getMongoose();
  return mongooseInstance.models.Cart || model('Cart', CartSchema);
}
