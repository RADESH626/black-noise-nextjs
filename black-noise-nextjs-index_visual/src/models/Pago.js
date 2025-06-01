import { Schema, model, models } from 'mongoose'
import { MetodoPago, EstadoPago } from './enums/pago'

const PagoSchema = new Schema({
    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    ventaId: {
        type: Schema.Types.ObjectId,
        ref: 'Venta',
        required: true
    },
    valorPago: {
        type: Number,
        required: true
    },
    metodoPago: {
        type: String,
        enum: Object.values(MetodoPago),
        required: true
    },
    estadoPago: {
        type: String,
        enum: Object.values(EstadoPago),
        default: EstadoPago.PENDIENTE
    },
    fechaRealizacion: {
        type: Date,
        default: Date.now
    }
},{
    timestamps: true
})

// Check if the model exists before creating a new one
export default models.Pago || model('Pago', PagoSchema)
