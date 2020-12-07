const colors = require( 'colors' );
const Categoria = require( '../../models/Categoria' );

const actualizarCategoria = async( req, res ) => {
    const { uid, name } = req;
    const categoriaId = req.params.id;

    if( categoriaId.length !== 24 ) {
        return res.status( 400 ).json(
            {
                ok: false,
                msg: 'El ID es incorrecto'
            }
        );
    }

    try {
        await Categoria.findById( categoriaId, async( err, categoria ) => {
            if( err ) {
                console.log( colors.magenta( err ) );

                return res.status( 500 ).json( {
                    ok: false,
                    msg: 'No se pudo obtener la categoria'
                } );
            }

            if( !categoria ) {
                return res.status( 404 ).json(
                    {
                        ok: false,
                        msg: 'La categoria es inexistente por ese ID'
                    }
                );
            }

            const newDataCategoria = {
                ...req.body,
                user: {
                    uid,
                    name
                }
            };

            await Categoria.findByIdAndUpdate(
                categoriaId,
                newDataCategoria,
                { 
                    new: true,
                    runValidators: true,
                    context: 'query'
                },
                ( err, categoriaActualizada ) => {
                    if( err ) {
                        if( err.errors.categoria ) {
                            console.log( colors.magenta( err ) );

                            return res.status( 400 ).json( {
                                ok: false,
                                msg: 'La categoria ingresada ya existe'
                            } );
                        } else {
                            console.log( colors.magenta( err ) );

                            return res.status( 500 ).json( {
                                ok: false,
                                msg: 'No se pudo almacenar la categoria en la DB'
                            } );
                        }
                    }
    
                    return res.status( 202 ).json(
                        {
                            ok: true,
                            categoria: categoriaActualizada
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
    actualizarCategoria
};
