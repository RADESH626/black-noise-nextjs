import { BotonGeneral } from '@/components/common/botones';
import { ObtenerPedidoPorId } from '@/app/acciones/PedidoActions';
import { EstadoPedido } from '@/models/enums/PedidoEnums';
import {
  InputTextoGeneral,
  InputSelectGeneral,
  InputNumero,
  InputFecha,
  InputTextArea
} from '@/components/common/inputs';

async function FormEditarPedido({ pedidoId }) {
  const pedido = await ObtenerPedidoPorId(pedidoId);

  // Format the date
  const fechaEstimadaEntrega = pedido.fechaEstimadaEntrega 
    ? new Date(pedido.fechaEstimadaEntrega).toISOString().split('T')[0]
    : '';

  return (
    <form className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block mb-1 text-sm font-medium text-bn-accent">ID de Pedido</label>
          <div className="p-2 bg-gray-50 border border-gray-200 rounded-md">
            <span className="text-sm text-gray-700">{pedidoId}</span>
          </div>
        </div>

        <div className="relative">
          <label className="block mb-1 text-sm font-medium text-bn-accent">Proveedor</label>
          <div className="p-2 bg-gray-50 border border-gray-200 rounded-md">
            <span className="text-sm text-gray-700">
              {pedido.proveedorId?.nombreProveedor || 'N/A'} 
              ({pedido.proveedorId?._id || pedido.proveedorId || 'N/A'})
            </span>
          </div>
        </div>
      </div>

      <div className="relative">
        <label htmlFor="desingIds" className="block mb-1 text-sm font-medium text-bn-accent">IDs de Diseño</label>
        <div className="relative">
          <InputTextoGeneral
            id="desingIds"
            name="desingIds"
            required
            placeholder="IDs separados por coma"
            defaultValue={pedido.desingIds?.map(d => d._id).join(',') || ''}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="estadoPedido" className="block mb-1 text-sm font-medium text-bn-accent">Estado del Pedido</label>
          <div className="relative">
            <InputSelectGeneral
              id="estadoPedido"
              name="estadoPedido"
              required
              options={Object.values(EstadoPedido).map(est => ({
                value: est,
                label: est.replace(/_/g, ' ')
              }))}
              defaultValue={pedido.estadoPedido || ""}
            />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="valorPedido" className="block mb-1 text-sm font-medium text-bn-accent">Valor del Pedido</label>
          <div className="relative">
            <InputNumero
              id="valorPedido"
              name="valorPedido"
              required
              step="0.01"
              defaultValue={pedido.valorPedido?.toString() || ""}
            />
          </div>
        </div>
      </div>

      <div className="relative">
        <label htmlFor="fechaEstimadaEntrega" className="block mb-1 text-sm font-medium text-bn-accent">Fecha Estimada de Entrega</label>
        <div className="relative">
          <InputFecha
            id="fechaEstimadaEntrega"
            name="fechaEstimadaEntrega"
            required
            defaultValue={fechaEstimadaEntrega}
          />
        </div>
      </div>

      <div className="relative">
        <label htmlFor="detallesPedido" className="block mb-1 text-sm font-medium text-bn-accent">Detalles del Pedido</label>
        <div className="relative">
          <InputTextArea
            id="detallesPedido"
            name="detallesPedido"
            rows={3}
            placeholder="Detalles separados por coma"
            defaultValue={pedido.detallesPedido?.join(',') || ''}
          />
        </div>
      </div>

      <div className="flex flex-row gap-2 items-center justify-center mt-5">
        <BotonGeneral type="submit">Editar pedido</BotonGeneral>
      </div>
        </form>
    );
}
