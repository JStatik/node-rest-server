const colors = require( 'colors' );
const { OAuth2Client } = require( 'google-auth-library' );

const client = new OAuth2Client( process.env.CLIENT_ID_GOOGLE );

const verify = async( token ) => {
    try {
        const ticket = await client.verifyIdToken( {
            idToken: token,
            audience: process.env.CLIENT_ID_GOOGLE,
        } );

        const payload = ticket.getPayload();
  
        return payload;
    } catch( err ) {
        console.log( colors.magenta( err ) );

        return null;
    } 
}

module.exports = {
    verify
};
