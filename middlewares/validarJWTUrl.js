const { response } = require( 'express' );
const jwt = require( 'jsonwebtoken' );
const colors = require( 'colors' );

const validarJWTUrl = ( req, res = response, next ) => {
    const { tkrs } = req.query;

    if( !tkrs ) {
        return res.status( 401 ).json(
            {
                ok: false,
                msg: 'No existe el token en la peticion'
            }
        );
    }

    try {
        const payload = jwt.verify( tkrs, process.env.SECRET_JWT_SEED );
        const { uid, role, name } = payload;

        req.uid = uid;
        req.role = role;
        req.name = name;
    } catch( error ) {
        console.log( colors.magenta( error ) );

        return res.status( 401 ).json(
            {
                ok: false,
                msg: 'Token no válido'
            }
        );
    }

    next();
};

module.exports = {
    validarJWTUrl
};
