### 10/6/2025, 5:35:16 p. m.

**Task:** Fixed an issue where saved designs were not appearing in the user's profile.

**Changes Made:**
- Modified `src/app/acciones/DesignActions.js`.
- Corrected the field name used in the `obtenerDesignsPorUsuarioId` function from `userId` to `usuarioId` to correctly query the `Design` model.

**Reasoning:**
The `Design` model defines the user ID as `usuarioId`, but the retrieval function was incorrectly querying for `userId`. This mismatch prevented designs from being fetched and displayed in the user's profile. Updating the query to use the correct field name resolves this data retrieval issue.

### 10/6/2025, 5:38:57 p. m.

**Task:** Created a new Mongoose model for the shopping cart.

**Changes Made:**
- Created `memory-bank/functionalities/Cart.md` to document the new Cart model functionality.
- Created `src/models/Cart.js` with a schema for `userId` and `designIds`.
- Updated `src/models/index.js` to import and export the new `Cart` model.

**Reasoning:**
The new `Cart` model is necessary to store the IDs of designs that a user adds to their shopping cart. This allows for persistent cart data that can be retrieved and used to display design information in the cart component within the user's profile. This approach separates cart content from design details, ensuring flexibility and up-to-date information.
