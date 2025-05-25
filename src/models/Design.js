import { Schema, model, models } from 'mongoose'
import { CategoriaProducto } from './enums/CategoriaProducto'
import { EstadoDesing } from './enums/design/EstadoDesing'

const DesignSchema = new Schema({
    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    nombreDesing: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        enum: Object.values(CategoriaProducto),
        required: true
    },
    palabrasClave: [{
        type: String
    }],
    likes: {
        type: Number,
        default: 0
    },
    valorDesing: {
        type: Number,
        required: true
    },
    fechaRealizacion: {
        type: Date,
        default: Date.now
    },
    estadoDesing: {
        type: String,
        enum: Object.values(EstadoDesing),
        required: true,
        default: EstadoDesing.PRIVADO
    },
    elementoIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Elemento'
    }],
    imagenDesing: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

// Check if the model exists before creating a new one
export default models.Design || model('Design', DesignSchema)
