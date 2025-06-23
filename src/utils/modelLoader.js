import getCartModel from "@/models/Cart";
import getDesignModel from "@/models/Design";
import getPagoModel from "@/models/Pago";
import getPedidoModel from "@/models/Pedido";
import getProveedorModel from "@/models/Proveedor";
import getUsuarioModel from "@/models/Usuario";
import getVentaModel from "@/models/Venta";

const modelCache = {};

export async function getModel(modelName) {
  if (modelCache[modelName]) {
    return modelCache[modelName];
  }

  switch (modelName) {
    case "Cart":
      modelCache[modelName] = await getCartModel();
      break;
    case "Design":
      modelCache[modelName] = await getDesignModel();
      break;
    case "Pago":
      modelCache[modelName] = await getPagoModel();
      break;
    case "Pedido":
      modelCache[modelName] = await getPedidoModel();
      break;
    case "Proveedor":
      modelCache[modelName] = await getProveedorModel();
      break;
    case "Usuario":
      modelCache[modelName] = await getUsuarioModel();
      break;
    case "Venta":
      modelCache[modelName] = await getVentaModel();
      break;
    default:
      throw new Error(`Model ${modelName} not found`);
  }

  return modelCache[modelName];
}

export async function loadModels() {
  await getModel("Cart");
  await getModel("Design");
  await getModel("Pago");
  await getModel("Pedido");
  await getModel("Proveedor");
  await getModel("Usuario");
  await getModel("Venta");
}
