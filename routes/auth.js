/********************************************************************** RUTAS DE AUTH / AUTH **********************************************************************/
/************************************************************************* HOST + /API/AUTH *************************************************************************/
const { Router } = require( 'express' );
const { check } = require( 'express-validator' );
const { validarCampos } = require( '../middlewares/validarCampos' );
const { login } = require( '../controllers/auth/login' );
const { loginGoogle } = require( '../controllers/auth/loginGoogle' );

const router = Router();

router.post(
    '/',
    [
        check( 'email', 'Debe ingresar un email válido' ).isEmail().not().isEmpty().isLength( { min: 2 } ),
        check( 'password', 'Debe ingresar un password válido: Al menos 6 caracteres y alfanúmerico' ).isAlphanumeric().not().isEmpty().isLength( { min: 6 } ),
        validarCampos
    ],
    login
);

router.post(
    '/google',
    [
        check( 'tokenGoogle', 'El token de Google es inválido' ).trim().escape().not().isEmpty().isLength( { min: 2 } ).isString(),
        validarCampos
    ],
    loginGoogle
);

module.exports = router;
