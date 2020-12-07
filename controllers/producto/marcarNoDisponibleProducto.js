const colors = require( 'colors' );
const Producto = require( '../../models/Producto' );
const { eliminarImagen } = require( '../../helpers/eliminarImagenServer' );
const { eliminarDirectorio } = require( '../../helpers/eliminarDirectorioServer' );

const marcarNoDisponibleProducto = async( req, res ) => {
    const { uid, name, role } = req;
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
        await Producto.findById( productoId, async( err, producto ) => {
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
                return res.status( 400 ).json(
                    {
                        ok: false,
                        msg: 'El producto se encuentra marcado como no disponible'
                    }
                );
            }

            const { uid: uidProducto, name: nameProducto } = producto.user;

            if( uid === uidProducto || name === nameProducto ) {
                if( producto.img || producto.img !== '' ) {
                    eliminarImagen( 'productos', uidProducto, producto.img, producto._id );
                    eliminarDirectorio( 'productos', uidProducto, producto._id );
                }

                const newDataProducto = {
                    available: false,
                    img: ''
                };

                await Producto.findByIdAndUpdate(
                    productoId,
                    newDataProducto,
                    { 
                        new: true,
                        runValidators: true,
                        context: 'query'
                    },
                    ( err, productoEliminado ) => {
                        if( err ) {
                            console.log( colors.magenta( err ) );
    
                            return res.status( 500 ).json( {
                                ok: false,
                                msg: 'No se pudo eliminar el producto en la DB'
                            } );
                        }
        
                        return res.status( 202 ).json(
                            {
                                ok: true,
                                producto: productoEliminado
                            }
                        );
                    }
                );
            } else {
                if( role === 'ADMIN_ROLE' ) {
                    if( producto.img || producto.img !== '' ) {
                        eliminarImagen( 'productos', uidProducto, producto.img, producto._id );
                        eliminarDirectorio( 'productos', uidProducto, producto._id );
                    }

                    const newDataProducto = {
                        available: false,
                        img: ''
                    };

                    await Producto.findByIdAndUpdate(
                        productoId,
                        newDataProducto,
                        { 
                            new: true,
                            runValidators: true,
                            context: 'query'
                        },
                        ( err, productoEliminado ) => {
                            if( err ) {
                                console.log( colors.magenta( err ) );
        
                                return res.status( 500 ).json( {
                                    ok: false,
                                    msg: 'No se pudo eliminar el producto en la DB'
                                } );
                            }
            
                            return res.status( 202 ).json(
                                {
                                    ok: true,
                                    producto: productoEliminado
                                }
                            );
                        }
                    );
                } else {
                    return res.status( 400 ).json(
                        {
                            ok: false,
                            msg: 'No tiene privilegios de eliminación sobre este producto'
                        }
                    );
                }
            }         
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
    marcarNoDisponibleProducto
};
