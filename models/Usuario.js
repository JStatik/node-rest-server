const { Schema, model } = require( 'mongoose' );
const uniqueValidator = require( 'mongoose-unique-validator' );

const rolesValidos = {
    values: [ 'ADMIN_ROLE', 'USER_ROLE' ],
    message: '{VALUE} no es un rol válido'
};

const UsuarioSchema = new Schema( {
    name: {
        type: String,
        required: [ true, 'El nombre es obligatorio' ]
    },
    email: {
        type: String,
        required: [ true, 'El email es obligatorio' ],
        unique: true
    },
    password: {
        type: String,
        required: [ true, 'La contraseña es obligatoria' ]
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
} );

UsuarioSchema.plugin( uniqueValidator, { message: 'El {PATH} ingresado, ya está en uso' } );

UsuarioSchema.method( 'toJSON', function() {
    const { __v, password, _id, state, ...object } = this.toObject();
    object.uid = _id;

    return object;
} );

module.exports = model( 'Usuario', UsuarioSchema );
