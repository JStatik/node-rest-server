/******************************************************************** RUTAS DE CATEGORIA / CATEGORIA ********************************************************************/
/************************************************************************ HOST + /API/CATEGORIA ************************************************************************/
const { Router } = require( 'express' );
const { check } = require( 'express-validator' );
const { validarCampos } = require( '../middlewares/validarCampos' );
const { validarJWT } = require('../middlewares/validarJWT');
const { validarAdmin } = require( '../middlewares/validarAdmin' );
const { obtenerCategorias } = require( '../controllers/categoria/obtenerCategorias' );
const { obtenerCategoriaById } = require( '../controllers/categoria/obtenerCategoriaById' );
const { crearCategoria } = require( '../controllers/categoria/crearCategoria' );
const { actualizarCategoria } = require( '../controllers/categoria/actualizarCategoria' );
const { eliminarCategoria } = require( '../controllers/categoria/eliminarCategoria' );

const router = Router();

router.use( validarJWT );

router.get( '/', obtenerCategorias );

router.get( '/:id', obtenerCategoriaById );

router.post(
    '/',
    [
        validarAdmin,
        check( 'categoria', 'Debe ingresar una categoria válida' ).trim().escape().not().isEmpty().isLength( { min: 2 } ).isString(),
        validarCampos
    ],
    crearCategoria
);

router.put(
    '/:id',
    [
        validarAdmin,
        check( 'categoria', 'Debe ingresar una categoria válida' ).trim().escape().not().isEmpty().isLength( { min: 2 } ).isString(),
        validarCampos
    ],
    actualizarCategoria
);

router.delete( '/:id', validarAdmin, eliminarCategoria );

module.exports = router;
