const colors = require( 'colors' );
const Usuario = require( '../../models/Usuario' );
const { eliminarImagen } = require( '../../helpers/eliminarImagenServer' );
const { eliminarDirectorio } = require( '../../helpers/eliminarDirectorioServer' );

const marcarEliminacionUsuario = async( req, res ) => {
    const usuarioId = req.params.id;

    if( usuarioId.length !== 24 ) {
        return res.status( 400 ).json(
            {
                ok: false,
                msg: 'El ID es incorrecto'
            }
        );
    }

    try {
        await Usuario.findById( usuarioId, async( err, usuario ) => {
            if( err ) {
                console.log( colors.magenta( err ) );

                return res.status( 500 ).json( {
                    ok: false,
                    msg: 'No se pudo obtener el usuario'
                } );
            }

            if( !usuario ) {
                return res.status( 404 ).json(
                    {
                        ok: false,
                        msg: 'El usuario es inexistente por ese ID'
                    }
                );
            }

            if( usuario.state === false ) {
                return res.status( 400 ).json(
                    {
                        ok: false,
                        msg: 'El usuario esta eliminado'
                    }
                );
            }

            const { uid, role } = req;

            if( usuarioId !== uid && role !== 'ADMIN_ROLE' ) {
                return res.status( 401 ).json(
                    {
                        ok: false,
                        msg: 'No tiene privilegios de eliminacion sobre este usuario'
                    }
                );
            }

            if( usuario.img || usuario.img !== '' ) {
                eliminarImagen( 'usuarios', usuarioId, usuario.img );
                eliminarDirectorio( 'usuarios', usuarioId );
            }

            const newStateUsuario = {
                state: false,
                img: ''
            };

            await Usuario.findByIdAndUpdate(
                usuarioId,
                newStateUsuario,
                { 
                    new: true,
                    runValidators: true,
                    context: 'query'
                },
                ( err, usuarioEliminado ) => {
                    if( err ) {
                        console.log( colors.magenta( err ) );

                        return res.status( 500 ).json( {
                            ok: false,
                            msg: 'No se pudo eliminar el usuario en DB'
                        } );
                    }
    
                    return res.status( 202 ).json(
                        {
                            ok: true,
                            usuario: usuarioEliminado
                        }
                    );
                }
            );
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
    marcarEliminacionUsuario
};
