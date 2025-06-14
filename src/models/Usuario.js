import { Schema, model, models } from 'mongoose'
import { TipoDocumentoIdentidad } from './enums/usuario/TipoDocumentoIdentidad';
import { Rol } from './enums/usuario/Rol';

// Removed the `id` field causing duplicate key errors by ensuring it is not part of the schema.
// MongoDB already provides a unique `_id` field by default.

const UsuarioSchema = new Schema({
    Nombre: {
        type: String,
        required: true,
        trim: true
    },
    primerApellido: {
        type: String,
        required: true,
        trim: true
    },
    segundoApellido: {
        type: String,
        trim: true
    },
    tipoDocumento: {
        type: String,
        enum: Object.values(TipoDocumentoIdentidad),
        required: true
    },
    numeroDocumento: {
        type: String,
        required: true
    },
    fechaNacimiento: {
        type: Date,
        required: true
    },
    genero: {
        type: String,
        required: true,
        default: "OTRO"
    },
    numeroTelefono: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    nombreUsuario: {
        type: String,
        unique: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: Object.values(Rol),
        default: Rol.CLIENTE, // Asignar CLIENTE como valor predeterminado
        required: true
    },
    imageData: {
        type: Buffer
    },
    imageMimeType: {
        type: String
    },
    habilitado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
}

)

// Check if the model exists before creating a new one
export default models.Usuario || model('Usuario', UsuarioSchema)
