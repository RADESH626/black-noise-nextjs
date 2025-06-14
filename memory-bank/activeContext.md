# Active Context Log

## Task: Add shipping cost field to order schema

### Changes Made:
- **File:** `src/models/Pedido.js`
  - **Description:** Added `costoEnvio` field of type `Number` with a default value of `0` to the `PedidoSchema`.
- **File:** `memory-bank/functionalities/GestionDePedidosYPagos.md`
  - **Description:** Updated the documentation to reflect the addition of the `costoEnvio` field in the `Pedido` model.

### Next Steps:
- Generate Git commit commands.
