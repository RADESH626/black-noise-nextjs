import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  items: [
    {
      designId: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId to reference Design model
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proveedor',
        required: false, // Make it optional, as a design might not always have a direct supplier in all contexts
      },
    },
  ],
});

const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);

export default Cart;
