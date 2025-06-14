# Project Progress

## Current Status:
- The `Pedido` model has been updated to include a `paymentId` field, ensuring a direct link to the payment transaction.
- The `GestionDePedidosYPagos.md` documentation has been updated to reflect this change and the "payment first" flow.
- The `Pago` model now correctly uses the centralized `MetodoPago` enum, replacing hardcoded values.
- The `PaymentForm.jsx` component has been updated to utilize the `MetodoPago` enum for payment method selection.
- A new directive has been added to `improvement_log.md` to ensure future enum reusability.
- The `Genero` enum has been correctly exported in `src/models/enums/usuario/index.js`.
- The profile page data fetching has been optimized on the client-side by ensuring `userDesigns` are re-fetched after a new design upload, improving UI consistency.
- Resolved repeated client-side console logs in `src/components/layout/ProfileContent.jsx` by moving them into a `useEffect` hook, ensuring they run only once on component mount.

## Remaining Tasks:
- No remaining tasks for this specific request.
