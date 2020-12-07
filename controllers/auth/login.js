const colors = require( 'colors' );
const bcrypt = require( 'bcryptjs' );
const Usuario = require( '../../models/Usuario' );
const { generarJWT } = require('../../helpers/jwt');

const login = async( req, res ) => {
    const { email: emailReq, password: passwordReq } = req.body;

    if( !emailReq || !passwordReq ) {
        return res.status( 400 ).json(
            {
                ok: false,
                msg: 'Los datos ingresados no son válidos'
            }
        );
    }

    try {
        await Usuario.findOne( { email: emailReq, state: true }, async( err, usuarioDB ) => {
            if( err ) {
                console.log( colors.magenta( err ) );

                return res.status( 500 ).json( {
                    ok: false,
                    msg: 'No se pudo obtener el usuario'
                } );
            }

            if( !usuarioDB ) {
                return res.status( 400 ).json(
                    {
                        ok: false,
                        msg: 'Los datos ingresados no son válidos'
                    }
                );
            }

            const validPassword = bcrypt.compareSync( passwordReq, usuarioDB.password );

            if( !validPassword ) {
                return res.status( 400 ).json(
                    {
                        ok: false,
                        msg: 'Los datos ingresados no son válidos'
                    }
                );
            }
            
            const token = await generarJWT( usuarioDB.id, usuarioDB.name, usuarioDB.role );

            return res.status( 200 ).json(
                {
                    ok: true,
                    uid: usuarioDB.id,
                    name: usuarioDB.name,
                    token
                }
            );
        } );
    } catch( err ) {
        console.log( err );

        return res.status( 500 ).json(
            {
                ok: false,
                msg: 'Por favor, hable con el administrador'
            }
        );
    }
};

module.exports = {
    login
};
