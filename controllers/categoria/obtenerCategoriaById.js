const colors = require( 'colors' );
const Categoria = require( '../../models/Categoria' );

const obtenerCategoriaById = async( req, res ) => {
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
        await Categoria.findById( categoriaId, ( err, categoria ) => {
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

            return res.status( 200 ).json(
                {
                    ok: true,
                    categoria: categoria
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
    obtenerCategoriaById
};
