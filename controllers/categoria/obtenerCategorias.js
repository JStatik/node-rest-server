const colors = require( 'colors' );
const Categoria = require( '../../models/Categoria' );

const obtenerCategorias = async( req, res ) => {
    const start = Number( req.query.start ) || 0;
    const limit = Number( req.query.limit ) || 5;

    try {
        await Categoria.find()
            .sort( { categoria: 'asc' } )
            .skip( start )
            .limit( limit )
            .exec( async( err, categorias ) => {
                if( err ) {
                    console.log( colors.magenta( err ) );
    
                    return res.status( 500 ).json( {
                        ok: false,
                        msg: 'No se pudo obtener las categorias de la DB'
                    } );
                }

                await Categoria.countDocuments( ( err, cantidad ) => {
                    if( err ) {
                        console.log( colors.magenta( err ) );
        
                        return res.status( 500 ).json( {
                            ok: false,
                            msg: 'No se pudo obtener las categorias de la DB'
                        } );
                    }

                    if( categorias.length === 0 ) {
                        return res.status( 404 ).json( {
                            ok: false,
                            cantidadCategorias: cantidad,
                            msg: 'No existen registros'
                        } );
                    }   
    
                    return res.status( 200 ).json( {
                        ok: true,
                        cantidadCategorias: cantidad,
                        categorias: categorias
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
    obtenerCategorias
};
