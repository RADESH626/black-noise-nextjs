import mongoose, { Schema } from 'mongoose';
import { CategoriaProducto } from './enums/CategoriaProducto';
import { EstadoDesing } from './enums/design/EstadoDesing';

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
    descripcion: {
        type: String,
        required: false
    },
    categoria: {
        type: String,
        enum: Object.values(CategoriaProducto),
        required: true
    },
    valorDesing: {
        type: Number,
        required: true
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
    imageData: {
        type: Buffer,
        required: true
    },
    imageMimeType: {
        type: String,
        required: true
    },
    tallasDisponibles: {
        type: [String], // Array de strings para las tallas (ej. ['S', 'M', 'L', 'XL'])
        required: false // Opcional, dependiendo de si todos los diseños tienen tallas
    }
}, {
    timestamps: true
});

const getDesignModel = () => {
    return mongoose.models.Design || mongoose.model('Design', DesignSchema);
};

export default getDesignModel;
