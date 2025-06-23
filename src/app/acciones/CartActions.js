"use server"

import connectDB from '@/utils/DBconection';
import getCartModel from '@/models/Cart';
import Design from '@/models/Design'; // Import Design model
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import logger from '@/utils/logger';

export async function addDesignToCart(userId, designId) {
    await connectDB();
    logger.debug(`Entering addDesignToCart for userId: ${userId}, designId: ${designId}`);

    // Ensure designId is a string, extracting from an object if necessary
    const actualDesignId = typeof designId === 'object' && designId !== null ? designId.id : designId;

    if (!userId || !actualDesignId) {
        return { success: false, message: 'User ID and Design ID are required.' };
    }

    try {
        const Cart = await getCartModel(); // Get the Cart model
        // Fetch the design to get its proveedorId
        const design = await Design.findById(actualDesignId).lean();
        if (!design) {
            return { success: false, message: 'Design not found.' };
        }
        const proveedorId = design.proveedorId; // Get proveedorId from the Design

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // If no cart exists for the user, create a new one with the design
            cart = await Cart.create({ userId, items: [{ designId: actualDesignId, quantity: 1, proveedorId: proveedorId }] });
            logger.debug('New cart created with design:', cart);
        } else {
            // If cart exists, check if design is already present
            const itemIndex = cart.items.findIndex(item => item.designId.toString() === actualDesignId);

            if (itemIndex > -1) {
                // If design exists, increment quantity
                cart.items[itemIndex].quantity += 1;
                logger.debug('Design quantity incremented in cart:', cart);
            } else {
                // If design not present, add new item
                cart.items.push({ designId: actualDesignId, quantity: 1, proveedorId: proveedorId });
                logger.debug('New design added to existing cart:', cart);
            }
            await cart.save();
        }

        revalidatePath('/perfil'); // Revalidate profile page to reflect cart changes

        // Re-fetch and populate the cart after saving to ensure full item details are returned
        const updatedPopulatedCart = await Cart.findOne({ userId }).populate('items.designId', 'nombreDesing valorDesing imageData imageMimeType descripcion categoria proveedorId').lean();

        const populatedCartItems = (updatedPopulatedCart.items || []).map(item => ({
            id: item.designId._id.toString(),
            designId: item.designId._id,
            nombre: item.designId.nombreDesing,
            price: item.designId.valorDesing,
            descripcion: item.designId.descripcion,
            categoria: item.designId.categoria,
            imageData: item.designId.imageData ? Buffer.from(item.designId.imageData.buffer).toString('base64') : null,
            imageMimeType: item.designId.imageMimeType,
            quantity: item.quantity,
            proveedorId: item.designId.proveedorId, // Include proveedorId here
        }));

        const finalCartData = {
            ...updatedPopulatedCart,
            items: populatedCartItems,
        };

        return { success: true, message: 'Design added to cart successfully.', data: JSON.parse(JSON.stringify(finalCartData)) };
    } catch (error) {
        logger.error('ERROR in addDesignToCart:', error);
        return { success: false, message: 'Error adding design to cart: ' + error.message };
    }
}

export async function removeDesignFromCart(userId, designId) {
    await connectDB();
    logger.debug(`Entering removeDesignFromCart for userId: ${userId}, designId: ${designId}`);

    if (!userId || !designId) {
        return { success: false, message: 'User ID and Design ID are required.' };
    }

    try {
        const Cart = await getCartModel(); // Get the Cart model
        let cart = await Cart.findOne({ userId });

        if (cart) {
            const initialLength = cart.items.length;
            cart.items = cart.items.filter(item => item.designId.toString() !== designId);
            if (cart.items.length < initialLength) {
                await cart.save();
                logger.debug('Design removed from cart:', cart);
                revalidatePath('/perfil');
                return { success: true, message: 'Design removed from cart successfully.', data: JSON.parse(JSON.stringify(cart)) };
            } else {
                logger.debug('Design not found in cart, no action needed.');
                return { success: true, message: 'Design not found in cart.', data: JSON.parse(JSON.stringify(cart)) };
            }
        } else {
            logger.debug('Cart not found for user, no action needed.');
            return { success: true, message: 'Cart not found for user.', data: { items: [] } }; // Return empty cart if not found
        }
    } catch (error) {
        logger.error('ERROR in removeDesignFromCart:', error);
        return { success: false, message: 'Error removing design from cart: ' + error.message };
    }
}

export async function getCartByUserId(userId) {
    await connectDB();
    // logger.debug(`Entering getCartByUserId for userId: ${userId}`);

    if (!userId) {
        return { cart: null, error: 'User ID is required.' };
    }

    try {
        const Cart = await getCartModel(); // Get the Cart model
        // Populate the 'designId' field within the 'items' array, including imageData, imageMimeType, description, category, and proveedorId
        const cart = await Cart.findOne({ userId }).populate('items.designId', 'nombreDesing valorDesing imageData imageMimeType descripcion categoria proveedorId').lean();
        if (!cart) {
            return { cart: null, error: null }; // No cart found, but not an error
        }

        // Map populated design details to a more usable format for the client
        const populatedCartItems = (cart.items || []).map(item => ({
            id: item.designId._id.toString(),
            designId: item.designId._id, // Keep designId for order creation
            nombre: item.designId.nombreDesing,
            price: item.designId.valorDesing,
            descripcion: item.designId.descripcion, // Include description
            categoria: item.designId.categoria,     // Include category
            imageData: item.designId.imageData ? Buffer.from(item.designId.imageData.buffer).toString('base64') : null, // Convert Buffer to base64 string
            imageMimeType: item.designId.imageMimeType, // Include imageMimeType
            quantity: item.quantity, // Use the quantity from the cart item
            proveedorId: item.designId.proveedorId, // Include proveedorId here
        }));

        // Reconstruct the cart object with populated items
        const populatedCart = {
            ...cart,
            items: populatedCartItems, // Replace the original items array with the populated one
        };

        // logger.debug('Populated cart obtained by userId:', populatedCart);
        return { cart: JSON.parse(JSON.stringify(populatedCart)), error: null };
    } catch (error) {
        logger.error('ERROR in getCartByUserId:', error);
        return { cart: null, error: 'Error obtaining cart by user ID: ' + error.message };
    }
}

export async function updateCartItemQuantity(userId, designId, newQuantity) {
    await connectDB();
    logger.debug(`Entering updateCartItemQuantity for userId: ${userId}, designId: ${designId}, newQuantity: ${newQuantity}`);

    if (!userId || !designId || newQuantity === undefined || newQuantity < 0) {
        return { success: false, message: 'User ID, Design ID, and a valid non-negative quantity are required.' };
    }

    try {
        const Cart = await getCartModel(); // Get the Cart model
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return { success: false, message: 'Cart not found for user.' };
        }

        const itemIndex = cart.items.findIndex(item => item.designId.toString() === designId);

        if (itemIndex > -1) {
            if (newQuantity === 0) {
                // Remove item if quantity is 0
                cart.items.splice(itemIndex, 1);
                logger.debug('Design removed from cart due to zero quantity:', cart);
            } else {
                // Update quantity
                cart.items[itemIndex].quantity = newQuantity;
                logger.debug('Design quantity updated in cart:', cart);
            }
            await cart.save();
            revalidatePath('/perfil');

            // Re-fetch and populate the cart after saving to ensure full item details are returned
            const updatedPopulatedCart = await Cart.findOne({ userId }).populate('items.designId', 'nombreDesing valorDesing imageData imageMimeType descripcion categoria proveedorId').lean();

            const populatedCartItems = (updatedPopulatedCart.items || []).map(item => ({
                id: item.designId._id.toString(),
                designId: item.designId._id,
                nombre: item.designId.nombreDesing,
                price: item.designId.valorDesing,
                descripcion: item.designId.descripcion,
                categoria: item.designId.categoria,
                imageData: item.designId.imageData ? Buffer.from(item.designId.imageData.buffer).toString('base64') : null,
                imageMimeType: item.designId.imageMimeType,
                quantity: item.quantity,
                proveedorId: item.designId.proveedorId, // Include proveedorId here
            }));

            const finalCartData = {
                ...updatedPopulatedCart,
                items: populatedCartItems,
            };

            return { success: true, message: 'Cart item quantity updated successfully.', data: JSON.parse(JSON.stringify(finalCartData)) };
        } else {
            logger.debug('Design not found in cart for quantity update, no action needed.');
            return { success: false, message: 'Design not found in cart for quantity update.' };
        }
    } catch (error) {
        logger.error('ERROR in updateCartItemQuantity:', error);
        return { success: false, message: 'Error updating cart item quantity: ' + error.message };
    }
}

export async function clearUserCart(userId) {
    await connectDB();
    logger.debug(`Entering clearUserCart for userId: ${userId}`);

    if (!userId) {
        return { success: false, message: 'User ID is required.' };
    }

    try {
        const Cart = await getCartModel(); // Get the Cart model
        const result = await Cart.findOneAndUpdate(
            { userId },
            { $set: { items: [] } }, // Clear the 'items' array
            { new: true }
        ).lean();

        if (result) {
            logger.debug('Cart cleared successfully for userId:', userId);
            revalidatePath('/perfil');
            return { success: true, message: 'Cart cleared successfully.', data: JSON.parse(JSON.stringify(result)) };
        } else {
            logger.debug('Cart not found for user, nothing to clear.');
            return { success: true, message: 'Cart not found for user.', data: { items: [] } }; // Return empty cart if not found
        }
    } catch (error) {
        logger.error('ERROR in clearUserCart:', error);
        return { success: false, message: 'Error clearing cart: ' + error.message };
    }
}

export async function createEmptyCartForUser(userId) {
    await connectDB();
    logger.debug(`Entering createEmptyCartForUser for userId: ${userId}`);

    if (!userId) {
        return { success: false, message: 'User ID is required to create an empty cart.' };
    }

    try {
        const Cart = await getCartModel(); // Get the Cart model
        let cart = await Cart.findOne({ userId });

        if (cart) {
            logger.debug('Cart already exists for user, no new cart created.');
            return { success: true, message: 'Cart already exists for this user.' };
        } else {
            cart = await Cart.create({ userId, items: [] }); // Create with an empty items array
            logger.debug('Empty cart created successfully for userId:', cart);
            revalidatePath('/perfil'); // Revalidate profile page
            return { success: true, message: 'Empty cart created successfully.', data: JSON.parse(JSON.stringify(cart)) };
        }
    } catch (error) {
        logger.error('ERROR in createEmptyCartForUser:', error);
        return { success: false, message: 'Error creating empty cart: ' + error.message };
    }
}
