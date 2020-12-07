const colors = require( 'colors' );
const Categoria = require( '../../models/Categoria' );

const crearCategoria = async( req, res ) => {
    const { uid, name } = req;
    const { categoria: categoriaReq } = req.body;

    try {
        let categoria = await Categoria.findOne( { categoria: categoriaReq } );

        if( categoria ) {
            return res.status( 400 ).json(
                {
                    ok: false,
                    msg: 'La categoria ingresada ya existe'
                }
            );
        }

        const newCategoria = {
            ...req.body,
            user: {
                uid,
                name
            }
        };

        categoria = new Categoria( newCategoria );

        await categoria.save( async( err, categoriaDB ) => {
            if( err ) {
                console.log( colors.magenta( err ) );

                return res.status( 500 ).json( {
                    ok: false,
                    msg: 'No se pudo almacenar la categoria en la DB'
                } );
            }

            return res.status( 201 ).json( {
                ok: true,
                categoria: categoriaDB
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
    crearCategoria
};
