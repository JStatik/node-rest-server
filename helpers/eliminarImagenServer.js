const fs = require( 'fs' );
const path = require( 'path' );

const eliminarImagen = ( content, usuarioId, nombreImg, productoId ) => {
    if( content === 'usuarios' ) {
        const pathImagen = path.resolve( __dirname, `../uploads/${ content }/${ usuarioId }/${ nombreImg }` );

        if( fs.existsSync( pathImagen ) ) {
            fs.unlinkSync( pathImagen );
        }
    } else {
        const pathImagen = path.resolve( __dirname, `../uploads/${ content }/${ usuarioId }/${ productoId }/${ nombreImg }` );

        if( fs.existsSync( pathImagen ) ) {
            fs.unlinkSync( pathImagen );
        }
    }
};

module.exports = {
    eliminarImagen
};
