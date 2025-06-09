import { Schema, model, models } from 'mongoose'
import { Disponibilidad } from './enums/proveedor/Disponibilidad'
import { CategoriaProducto } from './enums/CategoriaProducto'
import { MetodoPago } from './enums/pago'

const ProveedorSchema = new Schema({
    nombreProveedor: {
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
    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
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
    }
},{
    timestamps: true
})

// Check if the model exists before creating a new one
export default models.Proveedor || model('Proveedor', ProveedorSchema)
