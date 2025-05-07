import { Schema, model, models } from 'mongoose'
import { TipoDocumentoIdentidad, Rol } from './enums/usuario'

// Removed the `id` field causing duplicate key errors by ensuring it is not part of the schema.
// MongoDB already provides a unique `_id` field by default.

const UsuarioSchema = new Schema({
    tipoDocumento: {
        type: String,
        enum: Object.values(TipoDocumentoIdentidad),
        required: true
    },
    numeroDocumento: {
        type: String,
        required: true
    },
    primerNombre: {
        type: String,
        required: true,
        trim: true
    },
    segundoNombre: {
        type: String,
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
    nombreUsuario: {
        type: String,
        unique: true
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
    fotoPerfil: {
        type: String
    },
    habilitado: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
}

)

// Check if the model exists before creating a new one
export default models.Usuario || model('Usuario', UsuarioSchema)