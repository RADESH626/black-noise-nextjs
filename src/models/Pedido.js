import { Schema, model, models } from 'mongoose'
import { EstadoPedido } from './enums/PedidoEnums'

const PedidoSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    items: [{
        designId: {
            type: Schema.Types.ObjectId,
            ref: 'Design',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    proveedorId: {
        type: Schema.Types.ObjectId,
        ref: 'Proveedor'
    },
    estadoPedido: {
        type: String,
        enum: Object.values(EstadoPedido),
        required: true,
        default: EstadoPedido.PENDIENTE // This can still be PENDIENTE for fulfillment status
    },
    total: { // Renamed from valorPedido for consistency
        type: Number,
        required: true
    },
    direccionEnvio: {
        type: String,
        required: true
    },
    cliente: { // Client details at the time of order
        nombre: { type: String, required: true },
        correo: { type: String, required: true },
    direccion: { type: String, required: true }
    },
    paymentId: {
        type: Schema.Types.ObjectId,
        ref: 'Pago',
        required: true
    },
    fechaEstimadaEntrega: {
        type: Date
    }
}, {
    timestamps: true
})

// Check if the model exists before creating a new one, and export the model instance
const Pedido = models.Pedido || model('Pedido', PedidoSchema);
export default Pedido;
