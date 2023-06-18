# Explicación

Este proyecto es un API básica que sigue las consignas de la segunda preEntrega del proyecto final de CoderHouse funcionando con MongoDB y hay views hechas con handlebars. Para que funcione hace falta poner este link en MongoDB Compass [mongodb+srv://tosibautista:cp1xhHvnLrZzSDMQ@cluster0.so00fzx.mongodb.net/ecommerce]

### Link de postman (donde estan se encuentran los endpoints del API)

[https://documenter.getpostman.com/view/27127572/2s93eYTrfS]

## Views de HandleBars
/chat es un chat que funciona con socket y tienes que iniciar sesion para usarlo

/realtimeproducts con socket

/products es una vista de los productos con paginacion que puede recibir por query de la url: limit, sort, category y page

/cart/:cid donde le pones el id del carrito y se renderizan los que tiene

## Dependencias

Este proyecto utiliza las dependencias de Express para hacer un servidor local, Multer para la subida de imagenes a la carpeta public y uuid para la creación de ids de productos y carritos.

Documentación de las Dependecias:
1. Express: [https://expressjs.com/es/]
2. Multer: [https://github.com/expressjs/multer#readme]
3. uuid: [https://github.com/uuidjs/uuid#readme]
4. socket.io: [https://socket.io/docs/v4/]
5. express-handlebars: [https://www.npmjs.com/package/express-handlebars]
6. Mongoose: [https://mongoosejs.com]
7. mongoose-paginate-v2: [https://github.com/aravindnc/mongoose-paginate-v2]

### `npm start`

Inicia el Servidor en [http://localhost:8080]

