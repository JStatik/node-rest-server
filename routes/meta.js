/********************************************************************** RUTAS DE META / META **********************************************************************/
/************************************************************************* HOST + /API/META *************************************************************************/
const { Router } = require( 'express' );
const { loadMeta } = require( '../controllers/meta/meta' );

const router = Router();

router.post( '/', loadMeta );

module.exports = router;
