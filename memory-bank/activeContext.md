### Date: 2025-06-10

### Task: Fix `Cast to ObjectId failed` error in `addDesignToCart`

### Changes Made:
- Modified `src/app/acciones/CartActions.js` to correctly handle the `designId` parameter.
- Implemented logic to extract the `id` property from `designId` if it's passed as an object, ensuring a string ID is used for database operations.

### Reason for Changes:
The error log indicated that `designId` was being passed as an object instead of a string, causing a `Cast to ObjectId failed` error when interacting with the MongoDB `Cart` model. The fix ensures that the `designId` is always a string before being used to create or update cart items.

### Files Modified:
- `src/app/acciones/CartActions.js`

### Next Steps:
- Verify the fix by testing the add to cart functionality.
