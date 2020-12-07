const fs = require( 'fs' );
const path = require( 'path' );
const colors = require( 'colors' );
const Usuario = require( '../../models/Usuario' );

const obtenerImagenUsuario = async( req, res ) => {
    const { uid } = req;
    const { id: usuarioId } = req.params;

    if( usuarioId.length !== 24 ) {
        return res.status( 400 ).json(
            {
                ok: false,
                msg: 'El ID es incorrecto'
            }
        );
    }

    try {
        await Usuario.findById( usuarioId, ( err, usuarioDB ) => {
            if( err ) {
                console.log( colors.magenta( err ) );
    
                return res.status( 500 ).json(
                    {
                        ok: false,
                        msg: 'No se pudo obtener el usuario'
                    }
                );
            }
    
            if( !usuarioDB ) {
                return res.status( 404 ).json(
                    {
                        ok: false,
                        msg: 'El usuario es inexistente por ese ID'
                    }
                );
            }

            if( usuarioId !== uid ) {
                return res.status( 401 ).json(
                    {
                        ok: false,
                        msg: 'No tiene privilegios para acceder a la informacion de este usuario'
                    }
                );
            }

            if( usuarioDB.state === false ) {
                return res.status( 404 ).json(
                    {
                        ok: false,
                        msg: 'El usuario esta eliminado'
                    }
                );
            }

            const pathNoImage = path.resolve( __dirname, '../../assets/no-image-user.jpeg' );

            if( !usuarioDB.img || usuarioDB.img === '' ) {
                return res.status( 404 ).sendFile( pathNoImage );
            }

            if( usuarioDB.img.includes( 'https' ) ) {
                return res.status( 200 ).send( usuarioDB.img );
            } else {
                const pathImage = path.resolve( __dirname, `../../uploads/usuarios/${ uid }/${ usuarioDB.img }` );

                if( fs.existsSync( pathImage ) ) {
                    return res.status( 200 ).sendFile( pathImage );
                } else {      
                    return res.status( 404 ).sendFile( pathNoImage );
                }
            }          
        } );
    } catch(err) {
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
    obtenerImagenUsuario
};
