import express from "express"
export const productViewRouter = express.Router()
import { ProductManagerDB } from "../DAO/DB/ProductManagerDB.js"
import { isUser } from "../middlewares/auth.js"
const list = new ProductManagerDB()
productViewRouter.get('/', isUser, async function (req, res) {
    const url = "http://localhost:8080/products"
    const { limit, page, query, sort } = req.query
    const { email, isAdmin } = req.session
    const pageInfo = await list.getProducts(limit, page, query, sort, url)
    return res.status(200).render("products", { ...pageInfo, email, isAdmin })
})
productViewRouter.get('/:pid', async function (req, res) {
    const productId = req.params.pid
    const detailsProduct = await list.getProductById(productId)
    return res.status(200).render("details", { detailsProduct: detailsProduct.data })
})