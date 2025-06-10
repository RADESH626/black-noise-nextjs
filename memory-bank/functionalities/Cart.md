# Cart Model Functionality

## Overview

This document describes the `Cart` model, which is designed to store a list of design IDs associated with a user's shopping cart. This model will facilitate the retrieval and display of design information within the cart component in the user's profile section.

## Purpose

The primary purpose of the `Cart` model is to:
- Persist the selected design IDs for a user's shopping cart.
- Enable efficient retrieval of design details when rendering the cart view.
- Decouple the cart's content storage from the actual design data, allowing for flexible updates to design information without affecting existing cart entries.

## Data Structure

The `Cart` model will have the following schema:

- `userId`: (String, Required, Unique) The ID of the user to whom this cart belongs. This ensures each user has a single cart.
- `designIds`: (Array of Strings, Default: []) An array containing the IDs of the designs added to the cart.

## Usage

### Storing Design IDs

When a user adds a design to their cart, the `designId` will be added to the `designIds` array of their corresponding `Cart` document. If a cart document does not exist for the user, a new one will be created.

### Retrieving Design Information

In the cart component (likely located in `src/app/perfil/` or `src/app/carrito/`), the `designIds` from the `Cart` model will be used to query the `Design` model and fetch the complete details of each design. This approach ensures that the displayed design information is always up-to-date.

## Related Components/Files

- `src/models/Cart.js`: The Mongoose schema definition for the Cart model.
- `src/models/index.js`: Where the Cart model will be exported.
- `src/app/carrito/page.jsx`: The main cart page where designs will be displayed.
- `src/app/perfil/page.jsx` (or a sub-component): Where the cart information might be accessed and displayed within the user's profile.
- `src/app/acciones/CartActions.js` (future): A new actions file to handle cart-related operations (add, remove, clear designs).
