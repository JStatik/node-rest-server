const colors = require( 'colors' );
const Categoria = require('../../models/Categoria');
const Producto = require( '../../models/Producto' );

const obtenerProductos = async( req, res ) => {
    const category = req.query.category || null;
    const start = Number( req.query.start ) || 0;
    const limit = Number( req.query.limit ) || 5;

    try {
        if( category ) {
            const categoria = await Categoria.findOne( { categoria: category } );

            if( !categoria ) {
                return res.status( 400 ).json( {
                    ok: false,
                    msg: 'La categoria ingresada no existe'
                } );
            }

            await Producto.find( { category: categoria._id, available: true } )
                .populate( 'category', '_id categoria' )
                .sort( { price: 'asc' } )
                .skip( start )
                .limit( limit )
                .exec( async( err, productos ) => {
                    if( err ) {
                        console.log( colors.magenta( err ) );
        
                        return res.status( 500 ).json( {
                            ok: false,
                            msg: 'No se pudo obtener los productos de la DB'
                        } );
                    }

                    await Producto.countDocuments( { category: categoria._id, available: true }, ( err, cantidad ) => {
                        if( err ) {
                            console.log( colors.magenta( err ) );
            
                            return res.status( 500 ).json( {
                                ok: false,
                                msg: 'No se pudo obtener los productos de la DB'
                            } );
                        }

                        if( productos.length === 0 ) {
                            return res.status( 404 ).json( {
                                ok: false,
                                cantidadProductos: cantidad,
                                msg: 'No existen registros'
                            } );
                        }   
        
                        return res.status( 200 ).json( {
                            ok: true,
                            cantidadProductos: cantidad,
                            productos: productos
                        } );
                    } );
                } );
        } else {
            await Producto.find( { available: true } )
            .populate( 'category', '_id categoria' )
            .sort( { price: 'asc' } )
            .skip( start )
            .limit( limit )
            .exec( async( err, productos ) => {
                if( err ) {
                    console.log( colors.magenta( err ) );
    
                    return res.status( 500 ).json( {
                        ok: false,
                        msg: 'No se pudo obtener los productos de la DB'
                    } );
                }

                await Producto.countDocuments( { available: true }, ( err, cantidad ) => {
                    if( err ) {
                        console.log( colors.magenta( err ) );
        
                        return res.status( 500 ).json( {
                            ok: false,
                            msg: 'No se pudo obtener los productos de la DB'
                        } );
                    }

                    if( productos.length === 0 ) {
                        return res.status( 404 ).json( {
                            ok: false,
                            cantidadProductos: cantidad,
                            msg: 'No existen registros'
                        } );
                    }   
    
                    return res.status( 200 ).json( {
                        ok: true,
                        cantidadProductos: cantidad,
                        productos: productos
                    } );
                } );
            } );
        }
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
    obtenerProductos
};
