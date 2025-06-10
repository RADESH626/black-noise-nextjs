"use server";

import connectDB from "@/utils/DBconection";
import Venta from "@/models/Venta";
import Usuario from "@/models/Usuario";
import Pedido from "@/models/Pedido";
import logger from '@/utils/logger';

export async function obtenerMetricasDashboard() {
  logger.info("Server Action: obtenerMetricasDashboard Started");

  try {
    await connectDB();

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

    return {
      success: true,
      data: {
        totalVentas,
        totalUsuarios,
        pedidosPendientes,
      },
    };
  } catch (error) {
    logger.error("Error en obtenerMetricasDashboard:", error.message);
    return {
      success: false,
      error: "Error al obtener las métricas del dashboard.",
    };
  }
}
