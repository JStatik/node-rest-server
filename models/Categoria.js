const { Schema, model } = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

const CategoriaSchema = new Schema( {
    categoria: {
        type: String,
        required: [ true, 'La categoria es obligatoria' ],
        unique: true
    },
    user: {
        type: Object,
        required: [ true, 'El usuario que la crea/modifica es obligatorio' ]
    }
} );

CategoriaSchema.plugin( uniqueValidator, { message: 'La {PATH} ingresada, ya existe' } );

CategoriaSchema.method( 'toJSON', function() {
    const { __v, user, ...object } = this.toObject();

    return object;
} );

module.exports = model( 'Categoria', CategoriaSchema );
