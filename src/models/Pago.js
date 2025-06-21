import { Schema, model, models } from 'mongoose'
import { MetodoPago } from '@/models/enums/pago/MetodoPago';

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
        enum: Object.values(MetodoPago), // Use the centralized MetodoPago enum
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
        cvv: { type: String }, // Add CVV field
    },
    numeroTelefono: { // New field for phone number for Nequi/Daviplata
        type: String,
        required: function() {
            return this.metodoPago === MetodoPago.NEQUI || this.metodoPago === MetodoPago.DAVIPLATA;
        }
    },
    motivo: { // Campo para la razón del pago (ej. "por pedido", "por envío")
        type: String,
        required: false
    }
},{
    timestamps: true
})

// Check if the model exists before creating a new one
export default models.Pago || model('Pago', PagoSchema)
