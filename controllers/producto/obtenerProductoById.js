const colors = require( 'colors' );
const Producto = require( '../../models/Producto' );

const obtenerProductoById = async( req, res ) => {
    const productoId = req.params.id;

    if( productoId.length !== 24 ) {
        return res.status( 400 ).json(
            {
                ok: false,
                msg: 'El ID es incorrecto'
            }
        );
    }

    try {
        await Producto.findById( productoId )
            .populate( 'category', '_id categoria' )
            .exec( ( err, producto ) => {
                if( err ) {
                    console.log( colors.magenta( err ) );

                    return res.status( 500 ).json( {
                        ok: false,
                        msg: 'No se pudo obtener el producto'
                    } );
                }

                if( !producto ) {
                    return res.status( 404 ).json(
                        {
                            ok: false,
                            msg: 'El producto es inexistente por ese ID'
                        }
                    );
                }

                if( producto.available === false ) {
                    return res.status( 404 ).json(
                        {
                            ok: false,
                            msg: 'El producto no se encuentra disponible'
                        }
                    );
                }

                return res.status( 200 ).json(
                    {
                        ok: true,
                        producto: producto
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
    obtenerProductoById
};
