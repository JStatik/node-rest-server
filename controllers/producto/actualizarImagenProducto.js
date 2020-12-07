const colors = require( 'colors' );
const Producto = require( '../../models/Producto' );
const { eliminarImagen } = require( '../../helpers/eliminarImagenServer' );
const { eliminarDirectorio } = require( '../../helpers/eliminarDirectorioServer' );

const actualizarImagenProducto = async( res, content, uidReq, nombreImg, productoId ) => {
    try {
        await Producto.findById( productoId, async( err, producto ) => {
            if( err ) {
                console.log( colors.magenta( err ) );

                eliminarImagen( content, uidReq, nombreImg, productoId );
                eliminarDirectorio( content, uidReq, productoId );

                return res.status( 500 ).json( {
                    ok: false,
                    msg: 'No se pudo obtener el producto'
                } );
            }

            if( !producto ) {
                eliminarImagen( content, uidReq, nombreImg, productoId );
                eliminarDirectorio( content, uidReq, productoId );

                return res.status( 404 ).json(
                    {
                        ok: false,
                        msg: 'El producto es inexistente por ese ID'
                    }
                );
            }

            if( producto.user.uid !== uidReq ) {
                eliminarImagen( content, uidReq, nombreImg, productoId );
                eliminarDirectorio( content, uidReq, productoId );
                
                return res.status( 401 ).json(
                    {
                        ok: false,
                        msg: 'No tiene privilegios de edicion sobre este producto'
                    }
                );
            }

            if( producto.available === false ) {
                eliminarImagen( content, uidReq, nombreImg, productoId );
                eliminarDirectorio( content, uidReq, productoId );
                
                return res.status( 401 ).json(
                    {
                        ok: false,
                        msg: 'El producto no se encuentra disponible'
                    }
                );
            }

            if( producto.img || producto.img !== '' ) {
                eliminarImagen( content, uidReq, producto.img, productoId );
            }

            const newDataProducto = {
                img: nombreImg
            };

            await Producto.findByIdAndUpdate(
                productoId,
                newDataProducto,
                { 
                    new: true,
                    runValidators: true,
                    context: 'query'
                }
            )
                .populate( 'category', '_id categoria' )
                .exec( ( err, productoActualizado ) => {
                    if( err ) {
                        console.log( colors.magenta( err ) );

                        eliminarImagen( content, uidReq, nombreImg, productoId );
    
                        return res.status( 500 ).json( {
                            ok: false,
                            msg: 'No se pudo actualizar el producto en DB'
                        } ); 
                    }
    
                    return res.status( 202 ).json(
                        {
                            ok: true,
                            producto: productoActualizado
                        }
                    );
                } );
        } ); 
    } catch( err ) {
        console.log( colors.magenta( err ) );

        eliminarImagen( content, uidReq, nombreImg, productoId );
        eliminarDirectorio( content, uidReq, productoId );

        return res.status( 500 ).json(
            {
                ok: false,
                msg: 'Por favor, hable con el administrador'
            }
        );
    }
};

module.exports = {
    actualizarImagenProducto
};
