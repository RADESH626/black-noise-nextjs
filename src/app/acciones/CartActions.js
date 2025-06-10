"use server"

import connectDB from '@/utils/DBconection';
import Cart from '@/models/Cart';
import Design from '@/models/Design'; // Import Design model
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function addDesignToCart(userId, designId) {
    await connectDB();
    console.log(`DEBUG: Entering addDesignToCart for userId: ${userId}, designId: ${designId}`);

    if (!userId || !designId) {
        return { success: false, message: 'User ID and Design ID are required.' };
    }

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // If no cart exists for the user, create a new one
            cart = await Cart.create({ userId, designIds: [designId] });
            console.log('DEBUG: New cart created:', cart);
        } else {
            // If cart exists, add designId if not already present
            if (!cart.designIds.includes(designId)) {
                cart.designIds.push(designId);
                await cart.save();
                console.log('DEBUG: Design added to existing cart:', cart);
            } else {
                console.log('DEBUG: Design already in cart, no action needed.');
                return { success: true, message: 'Design already in cart.' };
            }
        }

        revalidatePath('/perfil'); // Revalidate profile page to reflect cart changes
        revalidatePath('/carrito'); // Revalidate cart page

        return { success: true, message: 'Design added to cart successfully.', data: JSON.parse(JSON.stringify(cart)) };
    } catch (error) {
        console.error('ERROR in addDesignToCart:', error);
        return { success: false, message: 'Error adding design to cart: ' + error.message };
    }
}

export async function removeDesignFromCart(userId, designId) {
    await connectDB();
    console.log(`DEBUG: Entering removeDesignFromCart for userId: ${userId}, designId: ${designId}`);

    if (!userId || !designId) {
        return { success: false, message: 'User ID and Design ID are required.' };
    }

    try {
        let cart = await Cart.findOne({ userId });

        if (cart) {
            const initialLength = cart.designIds.length;
            cart.designIds = cart.designIds.filter(id => id !== designId);
            if (cart.designIds.length < initialLength) {
                await cart.save();
                console.log('DEBUG: Design removed from cart:', cart);
                revalidatePath('/perfil');
                revalidatePath('/carrito');
                return { success: true, message: 'Design removed from cart successfully.' };
            } else {
                console.log('DEBUG: Design not found in cart, no action needed.');
                return { success: true, message: 'Design not found in cart.' };
            }
        } else {
            console.log('DEBUG: Cart not found for user, no action needed.');
            return { success: true, message: 'Cart not found for user.' };
        }
    } catch (error) {
        console.error('ERROR in removeDesignFromCart:', error);
        return { success: false, message: 'Error removing design from cart: ' + error.message };
    }
}

export async function getCartByUserId(userId) {
    await connectDB();
    console.log(`DEBUG: Entering getCartByUserId for userId: ${userId}`);

    if (!userId) {
        return { cart: null, error: 'User ID is required.' };
    }

    try {
        const cart = await Cart.findOne({ userId }).lean();
        if (!cart) {
            return { cart: null, error: null }; // No cart found, but not an error
        }

        // Fetch full design details for each designId in the cart
        const designDetails = await Design.find({ _id: { $in: cart.designIds } }).lean();

        // Map design details to a more usable format for the client,
        // including a default quantity of 1 for now, as the server cart only stores IDs.
        const populatedCartItems = designDetails.map(design => ({
            id: design._id.toString(),
            nombre: design.nombreDesing,
            price: design.valorDesing,
            imagen: design.imagenDesing,
            quantity: 1, // Assuming quantity is 1 for items stored by ID in DB
        }));

        // Reconstruct the cart object with populated items
        const populatedCart = {
            ...cart,
            items: populatedCartItems, // Add a new 'items' array with full design details
        };

        console.log('DEBUG: Populated cart obtained by userId:', populatedCart);
        return { cart: JSON.parse(JSON.stringify(populatedCart)), error: null };
    } catch (error) {
        console.error('ERROR in getCartByUserId:', error);
        return { cart: null, error: 'Error obtaining cart by user ID: ' + error.message };
    }
}

export async function clearUserCart(userId) {
    await connectDB();
    console.log(`DEBUG: Entering clearUserCart for userId: ${userId}`);

    if (!userId) {
        return { success: false, message: 'User ID is required.' };
    }

    try {
        const result = await Cart.findOneAndUpdate(
            { userId },
            { $set: { designIds: [] } },
            { new: true }
        ).lean();

        if (result) {
            console.log('DEBUG: Cart cleared successfully for userId:', userId);
            revalidatePath('/perfil');
            revalidatePath('/carrito');
            return { success: true, message: 'Cart cleared successfully.' };
        } else {
            console.log('DEBUG: Cart not found for user, nothing to clear.');
            return { success: true, message: 'Cart not found for user.' };
        }
    } catch (error) {
        console.error('ERROR in clearUserCart:', error);
        return { success: false, message: 'Error clearing cart: ' + error.message };
    }
}
