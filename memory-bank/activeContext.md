### 10/6/2025, 5:35:16 p. m.

**Task:** Fixed an issue where saved designs were not appearing in the user's profile.

**Changes Made:**
- Modified `src/app/acciones/DesignActions.js`.
- Corrected the field name used in the `obtenerDesignsPorUsuarioId` function from `userId` to `usuarioId` to correctly query the `Design` model.

**Reasoning:**
The `Design` model defines the user ID as `usuarioId`, but the retrieval function was incorrectly querying for `userId`. This mismatch prevented designs from being fetched and displayed in the user's profile. Updating the query to use the correct field name resolves this data retrieval issue.
