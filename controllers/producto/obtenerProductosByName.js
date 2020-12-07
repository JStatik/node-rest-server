const colors = require( 'colors' );
const Producto = require( '../../models/Producto' );

const obtenerProductosByName = async( req, res ) => {
    const productoName = req.params.name;

    if( productoName.length < 4 ) {
        return res.status( 400 ).json(
            {
                ok: false,
                msg: 'Ingrese un nombre válido'
            }
        );
    }

    const nameRegex = new RegExp( productoName, 'i' );

    try {
        await Producto.find( { name: nameRegex, available: true } )
            .populate( 'category', '_id categoria' )
            .sort( { price: 'asc' } )
            .exec( async( err, productos ) => {
                if( err ) {
                    console.log( colors.magenta( err ) );

                    return res.status( 500 ).json( {
                        ok: false,
                        msg: 'No se pudo obtener los productos'
                    } );
                }

                if( !productos || productos.length === 0 ) {
                    return res.status( 404 ).json(
                        {
                            ok: false,
                            msg: 'Los productos son inexistentes por ese nombre'
                        }
                    );
                }

                await Producto.countDocuments( { name: nameRegex, available: true }, ( err, cantidad ) => {
                    if( err ) {
                        console.log( colors.magenta( err ) );
        
                        return res.status( 500 ).json( {
                            ok: false,
                            msg: 'No se pudo obtener los productos'
                        } );
                    }

                    return res.status( 200 ).json(
                        {
                            ok: true,
                            cantidadProductos: cantidad,
                            productos: productos
                        }
                    );
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
    obtenerProductosByName
};
