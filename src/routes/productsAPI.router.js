import express from "express"
import { ProductManagerDB } from "../DAO/DB/ProductManagerDB.js"
import { newMessage, uploader } from "../utils.js"
export const productsAPIRouter = express.Router()
const list = new ProductManagerDB()

productsAPIRouter.get("/", async (req, res) => {
    const { limit, page, query, sort } = req.query
    const url="http://localhost:8080/api/products"
    return res.status(200).json(await list.getProducts(limit, page, query, sort,url))
})

productsAPIRouter.get("/:pid", async (req, res) => {
    const Id = req.params.pid
    return res.status(200).json(newMessage("success", "producto por id", await list.getProductById(Id)))
})

productsAPIRouter.put("/:pid", async (req, res) => {
    const Id = req.params.pid
    const productPropsToUpdate = req.body
    return res.status(200).json(newMessage(await list.updateProduct(Id, productPropsToUpdate)))
})

productsAPIRouter.delete("/:pid", async (req, res) => {
    const Id = req.params.pid
    return res.status(200).json(await list.deleteProduct(Id))
})
productsAPIRouter.post("/", uploader.single("file"), async (req, res) => {
    res.redirect("/realtimeproducts")
})