import { Schema, model, models } from 'mongoose'
import { Disponibilidad } from './enums/proveedor/Disponibilidad'
import { CategoriaProducto } from './enums/CategoriaProducto'
import { MetodoPago } from './enums/pago'
import connectDB from '@/utils/DBconection';

let mongoose;

async function getMongoose() {
  if (!mongoose) {
    const { mongoose: mongooseInstance } = await connectDB();
    mongoose = mongooseInstance;
  }
  return mongoose;
}

const ProveedorSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
        unique: true
    },
    activeOrders: {
        type: Number,
        default: 0
    },
    lastAssignedAt: {
        type: Date,
        default: null
    },
    nombreEmpresa: {
        type: String,
        required: true
    },
    nit: {
        type: String,
        required: true,
        unique: true
    },
    direccionEmpresa: {
        type: String,
        required: true
    },
    emailContacto: {
        type: String,
        required: true
    },
    telefonoContacto: {
        type: String,
        required: true
    },
    especialidad: [{
        type: String,
        enum: Object.values(CategoriaProducto),
        required: true
    }],
    disponibilidad: {
        type: String,
        enum: Object.values(Disponibilidad),
        default: Disponibilidad.DISPONIBLE
    },
    metodosPagoAceptados: [{
        type: String,
        enum: Object.values(MetodoPago)
    }],
    comision: {
        type: Number,
        required: true
    },
    habilitado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})


// Check if the model exists before creating a new one

export default async function getProveedorModel() {
  const mongooseInstance = await getMongoose();
  return mongooseInstance.models.Proveedor || model('Proveedor', ProveedorSchema);
}
