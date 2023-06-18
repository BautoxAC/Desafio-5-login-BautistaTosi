import { cartModel } from "../models/carts.model.js";
import { newMessage } from "../../utils.js";
import { Productmodel } from "../models/products.model.js";
import { ProductManagerDB } from "./ProductManagerDB.js";
export class CartManagerDB {
    async getCartById(id) {
        try {
            let cartFindId = await cartModel.findOne({ _id: id }).populate("products.idProduct").lean()
            if (cartFindId) {
                return newMessage("success", "Found successfully", cartFindId.products)
            } else {
                return newMessage("failure", "Cart not Found", "")
            }
        } catch (e) {
            console.log(e)
            return newMessage("failure", "A problem ocurred", "")
        }
    }
    async addCart() {
        try {
            await cartModel.create({ products: [] })
            const lastAdded = await cartModel.findOne({}).sort({ _id: -1 }).lean()
            return newMessage("success", "cart added successfully", lastAdded)
        } catch (e) {
            console.log(e)
            return newMessage("failure", "A problem ocurred", "")
        }
    }
    async addProduct(idCart, idProduct) {
        try {
            const listProducts = new ProductManagerDB()
            let cart = await cartModel.findOne({ _id: idCart }).lean()
            if (!cart) {
                return newMessage("failure", "cart not found", "")
            }
            let product = await listProducts.getProductById(idProduct)
            product = product.data
            if (!product) {
                return newMessage("failure", "product not found", "")
            }
            const productRepeated = cart.products.find(pro => pro.idProduct.toString() === product._id.toString())
            let messageReturn = {}
            if (productRepeated) {
                const positionProductRepeated = cart.products.indexOf(productRepeated)
                if (cart.products[positionProductRepeated].quantity < product.stock) {
                    cart.products[positionProductRepeated].quantity++
                    messageReturn = newMessage("success", "Product repeated: quantity added correctly", cart)
                } else {
                    messageReturn = newMessage("failure", "Product repeated: quantity is iqual to the stock", cart)
                }
            } else {
                cart.products.push({ idProduct: product._id, quantity: 1 })
                messageReturn = newMessage("success", "Product added correctly", cart)
            }
            await cartModel.updateOne({ _id: cart._id }, cart)
            return messageReturn
        } catch (e) {
            console.log(e)
            return newMessage("failure", "A problem ocurred", "")
        }
    }
    async deleteProduct(idCart, idProduct) {
        try {
            const cartFindId = await cartModel.findOne({ _id: idCart }).lean()
            const cartProducts = cartFindId.products
            const positionProduct = cartFindId.products.indexOf(cartFindId.products.find(pro => pro.idProduct === idProduct))
            cartProducts.splice(positionProduct, 1)
            await cartModel.updateOne({ _id: cartFindId._id }, cartFindId)
            return newMessage("success", "product deleted", cartFindId)
        } catch (e) {
            console.log(e)
            return newMessage("failure", "A problem ocurred", "")
        }
    }
    async addNewProducts(idCart, products) {
        try {
            if (!Array.isArray(products) && products.length === 0) {
                throw new Error(`You must pass an array and at least one product`)
            }
            for (const product of products) {
                const productExist = await Productmodel.findOne({ _id: product.idProduct })
                if (!productExist) {
                    throw new Error(`The product with the id (${product.idProduct}) does not exist`)
                }
                const idRepeated = products.filter(pro => pro.idProduct === product.idProduct)
                if (idRepeated.length === 2) { throw new Error(`The product with the id (${product.idProduct}) is repeated in the array you passed`) }
            }
            const cartFindId = await cartModel.findOne({ _id: idCart }).lean()
            cartFindId.products = products
            await cartModel.updateOne({ _id: cartFindId._id }, cartFindId)
            return newMessage("success", "products updated", cartFindId)
        } catch (e) {
            console.log(e)
            return newMessage("failure", "A problem ocurred", "")
        }
    }
    async deleteAllProducts(idCart) {
        try {
            const cartFindId = await cartModel.findOne({ _id: idCart }).lean()
            cartFindId.products = []
            await cartModel.updateOne({ _id: cartFindId._id }, cartFindId)
            return newMessage("success", "products emptied", cartFindId)
        } catch (e) {
            console.log(e)
            return newMessage("failure", "A problem ocurred", "")
        }
    }
    async updateQuantityProduct(idCart, idProduct, quantity) {
        try {
            const quantityNumber = Object.values(quantity)
            if (typeof (quantityNumber[0]) !== "number") { return newMessage("failure", "the quantity must be a number", "") }
            const cartFindId = await cartModel.findOne({ _id: idCart }).lean()
            const cartProducts = cartFindId.products
            const productToUpdate = cartProducts.find(pro => pro.idProduct === idProduct)
            if (!productToUpdate) { return newMessage("failure", "the product was not found inside the cart", "") }
            productToUpdate.quantity = quantityNumber[0]
            await cartModel.updateOne({ _id: cartFindId._id }, cartFindId)
            return newMessage("success", "the quantity of product was updated", cartFindId)
        } catch (e) {
            console.log(e)
            return newMessage("failure", "A problem ocurred", "")
        }
    }
}