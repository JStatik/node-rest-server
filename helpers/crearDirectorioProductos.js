const fs = require( 'fs' );
const path = require( 'path' );

const crearDirectorioProductos = () => {
    const directorioUploads = path.resolve( __dirname, '../uploads' );

    if( !fs.existsSync( directorioUploads ) ) {
        fs.mkdirSync( directorioUploads );
    }

    const directorioProductos = path.resolve( __dirname, `${ directorioUploads }/productos` );

    if( !fs.existsSync( directorioProductos ) ) {
        fs.mkdirSync( directorioProductos );
    }
};

module.exports = {
    crearDirectorioProductos
};
