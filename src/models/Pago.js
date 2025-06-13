import { Schema, model, models } from 'mongoose'

const PagoSchema = new Schema({
    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    pedidoId: {
        type: Schema.Types.ObjectId,
        ref: 'Pedido',
        required: true
    },
    valorPago: {
        type: Number,
        required: true
    },
    metodoPago: {
        type: String,
        enum: ['tarjeta', 'paypal', 'efectivo'], // Define payment methods directly
        required: true
    },
    estadoTransaccion: { // Renamed from estadoPago for clarity
        type: String,
        enum: ['PENDIENTE', 'PAGADO', 'FALLIDO', 'REEMBOLSADO'], // Define transaction states
        default: 'PENDIENTE'
    },
    detallesTarjeta: { // New field for card details
        cardNumber: { type: String }, // Store last 4 digits
        expiryDate: { type: String },
        cvv: { type: String } // Masked
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
