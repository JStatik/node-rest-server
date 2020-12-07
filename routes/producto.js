/******************************************************************** RUTAS DE PRODUCTO / PRODUCTO ********************************************************************/
/************************************************************************ HOST + /API/PRODUCTO ************************************************************************/
const { Router } = require( 'express' );
const { check } = require( 'express-validator' );
const { validarCampos } = require( '../middlewares/validarCampos' );
const { validarJWT } = require('../middlewares/validarJWT');
const { isNumber } = require('../helpers/isNumber');
const { obtenerProductos } = require( '../controllers/producto/obtenerProductos' );
const { obtenerProductoById } = require( '../controllers/producto/obtenerProductoById' );
const { obtenerProductosByName } = require( '../controllers/producto/obtenerProductosByName' );
const { crearProducto } = require( '../controllers/producto/crearProducto' );
const { actualizarProducto } = require( '../controllers/producto/actualizarProducto' );
const { marcarNoDisponibleProducto } = require( '../controllers/producto/marcarNoDisponibleProducto' );

const router = Router();

router.use( validarJWT );

router.get( '/', obtenerProductos );

router.get( '/:id', obtenerProductoById );

router.get( '/buscar/:name', obtenerProductosByName );

router.post(
    '/',
    [
        check( 'name', 'Debe ingresar un nombre válido' ).trim().escape().not().isEmpty().isLength( { min: 2 } ).isString(),
        check( 'price', 'Debe ingresar un precio válido' ).custom( isNumber ).not().isEmpty().isNumeric(),
        check( 'description', 'Debe ingresar una descripción válida' ).trim().escape().isString(),
        check( 'category', 'Debe ingresar una categoria válida' ).trim().escape().not().isEmpty().isLength( { min: 2 } ).isString(),
        validarCampos
    ],
    crearProducto
);

router.put(
    '/:id',
    [
        check( 'name', 'Debe ingresar un nombre válido' ).trim().escape().not().isEmpty().isLength( { min: 2 } ).isString(),
        check( 'price', 'Debe ingresar un precio válido' ).custom( isNumber ).not().isEmpty().isNumeric(),
        check( 'description', 'Debe ingresar una descripción válida' ).trim().escape().isString(),
        check( 'category', 'Debe ingresar una categoria válida' ).trim().escape().not().isEmpty().isLength( { min: 2 } ).isString(),
        validarCampos
    ],
    actualizarProducto
);

router.delete( '/:id', marcarNoDisponibleProducto );

module.exports = router;
