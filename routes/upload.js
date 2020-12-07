/*********************************************************************** RUTAS DE UPLOAD / UPLOAD ***********************************************************************/
/************************************************************************** HOST + /API/UPLOAD **************************************************************************/
const { Router } = require( 'express' );
const fileUpload = require( 'express-fileupload' );
const { validarJWT } = require('../middlewares/validarJWT');
const { cargarImagenUsuario } = require('../controllers/upload/cargarImagenUsuario');
const { cargarImagenProducto } = require( '../controllers/upload/cargarImagenProducto' );

const router = Router();

router.use( validarJWT );

router.use(
    fileUpload(
        {
            safeFileNames: true,
            preserveExtension: 4
        }
    )
);

router.put( '/usuarios/:id', cargarImagenUsuario );

router.put( '/productos/:id/:producto', cargarImagenProducto );

module.exports = router;
