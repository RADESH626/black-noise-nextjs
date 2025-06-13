import { Schema, model, models } from 'mongoose'
import { EstadoVenta } from './enums/VentaEnums'

const VentaSchema = new Schema({
    pagoIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Pago'
    }],
    pedidoId: {
        type: Schema.Types.ObjectId,
        ref: 'Pedido',
        required: true
    },
    comisionAplicacion: {
        type: Number,
        required: true
    },
    valorVenta: {
        type: Number,
        required: true
    },
    estadoVenta: {
        type: String,
        enum: Object.values(EstadoVenta),
        default: EstadoVenta.PENDIENTE
    },
    detallesVenta: [{
        type: String
    }],
    fechaRealizacion: {
        type: Date,
        default: Date.now
    }
},{
    timestamps: true
})

// Check if the model exists before creating a new one
export default models.Venta || model('Venta', VentaSchema)
