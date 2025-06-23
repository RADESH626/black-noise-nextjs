import { Schema, model, models } from 'mongoose'
import { EstadoVenta } from './enums/VentaEnums'
import connectDB from '@/utils/DBconection';

let mongoose;

async function getMongoose() {
    if (!mongoose) {
        const { mongoose: mongooseInstance } = await connectDB();
        mongoose = mongooseInstance;
    }
    return mongoose;
}

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
    estadoVenta: {
        type: String,
        enum: Object.values(EstadoVenta),
        default: EstadoVenta.PENDIENTE
    },
}, {
    timestamps: true
})

// Check if the model exists before creating a new one
export default async function getVentaModel() {
    const mongooseInstance = await getMongoose();
    return mongooseInstance.models.Venta || model('Venta', VentaSchema);
}
