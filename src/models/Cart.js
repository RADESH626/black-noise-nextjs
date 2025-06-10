import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  designIds: {
    type: [String],
    default: [],
  },
});

const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);

export default Cart;
