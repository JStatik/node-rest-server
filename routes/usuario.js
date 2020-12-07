/********************************************************************** RUTAS DE USUARIO / USUARIO **********************************************************************/
/************************************************************************* HOST + /API/USUARIO *************************************************************************/
const { Router } = require( 'express' );
const { check } = require( 'express-validator' );
const { validarCampos } = require( '../middlewares/validarCampos' );
const { validarJWT } = require('../middlewares/validarJWT');
const { validarAdmin } = require( '../middlewares/validarAdmin' );
const { obtenerUsuarios } = require( '../controllers/usuario/obtenerUsuarios' );
const { crearUsuario } = require( '../controllers/usuario/crearUsuario' );
const { actualizarUsuario } = require( '../controllers/usuario/actualizarUsuario' );
const { marcarEliminacionUsuario } = require( '../controllers/usuario/marcarEliminacionUsuario' );

const router = Router();

router.post(
    '/',
    [
        check( 'name', 'Debe ingresar un nombre válido' ).trim().escape().not().isEmpty().isLength( { min: 2 } ).isString(),
        check( 'email', 'Debe ingresar un email válido' ).isEmail().not().isEmpty().isLength( { min: 2 } ),
        check( 'password', 'Debe ingresar un password válido: Al menos 6 caracteres y alfanúmerico' ).isAlphanumeric().not().isEmpty().isLength( { min: 6 } ),
        validarCampos
    ],
    crearUsuario
);

router.get( '/', [ validarJWT, validarAdmin ], obtenerUsuarios );

router.put(
    '/:id',
    [
        validarJWT,
        validarAdmin,
        check( 'name', 'Debe ingresar un nombre válido' ).trim().escape().not().isEmpty().isLength( { min: 2 } ).isString(),
        check( 'email', 'Debe ingresar un email válido' ).isEmail().not().isEmpty().isLength( { min: 2 } ),
        check( 'img', 'Debe ingresar una imagen válida' ).trim().escape().isString(),
        validarCampos
    ],
    actualizarUsuario
);

router.delete( '/:id', [ validarJWT, validarAdmin ], marcarEliminacionUsuario );

module.exports = router;
