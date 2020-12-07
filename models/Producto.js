const { Schema, model } = require( 'mongoose' );

const ProductoSchema = new Schema( {
    name: {
        type: String,
        required: [ true, 'El nombre es obligatorio' ],
    },
    price: {
        type: Number,
        required: [ true, 'El precio es obligatorio' ],
    },
    description: {
        type: String,
        required: false,
    },
    available: {
        type: Boolean,
        required: [ true, 'La disponibilidad es obligatoria' ],
        default: true
    },
    img: {
        type: String,
        required: false
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: [ true, 'La categoria es obligatoria' ]
    },
    user: {
        type: Object,
        required: [ true, 'El usuario que la crea/modifica es obligatorio' ]
    }
} );

ProductoSchema.method( 'toJSON', function() {
    const { __v, user, ...object } = this.toObject();

    return object;
} );

module.exports = model( 'Producto', ProductoSchema );
