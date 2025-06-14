# Active Context Log

## Task: Add payment reference to Pedido model

### Changes Made:
- **File:** `memory-bank/functionalities/GestionDePedidosYPagos.md`
  - **Description:** Added documentation for the new `paymentId` field in the `Pedido` model, emphasizing its required nature due to the "payment first" flow.
- **File:** `src/models/Pedido.js`
  - **Description:** Added the `paymentId` field (`Schema.Types.ObjectId`, `ref: 'Pago'`, `required: true`) to the `PedidoSchema`.

### Next Steps:
- Update `memory-bank/progress.md`.
- Generate Git commit commands.
