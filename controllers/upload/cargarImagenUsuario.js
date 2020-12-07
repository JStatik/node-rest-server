const fs = require( 'fs' );
const colors = require( 'colors' );
const sharp = require( 'sharp' );
const uniqid = require( 'uniqid' );
const { actualizarImagenUsuario } = require( '../usuario/actualizarImagenUsuario' );

const cargarImagenUsuario = ( req, res ) => {
    const { uid } = req;
    const { id: usuarioId } = req.params;

    if( !req.files || Object.keys( req.files ).length === 0 ) {
        return res.status( 400 ).json(
            {
                ok: false,
                msg: 'No existe un archivo seleccionado'
            }
        );
    }

    const { dataFile } = req.files;
    const { name: nameFile, mimetype: typeFile, data: bufferFile } = dataFile;
    const extensionesValidas = [ 'png', 'jpg', 'jpeg', 'gif' ];

    if( nameFile.split( '.' )[ 0 ] === '' ) {
        return res.status( 400 ).json(
            {
                ok: false,
                msg: 'El nombre del archivo seleccionado no es válido'
            }
        );
    }

    const extensionValid = extensionesValidas.find( extension => {
        if( extension === typeFile.split( '/' )[ 1 ] ) {
            return extension;
        }
    } );

    if( extensionValid ) {
        if( usuarioId.length !== 24 ) {
            return res.status( 400 ).json(
                {
                    ok: false,
                    msg: 'El ID es incorrecto'
                }
            );
        }

        if( usuarioId !== uid ) {
            return res.status( 401 ).json(
                {
                    ok: false,
                    msg: 'No tiene privilegios de edicion sobre este usuario'
                }
            );
        }

        const directorio = `./uploads/usuarios/${ uid }`;
        const nombreArchivo = `${ uniqid() }.jpg`;

        if( !fs.existsSync( directorio ) ) {
            fs.mkdirSync( directorio );
        }

        sharp( bufferFile )
            .resize(
                {
                    width: 96,
                    height: 96,
                    fit: 'cover'
                }
            )
            .toFile( `${ directorio }/${ nombreArchivo }` )
            .then( async() => {
                await actualizarImagenUsuario( res, 'usuarios', uid, nombreArchivo );
            } )
            .catch( err => {
                console.log( colors.magenta( err ) );

                return res.status( 500 ).json(
                    {
                        ok: false,
                        msg: err
                    }
                );
            } );
    } else {
        return res.status( 400 ).json(
            {
                ok: false,
                msg: 'El archivo seleccionado no es válido, seleccione una imagen'
            }
        );
    }
};

module.exports = {
    cargarImagenUsuario
};
