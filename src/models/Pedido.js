import { Schema, model, models } from 'mongoose'
import { EstadoPedido } from './enums/PedidoEnums'

const PedidoSchema = new Schema({
    desingIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Design'
    }],
    proveedorId: {
        type: Schema.Types.ObjectId,
        ref: 'Proveedor',
        required: true
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
        type: Date,
        required: true
    },
    detallesPedido: [{
        type: String
    }]
}, {
    timestamps: true
})

// Check if the model exists before creating a new one
export default models.Pedido || model('Pedido', PedidoSchema)
