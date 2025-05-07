import { Schema, model, models } from 'mongoose'
import { TipoElemento, MaterialElemento } from './enums/elemento'

const ElementoSchema = new Schema({
    nombreElemento: {
        type: String,
        required: true
    },
    tipoElemento: {
        type: String,
        enum: Object.values(TipoElemento),
        required: true
    },
    materialElemento: {
        type: String,
        enum: Object.values(MaterialElemento),
        required: true
    },
    valorElemento: {
        type: Number,
        required: true
    },
    recurso: {
        type: String, // URL or path to the image
        required: true
    },
    habilitado: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

// Check if the model exists before creating a new one
export default models.Elemento || model('Elemento', ElementoSchema)
