const colors = require( 'colors' );
const bcrypt = require( 'bcryptjs' );
const Usuario = require( '../../models/Usuario' );
const { verify } = require( '../../helpers/verificarTokenGoogle' );
const { generarJWT } = require( '../../helpers/jwt' );

const loginGoogle = async( req, res ) => {
    const { tokenGoogle } = req.body;

    try {
        const payload = await verify( tokenGoogle );

        if( !payload ) {
            return res.status( 400 ).json(
                {
                    ok: false,
                    msg: 'Token de Google inválido'
                }
            );
        }

        const { name: nameGoogle, email: emailGoogle, picture: pictureGoogle } = payload;
        const usuarioDB = await Usuario.findOne( { email: emailGoogle } );

        if( usuarioDB ) {
            if( usuarioDB.google === false ) {
                return res.status( 400 ).json(
                    {
                        ok: false,
                        msg: 'El email ingresado ya está en uso'
                    }
                );
            }

            if( usuarioDB.google === true ) {
                const token = await generarJWT( usuarioDB.id, usuarioDB.name, usuarioDB.role );
    
                return res.status( 200 ).json( {
                    ok: true,
                    token,
                    usuario: usuarioDB
                } );
            }
        }

        const usuarioGoogle = {
            name: nameGoogle,
            email: emailGoogle,
            password: Math.round( Math.random() * 10000000 ),
            img: pictureGoogle,
            google: true
        };

        const salt = bcrypt.genSaltSync();
        usuarioGoogle.password = bcrypt.hashSync( usuarioGoogle.password.toString(), salt );

        const newUsuario = new Usuario( usuarioGoogle );

        await newUsuario.save( async( err, usuarioDB ) => {
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
    loginGoogle
};
