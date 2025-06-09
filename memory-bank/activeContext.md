### Task: Display Payment Methods in Provider List

**Description:** Modified the `ListaProveedores.jsx` component to display accepted payment methods in separate columns, marking them with an 'X' if the provider accepts the method.

**Files Modified:**
- `src/components/layout/admin/dashboards/proveedores/ListaProveedores.jsx`

**Changes Made:**
- Imported `MetodoPago` enum.
- Defined `PAYMENT_METHODS` array and `PAYMENT_METHOD_DISPLAY_NAMES` object.
- Updated the table header to include individual columns for each payment method.
- Modified the table body to iterate through payment methods and display 'X' or '-' based on `provider.metodosPagoAceptados`.

**Next Steps:**
- Generate a git commit.
