const colors = require( 'colors' );
const Categoria = require( '../../models/Categoria' );
const Producto = require( '../../models/Producto' );

const crearProducto = async( req, res ) => {
    const { uid, name } = req;
    const { category: categoryReq, name: nameReq } = req.body;

    try {
        const categoria = await Categoria.findOne( { categoria: categoryReq } );

        if( !categoria ) {
            return res.status( 400 ).json(
                {
                    ok: false,
                    msg: 'La categoria ingresada no existe'
                }
            );
        }

        const productoDB = await Producto.findOne( { name: nameReq, user: { uid, name } } );

        if( productoDB ) {
            return res.status( 400 ).json(
                {
                    ok: false,
                    msg: 'El usuario ya posee un registro de este producto'
                }
            );
        }

        const newProducto = {
            ...req.body,
            category: categoria._id,
            user: {
                uid,
                name
            }
        };

        newProducto.price = parseFloat( newProducto.price ).toFixed( 2 );

        const producto = new Producto( newProducto );

        await producto.save( async( err, productoDB ) => {
            if( err ) {
                console.log( colors.magenta( err ) );

                return res.status( 500 ).json( {
                    ok: false,
                    msg: 'No se pudo almacenar el producto en la DB'
                } );
            }

            return res.status( 201 ).json( {
                ok: true,
                producto: productoDB
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
    crearProducto
};
