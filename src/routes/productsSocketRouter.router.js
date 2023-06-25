import express from 'express'
import { ProductManagerDB } from '../DAO/DB/ProductManagerDB.js'
export const productsSocketRouter = express.Router()
productsSocketRouter.get('/', async function(req, res) {
  const list = new ProductManagerDB()
  const products = await list.getProducts()
  return res.status(200).render('realTimeProducts', { products })
})
