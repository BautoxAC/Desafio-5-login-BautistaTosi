import { Productmodel } from "../models/products.model.js";
import { newMessage } from "../../utils.js";
export class ProductManagerDB {
    async addProduct(title, description, price, thumbnails, code, stock) {
        try {
            let product = { title, description, price: Number(price), thumbnails: thumbnails !== undefined && [thumbnails], code, stock: Number(stock) }
            let addPro = true
            const productValues = Object.values(product)
            for (const prop of productValues) {
                if (!prop) {
                    addPro = false
                    break
                }
            }
            const products = await this.getProducts()
            let codeVerificator = products.payload.find((product) => product.code === code)
            if (codeVerificator) {
                return newMessage("failure", "Error, the code is repeated", "")
            } else if (!addPro) {
                return newMessage("failure", "Error, data is incomplete please provide more data and the stock and the price must be numbers", "")
            } else {
                await Productmodel.create(product)
                const lastAdded = await Productmodel.findOne({}).sort({ _id: -1 }).lean()
                return newMessage("success", "Product added successfully", lastAdded)
            }
        } catch (e) {
            console.log(e)
            return newMessage("failure", "A problem ocurred", "")
        }
    }
    async updateProduct(id, propsReceivedToUpdate) {
        try {
            let productToUpdate = await this.getProductById(id)
            productToUpdate = productToUpdate.data
            const entriesRecieved = Object.entries(propsReceivedToUpdate)
            const valuesToUpdate = Object.keys(productToUpdate)
            const dataTypes = Object.entries(productToUpdate).map((prop) => ({ key: prop[0], type: prop[0] === "thumbnails" ? "string" : typeof (prop[1]) }))
            const messages = []
            if (!productToUpdate || Array.isArray(propsReceivedToUpdate)) {
                return newMessage("failure", "The product was not found or the data is an Array", "")
            }
            const propToUpdateFound = entriesRecieved.map((entry) => {
                const status = valuesToUpdate.some((propUpdate) => entry[0] === propUpdate && entry[0] !== "id" && entry[0] !== "status")
                return { entries: { key: entry[0], value: entry[1] }, status: status, type: typeof (entry[1]) }
            })
            for (let i = 0; i < propToUpdateFound.length; i++) {
                const prop = propToUpdateFound[i]
                const sameTypeAndKey = dataTypes.find((type) => type.type === prop.type && type.key === prop.entries.key)
                const sameKey = dataTypes.find(type => type.key === prop.entries.key)
                if (prop.status && sameTypeAndKey) {
                    if (prop.entries.key === "thumbnails") {
                        const thumbnailRepeated = productToUpdate.thumbnails.some(thumbnail => thumbnail === prop.entries.value)
                        thumbnailRepeated ? messages.push(` The prop Number: ${i + 1} (${prop.entries.key}) has a value repeated`) : productToUpdate.thumbnails.push(prop.entries.value)
                    } else {
                        productToUpdate[prop.entries.key] = prop.entries.value
                    }
                } else {
                    messages.push(` The prop Number: ${i + 1} (${prop.entries.key}) was provided incorrectly`)
                    prop.status ? messages.push(`Must be ${sameKey?.type}`) : messages.push("The prop must be title, description, price, thumbnails, code or stock")
                }
            }
            await Productmodel.updateOne({ _id: productToUpdate._id.toString() }, productToUpdate)
            return newMessage("success", "Updated successfully" + (messages).toString(), productToUpdate)
        } catch (e) {
            console.log(e)
            return newMessage("failure", "A problem ocurred", "")
        }

    }
    async getProducts(limit, page, query, sort,url) {
        const res = (status, payload, restPaginate) => {
            let prevLink = `${url}?limit=${limit || ""}&category=${query || ""}&sort=${sort || ""}&page=`
            let nextLink = `${url}?limit=${limit || ""}&category=${query || ""}&sort=${sort || ""}&page=`
            restPaginate.hasPrevPage ? prevLink += restPaginate.prevPage : prevLink = null 
            restPaginate.hasNextPage ? nextLink += restPaginate.nextPage : nextLink = null 
            return {
                status: status, payload: payload, prevLink: prevLink, nextLink: nextLink, totalPages: restPaginate.totalPages, prevPage: restPaginate.prevPage, nextPage: restPaginate.nextPage, page: restPaginate.page, hasPrevPage: restPaginate.hasPrevPage, hasNextPage: restPaginate.hasNextPage
            }
        }
        try {
            const { docs, ...rest } = await Productmodel.paginate({ [query && "category"]: query }, { limit: limit || 10, page: page || 1, sort: { price: sort || null }, lean: true })
            return res("success", docs, rest)
        } catch (e) {
            console.log(e)
            return res("error", {}, {})
        }
    }
    async getProductById(id) {
        try {
            let productFindId = await Productmodel.findOne({ _id: id }).lean()
            if (productFindId) {
                return newMessage("success", "Found successfully", productFindId)
            } else {
                return newMessage("failure", "Not Found", "")
            }
        } catch (e) {
            console.log(e)
            return newMessage("failure", "A problem ocurred", "")
        }
    }
    async deleteProduct(id) {
        try {
            const productToDelete = await Productmodel.deleteOne({ _id: id })
            return newMessage("success", "Deleted successfully", productToDelete)
        } catch (e) {
            console.log(e)
            return newMessage("failure", "A problem ocurred", "")
        }
    }
}
