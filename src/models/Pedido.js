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
    estadoPago: { // New field for payment status
        type: String,
        enum: ['PENDIENTE', 'PAGADO', 'FALLIDO', 'REEMBOLSADO'], // Define payment states
        required: true,
        default: 'PENDIENTE'
    },
    total: { // Renamed from valorPedido for consistency
        type: Number,
        required: true
    },
    metodoPago: {
        type: String,
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
    fechaRealizacion: {
        type: Date,
        default: Date.now
    },
    fechaEstimadaEntrega: {
        type: Date
    },
    detallesPedido: [{
        type: String
    }]
}, {
    timestamps: true
})

// Check if the model exists before creating a new one, and export the model instance
const Pedido = models.Pedido || model('Pedido', PedidoSchema);
export default Pedido;
