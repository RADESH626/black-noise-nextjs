"use server";

import connectDB from "@/utils/DBconection";
import { getVentaModel, getUsuarioModel, getPedidoModel, getDesignModel, getProveedorModel, getPagoModel } from "@/models";
import logger from '@/utils/logger';

export async function obtenerMetricasDashboard() {
  logger.info("Server Action: obtenerMetricasDashboard Started");

  try {
    await connectDB();

    const Venta = await getVentaModel();
    const Usuario = await getUsuarioModel();
    const Pedido = await getPedidoModel();
    const Design = await getDesignModel();
    const Proveedor = await getProveedorModel();
    const Pago = await getPagoModel();

    // Total de ventas
    const totalVentasResult = await Venta.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);
    const totalVentas = totalVentasResult.length > 0 ? totalVentasResult[0].total : 0;

    // Total de usuarios
    const totalUsuarios = await Usuario.countDocuments();

    // Pedidos pendientes (asumiendo un campo 'estado' en el modelo Pedido)
    const pedidosPendientes = await Pedido.countDocuments({ estado: "pendiente" });
    const totalDesigns = await Design.countDocuments();
    const totalProveedores = await Proveedor.countDocuments();
    const pagosPendientes = await Pago.countDocuments({ estado: "pendiente" });
    const devolucionesPendientes = await Pedido.countDocuments({ estado: "devolucion_pendiente" });

    return {
      success: true,
      data: {
        totalVentas,
        totalUsuarios,
        pedidosPendientes,
        totalDesigns,
        totalProveedores,
        pagosPendientes,
        devolucionesPendientes,
      },
    };
  } catch (error) {
    logger.error("Error en obtenerMetricasDashboard:", error); // Log the full error object
    return {
      success: false,
      error: "Error al obtener las métricas del dashboard.",
    };
  }
}
