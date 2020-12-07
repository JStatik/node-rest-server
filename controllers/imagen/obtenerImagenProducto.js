const fs = require( 'fs' );
const path = require( 'path' );
const colors = require( 'colors' );
const Producto = require( '../../models/Producto' );

const obtenerImagenProducto = async( req, res ) => {
    const { uid } = req;
    const { id: usuarioId, producto: productoId } = req.params;

    if( usuarioId.length !== 24 || productoId.length !== 24 ) {
        return res.status( 400 ).json(
            {
                ok: false,
                msg: 'El ID del usuario/producto es incorrecto'
            }
        );
    }

    if( usuarioId !== uid ) {
        return res.status( 401 ).json(
            {
                ok: false,
                msg: 'No tiene privilegios para acceder a la informacion de este usuario'
            }
        );
    }

    try {
        await Producto.findById( productoId, ( err, productoDB ) => {
            if( err ) {
                console.log( colors.magenta( err ) );
    
                return res.status( 500 ).json(
                    {
                        ok: false,
                        msg: 'No se pudo obtener el producto'
                    }
                );
            }
    
            if( !productoDB ) {
                return res.status( 404 ).json(
                    {
                        ok: false,
                        msg: 'El producto es inexistente por ese ID'
                    }
                );
            }

            if( productoDB.user.uid !== uid ) {
                return res.status( 401 ).json(
                    {
                        ok: false,
                        msg: 'No tiene privilegios para acceder a la informacion de este usuario'
                    }
                );
            }

            if( productoDB.available === false ) {
                return res.status( 404 ).json(
                    {
                        ok: false,
                        msg: 'El producto no se encuentra disponible'
                    }
                );
            }

            const pathNoImage = path.resolve( __dirname, '../../assets/no-image.jpg' );

            if( !productoDB.img || productoDB.img === '' ) {
                return res.status( 404 ).sendFile( pathNoImage );
            }

            const pathImage = path.resolve( __dirname, `../../uploads/productos/${ uid }/${ productoId }/${ productoDB.img }` );

            if( fs.existsSync( pathImage ) ) {
                return res.status( 200 ).sendFile( pathImage );
            } else {      
                return res.status( 404 ).sendFile( pathNoImage );
            } 
        } );
    } catch(err) {
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
    obtenerImagenProducto
};
