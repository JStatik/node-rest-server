const fs = require( 'fs' );
const path = require( 'path' );

const crearDirectorioUsuarios = () => {
    const directorioUploads = path.resolve( __dirname, '../uploads' );

    if( !fs.existsSync( directorioUploads ) ) {
        fs.mkdirSync( directorioUploads );
    }

    const directorioUsuarios = path.resolve( __dirname, `${ directorioUploads }/usuarios` );

    if( !fs.existsSync( directorioUsuarios ) ) {
        fs.mkdirSync( directorioUsuarios );
    }
};

module.exports = {
    crearDirectorioUsuarios
};
