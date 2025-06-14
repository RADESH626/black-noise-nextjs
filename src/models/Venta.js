import { Schema, model, models } from 'mongoose'
import EstadoVenta from './enums/VentaEnums'

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
    valorVenta: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
})

// Check if the model exists before creating a new one
export default models.Venta || model('Venta', VentaSchema)
