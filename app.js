const dotenv = require( 'dotenv' ).config();
const colors = require( 'colors' );
const express = require( 'express' );
const path = require( 'path' );
const cors = require( 'cors' );
const { dbConnection } = require( './database/config' );

const app = express();

if( dotenv.error ) {
    return console.log( colors.red( dotenv.error ) );
}

/**************************************************************************** BASE DE DATOS ****************************************************************************/
dbConnection();

/**************************************************************************** CORS ****************************************************************************/
app.use( cors() );

/********************************************************************** LECTURA Y PARSEO DEL BODY **********************************************************************/
app.use( express.urlencoded( { extended: false } ) );
app.use( express.json() );

/************************************************************************** DIRECTORIO PUBLICO **************************************************************************/
app.use( express.static( path.resolve( `${ __dirname }/public/` ) ) );

/****************************************************************************** ENDPOINTS ******************************************************************************/
app.use( '/api/meta', require( './routes/meta' ) );
app.use( '/api/auth', require( './routes/auth' ) );
app.use( '/api/usuario', require( './routes/usuario' ) );
app.use( '/api/categoria', require( './routes/categoria' ) );
app.use( '/api/producto', require( './routes/producto' ) );
app.use( '/api/upload', require( './routes/upload' ) );
app.use( '/api/imagen', require( './routes/imagen' ) );
app.get( '*', ( req, res ) => {
    res.sendFile( path.join( `${ __dirname }/public/` ) );
} );

/******************************************************************************** SERVER ********************************************************************************/
app.listen( process.env.PORT, () => {
    console.log( colors.yellow( `Servidor corriendo en puerto: ${ process.env.PORT }` ) );
} );
