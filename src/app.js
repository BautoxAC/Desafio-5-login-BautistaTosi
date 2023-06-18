import express from "express"
import MongoStore from 'connect-mongo';
import handlebars from "express-handlebars"
import session from "express-session";
import path from "path"
import { cartsRouter } from "./routes/carts.router.js"
import { productViewRouter } from "./routes/productsView.router.js"
import { productsAPIRouter } from "./routes/productsAPI.router.js"
import { productsSocketRouter } from "./routes/productsSocketRouter.router.js"
import { authRouter } from "./routes/auth.router.js";
import { __dirname, connectMongo, connectSocketServer } from "./utils.js"
import { cartViewRouter } from "./routes/cartView.router.js"
import { chatRouter } from "./routes/chat.router.js"
const app = express()
const port = 8080

//CONFIG EXPRESS
app.use(express.static(path.join(__dirname, "/public")))
app.use(express.static(path.join(__dirname, "/public/assets")))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine("handlebars", handlebars.engine())
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "handlebars")
app.use(
    session({
        store: MongoStore.create({ mongoUrl: 'mongodb+srv://tosibautista:cp1xhHvnLrZzSDMQ@cluster0.so00fzx.mongodb.net/ecommerce', ttl: 7200 }),
        secret: 'un-re-secreto34255234534grtghretyy54',
        resave: true,
        saveUninitialized: true,
    })
)

//Rutes: API REST WITH JSON
app.use("/api/products", productsAPIRouter)
app.use("/api/carts", cartsRouter)

//Rutes: HTML
app.use("/products", productViewRouter)
app.use("/carts", cartViewRouter)
app.use("/auth", authRouter)

//Rutes: SOCKETS
app.use("/realtimeproducts", productsSocketRouter)
app.use("/chat", chatRouter)

const httpServer = app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})

// Execute SocketSever in Rute /realtimeserver

connectSocketServer(httpServer)

//Connect Mongo
connectMongo()

app.get("*", (req, res) => {
    return res.status(404).json({
        status: "error", msg: "no encontrado", data: ""
    })
})