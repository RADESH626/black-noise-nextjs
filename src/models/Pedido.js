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
        default: EstadoPedido.PENDIENTE
    },
    valorPedido: {
        type: Number,
        required: true
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

// Check if the model exists before creating a new one
export default models.Pedido || model('Pedido', PedidoSchema)
