const colors = require( 'colors' );
const Usuario = require( '../../models/Usuario' );

const obtenerUsuarios = async( req, res ) => {
    const start = Number( req.query.start ) || 0;
    const limit = Number( req.query.limit ) || 5;

    try {
        await Usuario.find( { state: true }, 'name email role google img' )
            .skip( start )
            .limit( limit )
            .exec( async( err, usuarios ) => {
                if( err ) {
                    console.log( colors.magenta( err ) );
    
                    return res.status( 500 ).json( {
                        ok: false,
                        msg: 'No se pudo obtener los usuarios de la DB'
                    } );
                }

                await Usuario.countDocuments( { state: true }, ( err, cantidad ) => {
                    if( err ) {
                        console.log( colors.magenta( err ) );
        
                        return res.status( 500 ).json( {
                            ok: false,
                            msg: 'No se pudo obtener los usuarios de la DB'
                        } );
                    }

                    if( usuarios.length === 0 ) {
                        return res.status( 404 ).json( {
                            ok: false,
                            cantidadUsuarios: cantidad,
                            msg: 'No existen registros'
                        } );
                    }   
    
                    return res.status( 200 ).json( {
                        ok: true,
                        cantidadUsuarios: cantidad,
                        usuarios
                    } );
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
    obtenerUsuarios
};
