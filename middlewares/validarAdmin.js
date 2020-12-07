const { response } = require( 'express' );

const validarAdmin = ( req, res = response, next ) => {
    const role = req.role;

    if( role === 'ADMIN_ROLE' ) {
        next();
    } else {
        return res.status( 401 ).json(
            {
                ok: false,
                msg: 'No tiene privilegios de administrador'
            }
        );
    }
};

module.exports = {
    validarAdmin
};
