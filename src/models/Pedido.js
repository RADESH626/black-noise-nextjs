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
    metodoEntrega: {
        type: String,
        enum: ['DOMICILIO', 'RECOGIDA'], // Envío a domicilio o Recogida en punto
        required: true
    },
    estadoPago: {
        type: String,
        enum: ['PENDIENTE', 'PAGADO', 'CANCELADO'],
        required: true,
        default: 'PENDIENTE'
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
    costoEnvio: {
        type: Number,
        required: true,
        default: 0
    },
    direccionEnvio: {
        type: String,
        required: false // Made optional as it depends on delivery method
    },
    destinatario: { // cliente al que le va a llegar el pedido
        nombre: { type: String, required: true },
        correo: { type: String, required: true },
        direccion: { type: String, required: false } // Made optional as it depends on delivery method
    },
    paymentId: {
        type: Schema.Types.ObjectId,
        ref: 'Pago',
        required: false // Made permanently optional to resolve circular dependency
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
