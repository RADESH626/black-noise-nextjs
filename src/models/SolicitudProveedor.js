import { Schema, model, models } from 'mongoose';
import { CategoriaProducto } from './enums/CategoriaProducto';
import { MetodoPago } from './enums/pago/MetodoPago';
import { EstadoSolicitudProveedor } from './enums/SolicitudProveedorEnums';

const SolicitudProveedorSchema = new Schema({
    usuarioId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    nombreEmpresa: { type: String, required: true },
    nit: { type: String, required: true }, // NIT no es único en solicitudes
    direccionEmpresa: { type: String, required: true },
    especialidad: { type: String, enum: Object.values(CategoriaProducto), required: true },
    metodosPagoAceptados: [{ type: String, enum: Object.values(MetodoPago) }],
    comisionPropuesta: { type: Number, required: true }, // Asumimos porcentaje
    mensajeAdicional: { type: String },
    estadoSolicitud: { type: String, enum: Object.values(EstadoSolicitudProveedor), default: EstadoSolicitudProveedor.PENDIENTE },
    fechaSolicitud: { type: Date, default: Date.now },
    fechaRevision: { type: Date },
    adminNotas: { type: String },
}, { timestamps: true });

export default models.SolicitudProveedor || model('SolicitudProveedor', SolicitudProveedorSchema);
