const colors = require( 'colors' );
const bcrypt = require( 'bcryptjs' );
const Usuario = require( '../../models/Usuario' );
const { generarJWT } = require( '../../helpers/jwt' );

const crearUsuario = async( req, res ) => {
    const { email: emailReq, password: passwordReq } = req.body;

    try {
        let usuario = await Usuario.findOne( { email: emailReq } );

        if( usuario ) {
            return res.status( 400 ).json(
                {
                    ok: false,
                    msg: 'El email ingresado ya está en uso'
                }
            );
        }

        usuario = new Usuario( req.body );

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( passwordReq, salt );

        await usuario.save( async( err, usuarioDB ) => {
            if( err ) {
                console.log( colors.magenta( err ) );

                return res.status( 500 ).json( {
                    ok: false,
                    msg: 'No se pudo almacenar el usuario en la DB'
                } );
            }

            const token = await generarJWT( usuarioDB.id, usuarioDB.name, usuarioDB.role );

            return res.status( 201 ).json( {
                ok: true,
                token,
                usuario: usuarioDB
            } );
        } );
    } catch( err ) {
        console.log( colors.magenta( err ) );

        return res.status( 500 ).json(
            {
                ok: false,
                msg: 'Por favor, hable con el administrador'
            }
        );
    }
};

module.exports = {
    crearUsuario
};
