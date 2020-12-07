const colors = require( 'colors' );
const Usuario = require( '../../models/Usuario' );
const { eliminarImagen } = require( '../../helpers/eliminarImagenServer' );
const { eliminarDirectorio } = require( '../../helpers/eliminarDirectorioServer' );

const actualizarImagenUsuario = async( res, content, uidReq, nombreImg ) => {
    try {
        await Usuario.findById( uidReq, async( err, usuario ) => {
            if( err ) {
                console.log( colors.magenta( err ) );

                eliminarImagen( content, uidReq, nombreImg );
                eliminarDirectorio( content, uidReq );

                return res.status( 500 ).json( {
                    ok: false,
                    msg: 'No se pudo obtener el usuario'
                } );
            }

            if( !usuario ) {
                eliminarImagen( content, uidReq, nombreImg );
                eliminarDirectorio( content, uidReq );

                return res.status( 404 ).json(
                    {
                        ok: false,
                        msg: 'El usuario es inexistente por ese ID'
                    }
                );
            }

            if( usuario.state === false ) {
                eliminarImagen( content, uidReq, nombreImg );
                eliminarDirectorio( content, uidReq );
                
                return res.status( 401 ).json(
                    {
                        ok: false,
                        msg: 'El usuario no se encuentra disponible'
                    }
                );
            }

            if( usuario.img || usuario.img !== '' ) {
                eliminarImagen( content, uidReq, usuario.img );
            }

            const newDataUsuario = {
                img: nombreImg
            };

            await Usuario.findByIdAndUpdate(
                uidReq,
                newDataUsuario,
                { 
                    new: true,
                    runValidators: true,
                    context: 'query'
                },
                ( err, usuarioActualizado ) => {
                    if( err ) {
                        console.log( colors.magenta( err ) );

                        eliminarImagen( content, uidReq, nombreImg );
    
                        return res.status( 500 ).json( {
                            ok: false,
                            msg: 'No se pudo actualizar el usuario en DB'
                        } ); 
                    }
    
                    return res.status( 202 ).json(
                        {
                            ok: true,
                            usuario: usuarioActualizado
                        }
                    );
                }
            );
        } ); 
    } catch( err ) {
        console.log( colors.magenta( err ) );

        eliminarImagen( content, uidReq, nombreImg );
        eliminarDirectorio( content, uidReq );

        return res.status( 500 ).json(
            {
                ok: false,
                msg: 'Por favor, hable con el administrador'
            }
        );
    }
};

module.exports = {
    actualizarImagenUsuario
};
