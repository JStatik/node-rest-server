# REST Server

Aplicacion backend que crea, actualiza, obtiene y elimina USUARIOS, CATEGORIAS Y PRODUCTOS de una base de datos MongoDB con validaciones mediante JWT
Tambien carga, elimina y obtiene archivos de imagen del mismo servidor y anexa las respectivas imagenes a usuarios o productos segun corresponda


**Carga etiqueta meta con el CLIENT_ID de Google, necesario para la autenticacion**
```
POST /api/meta
```


**Crear usuario**
```
POST /api/usuario
```
Content-Type: application/x-www-form-urlencoded
Body: name, email, password (Obligatorios)


**Obtener usuarios paginados `Solo usuarios con role ADMIN puede obtenerlos`**
```
GET /api/usuario?start=0&limit=5
```
query.start en 0 por defecto si no se define
query.limit en 5 por defecto si no se define

Header: x-token (Obligatorio)


**Actualizar usuario `Solo usuarios con role ADMIN puede actualizarlos`**
```
PUT /api/usuario/:idUsuario
```
Content-Type: application/x-www-form-urlencoded
Header: x-token (Obligatorio)
Body: name, email (Obligatorios) - role (Opcional)


**Eliminar usuario `Solo usuarios con role ADMIN puede eliminarlos`**
```
DELETE /api/usuario/:idUsuario
```
Header: x-token (Obligatorio)


**Login de usuario con email y password**
```
POST /api/auth
```
Content-Type: application/x-www-form-urlencoded
Body: email, password (Obligatorios)


**Login de usuario con autenticacion de Google**
```
POST /api/auth/google
```
Content-Type: application/x-www-form-urlencoded
Body: tokenGoogle (Token recibido de Google al momento de autenticarse - Obligatorio)


**Crear categoria `Solo usuarios con role ADMIN puede crearlas`**
```
POST /api/categoria
```
Content-Type: application/x-www-form-urlencoded
Header: x-token (Obligatorio)
Body: categoria (Obligatorio)


**Obtener categorias paginadas**
```
GET /api/categoria?start=0&limit=5
```
query.start en 0 por defecto si no se define
query.limit en 5 por defecto si no se define

Header: x-token (Obligatorio)


**Obtener categoria por ID**
```
GET /api/categoria/:idCategoria
```
Header: x-token (Obligatorio)


**Actualizar categoria `Solo usuarios con role ADMIN puede actualizarlas`**
```
PUT /api/categoria/:idCategoria
```
Content-Type: application/x-www-form-urlencoded
Header: x-token (Obligatorio)
Body: categoria (Obligatorio)


**Eliminar categoria `Solo usuarios con role ADMIN puede eliminarlas`**
```
DELETE /api/categoria/:idCategoria
```
Header: x-token (Obligatorio)


**Crear producto**
```
POST /api/producto
```
Content-Type: application/x-www-form-urlencoded
Header: x-token (Obligatorio)
Body: name, price, category (Obligatorio) - description (Opcional)


**Obtener productos paginados**
```
GET /api/producto?start=0&limit=5&category=Smartphones
```
query.start en 0 por defecto si no se define
query.limit en 5 por defecto si no se define
query.category trae todos los productos, de cualquier categoria si no se define

Header: x-token (Obligatorio)


**Obtener producto por ID**
```
GET /api/producto/:idProducto
```
Header: x-token (Obligatorio)


**Obtener producto por nombre, trae todas las coincidencias del nombre especificado**
```
GET /api/producto/buscar/:nameProducto
```
Header: x-token (Obligatorio)


**Actualizar producto `Solo el creador del producto puede actualizarlo o usuarios con role ADMIM`**
```
PUT /api/producto/:idProducto
```
Content-Type: application/x-www-form-urlencoded
Header: x-token (Obligatorio)
Body: name, price, category (Obligatorio) - description (Opcional)


**Eliminar producto `Solo el creador del producto puede eliminarlo o usuarios con role ADMIM`**
```
DELETE /api/producto/:idProducto
```
Header: x-token (Obligatorio)


**Actualizar imagen usuario `Solo el mismo usuario puede actualizar su imagen`**
```
PUT /api/upload/usuarios/:idUsuario
```
Content-Type: multipart/form-data
Header: x-token (Obligatorio)
Body: dataFile (Obligatorio)


**Actualizar imagen producto `Solo el mismo creador del producto puede actualizar su imagen`**
```
PUT /api/upload/productos/:idUsuario/:idProducto
```
Content-Type: multipart/form-data
Header: x-token (Obligatorio)
Body: dataFile (Obligatorio)


**Obtener imagen usuario `Solo el mismo usuario puede obtener su imagen`**
```
GET /api/imagen/usuario/:idUsuario?tkrs=TOKEN
```
query.tkrs con el token (Obligatorio)


**Obtener imagen producto `Solo el mismo creador del producto puede obtener su imagen`**
```
GET /api/imagen/producto/:idUsuario/:idProducto/?tkrs=TOKEN
```
query.tkrs con el token (Obligatorio)
