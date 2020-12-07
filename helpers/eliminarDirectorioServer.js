const fs = require( 'fs' );
const path = require( 'path' );

const eliminarDirectorio = ( content, usuarioId, productoId ) => {
    if( content === 'usuarios' ) {
        const pathDirectorio = path.resolve( __dirname, `../uploads/${ content }/${ usuarioId }` );

        if( fs.existsSync( pathDirectorio ) ) {
            fs.rmdirSync( pathDirectorio );
        }
    } else {   
        const pathDirectorio = path.resolve( __dirname, `../uploads/${ content }/${ usuarioId }/${ productoId }` );

        if( fs.existsSync( pathDirectorio ) ) {
            fs.rmdirSync( pathDirectorio );
        }
    }
};

module.exports = {
    eliminarDirectorio
};
