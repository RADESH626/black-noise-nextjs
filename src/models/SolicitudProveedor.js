import { Schema, model, models } from 'mongoose'
import { EstadoSolicitud } from './enums/SolicitudProveedorEnums'
import { Especialidad } from './enums/proveedor'

const SolicitudProveedorSchema = new Schema({
    solicitanteId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    nombreProveedor: {
        type: String,
        required: true
    },
    nit: {
        type: String,
        required: true
    },
    direccionEmpresa: {
        type: String,
        required: true
    },
    rut: {
        type: String,
        required: true
    },
    especialidad: {
        type: String,
        enum: Object.values(Especialidad),
        required: true
    },
    fechaSolicitud: {
        type: Date,
        default: Date.now
    },
    estadoSolicitud: {
        type: String,
        enum: Object.values(EstadoSolicitud),
        default: EstadoSolicitud.PENDIENTE
    },
    fechaRevision: {
        type: Date
    },
    revisorId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    comentariosAdmin: {
        type: String
    },
    datosProveedorSolicitados: {
        type: Schema.Types.Mixed
    }
}, {
    timestamps: true
})

// Check if the model exists before creating a new one
export default models.SolicitudProveedor || model('SolicitudProveedor', SolicitudProveedorSchema)
