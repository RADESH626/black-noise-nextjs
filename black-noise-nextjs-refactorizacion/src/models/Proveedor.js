import { Schema, model, models } from 'mongoose'
import { Disponibilidad } from './enums/proveedor/Disponibilidad'
import { CategoriaProducto } from './enums/CategoriaProducto'
import { MetodoPago } from './enums/pago'

const ProveedorSchema = new Schema({
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
    nombreDueño: {
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
    accessKey: {
        type: String,
        unique: true,
        sparse: true // Allows null values to not violate the unique constraint
    },
    especialidad: {
        type: String,
        enum: Object.values(CategoriaProducto),
        required: true
    },
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
    permisosDetallesCredito: {
        type: Boolean,
        default: false
    },
    habilitado: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

// Check if the model exists before creating a new one
export default models.Proveedor || model('Proveedor', ProveedorSchema)
