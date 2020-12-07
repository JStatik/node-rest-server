/******************************************************************* CARGAR META CON CLIENT_ID_GOOGLE *******************************************************************/

fetch( '/api/meta', {
    method: 'POST'
} )
    .then( res => res.json() )
    .then( res => {
        const etiquetaMeta = document.createElement( 'meta' );
        const etiquetaScript = document.createElement( 'script' );

        etiquetaScript.setAttribute( 'src', 'https://apis.google.com/js/platform.js' );
        etiquetaScript.setAttribute( 'async', '' );
        etiquetaScript.setAttribute( 'defer', '' );

        etiquetaMeta.setAttribute( 'name', res.meta.name );
        etiquetaMeta.setAttribute( 'content', res.meta.content );

        document.getElementsByTagName( 'head' )[ 0 ].append( etiquetaScript );
        document.getElementsByTagName( 'head' )[ 0 ].append( etiquetaMeta );  
    } )
    .catch( err => console.log( err ) );

/******************************************************* METODOS ONSIGNIN Y SIGNOUT DE LA DOCUMENTACION DE GOOGLE *******************************************************/

function onSignIn( googleUser ) {
    const id_token = googleUser.getAuthResponse().id_token;

    const xhr = new XMLHttpRequest();
    xhr.open( 'POST', '/api/auth/google' );

    xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );

    xhr.onload = () => {
        const respuesta = JSON.parse( xhr.responseText );
        console.log( respuesta );

        fetch( `/api/imagen/usuario/${ respuesta.usuario.uid }?tkrs=${ respuesta.token }` )
            .then( img => img.text() )
            .then( img => {
                const etiquetaImg = document.createElement( 'img' );
                
                etiquetaImg.setAttribute( 'src', img );
                etiquetaImg.setAttribute( 'alt', 'Imagen usuario' );

                document.getElementsByTagName( 'body' )[ 0 ].append( etiquetaImg );
            } )
            .catch( err => console.log( err ) );
    };

    xhr.send( `tokenGoogle=${ id_token }` );
};

const signOut = () => {
    gapi.auth2.getAuthInstance().disconnect();

    console.log('User signed out.');
};
