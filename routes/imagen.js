/******************************************************************** RUTAS DE IMAGEN / IMAGEN ********************************************************************/
/************************************************************************ HOST + /API/IMAGEN ************************************************************************/
const { Router } = require( 'express' );
const { validarJWTUrl } = require( '../middlewares/validarJWTUrl' );
const { obtenerImagenUsuario } = require( '../controllers/imagen/obtenerImagenUsuario' );
const { obtenerImagenProducto } = require( '../controllers/imagen/obtenerImagenProducto' );

const router = Router();

router.use( validarJWTUrl );

router.get( '/usuario/:id', obtenerImagenUsuario );

router.get( '/producto/:id/:producto', obtenerImagenProducto );

module.exports = router;
