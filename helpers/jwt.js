const colors = require( 'colors' );
const jwt = require( 'jsonwebtoken' );

const generarJWT = ( uid, name, role ) => {
    return new Promise( ( resolve, reject ) => {
        const payload = { uid: uid, name: name, role: role };

        jwt.sign( payload, process.env.SECRET_JWT_SEED, { expiresIn: '2h' }, ( err, token ) => {
            if( err ) {
                console.log( colors.magenta( err ) );

                reject( colors.red( 'No se pudo generar el token' ) );
            }

            resolve( token );
        } );
    } );
};

module.exports = {
    generarJWT
};
