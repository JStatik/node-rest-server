const colors = require( 'colors' );
const { pick } = require( 'underscore' );
const Usuario = require( '../../models/Usuario' );

const actualizarUsuario = async( req, res ) => {
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
                        msg: 'El usuario se encuentra eliminado'
                    }
                );
            }

            const { uid, role } = req;

            if( usuarioId !== uid && role !== 'ADMIN_ROLE' ) {
                return res.status( 401 ).json(
                    {
                        ok: false,
                        msg: 'No tiene privilegios de edicion sobre este usuario'
                    }
                );
            }

            const usuarioUnderscore = pick( req.body, [ 'name', 'email', 'img', 'role' ] );

            const newDataUsuario = {
                ...usuarioUnderscore
            };

            await Usuario.findByIdAndUpdate(
                usuarioId,
                newDataUsuario,
                { 
                    new: true,
                    runValidators: true,
                    context: 'query'
                },
                ( err, usuarioActualizado ) => {
                    if( err ) {
                        if( err.errors.email ) {
                            console.log( colors.magenta( err.errors.email ) );
    
                            return res.status( 400 ).json(
                                {
                                    ok: false,
                                    msg: 'El email ingresado ya está en uso'
                                }
                            );
                        } else {
                            console.log( colors.magenta( err ) );
    
                            return res.status( 500 ).json( {
                                ok: false,
                                msg: 'No se pudo actualizar el usuario en DB'
                            } );
                        }    
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

        return res.status( 500 ).json(
            {
                ok: false,
                msg: 'Por favor, hable con el administrador'
            }
        );
    }
};

module.exports = {
    actualizarUsuario
};
