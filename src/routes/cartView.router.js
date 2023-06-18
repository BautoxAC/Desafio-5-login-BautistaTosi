import express from "express"
import { CartManagerDB } from "../DAO/DB/CartManagerDB.js"
export const cartViewRouter = express.Router()
const list = new CartManagerDB()
cartViewRouter.get("/:cid", async (req, res) => {
    const Id = req.params.cid
    const cart = await list.getCartById(Id)
    return res.render("cart", { cart: cart.data })
})