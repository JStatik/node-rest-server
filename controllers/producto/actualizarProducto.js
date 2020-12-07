const colors = require( 'colors' );
const Producto = require( '../../models/Producto' );
const Categoria = require( '../../models/Categoria' );

const actualizarProducto = async( req, res ) => {
    const { uid, name, role } = req;
    const productoId = req.params.id;
    const { category: categoryReq } = req.body;

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

            const { uid: uidProducto, name: nameProducto } = producto.user;

            if( uid === uidProducto || name === nameProducto ) {
                const categoria = await Categoria.findOne( { categoria: categoryReq } );

                if( !categoria ) {
                    return res.status( 400 ).json(
                        {
                            ok: false,
                            msg: 'La categoria ingresada no existe'
                        }
                    );
                }

                const newDataProducto = {
                    ...req.body,
                    category: categoria._id
                };

                newDataProducto.price = parseFloat( newDataProducto.price ).toFixed( 2 );

                await Producto.findByIdAndUpdate(
                    productoId,
                    newDataProducto,
                    { 
                        new: true,
                        runValidators: true,
                        context: 'query'
                    },
                    ( err, productoActualizado ) => {
                        if( err ) {
                            console.log( colors.magenta( err ) );
    
                            return res.status( 500 ).json( {
                                ok: false,
                                msg: 'No se pudo actualizar el producto en la DB'
                            } );
                        }
        
                        return res.status( 202 ).json(
                            {
                                ok: true,
                                producto: productoActualizado
                            }
                        );
                    }
                );
            } else {
                if( role === 'ADMIN_ROLE' ) {
                    const categoria = await Categoria.findOne( { categoria: categoryReq } );

                    if( !categoria ) {
                        return res.status( 400 ).json(
                            {
                                ok: false,
                                msg: 'La categoria ingresada no existe'
                            }
                        );
                    }

                    const newDataProducto = {
                        ...req.body,
                        category: categoria._id
                    };

                    newDataProducto.price = parseFloat( newDataProducto.price ).toFixed( 2 );

                    await Producto.findByIdAndUpdate(
                        productoId,
                        newDataProducto,
                        { 
                            new: true,
                            runValidators: true,
                            context: 'query'
                        },
                        ( err, productoActualizado ) => {
                            if( err ) {
                                console.log( colors.magenta( err ) );
        
                                return res.status( 500 ).json( {
                                    ok: false,
                                    msg: 'No se pudo actualizar el producto en la DB'
                                } );
                            }
            
                            return res.status( 202 ).json(
                                {
                                    ok: true,
                                    producto: productoActualizado
                                }
                            );
                        }
                    );
                } else {
                    return res.status( 400 ).json(
                        {
                            ok: false,
                            msg: 'No tiene privilegios de edición sobre este producto'
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
    actualizarProducto
};
