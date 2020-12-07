const loadMeta = ( req, res ) => {
    return res.status( 200 ).json(
        {
            meta: {
                name: 'google-signin-client_id',
                content: process.env.CLIENT_ID_GOOGLE
            }
        }
    );
};

module.exports = {
    loadMeta
};
