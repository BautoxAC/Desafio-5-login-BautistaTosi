import multer from 'multer'
import { Server } from 'socket.io'
import { CartManagerDB } from './DAO/DB/CartManagerDB.js'
import { MessageManagerDB } from './DAO/DB/MessageManagerDB.js'
import { ProductManagerDB } from './DAO/DB/ProductManagerDB.js'
import { cartModel } from './DAO/models/carts.model.js'
import 'dotenv/config'

// ----------------DIRNAME------------
import path from 'path'
import { fileURLToPath } from 'url'
// -------------MONGO------------------
import { connect } from 'mongoose'
// ------------MULTER------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/public/assets')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

export const uploader = multer({ storage })
export const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)

// -------------Mensaje de status---------------------------
export function newMessage(status, message, data) {
  return { status, message, data }
}

// --------------Socket Server---------------------------
export function connectSocketServer(httpServer) {
  const socketServer = new Server(httpServer)
  socketServer.on('connection', async (socket) => {
    console.log('cliente conectado')
    // vista /chat
    const MessageManager = new MessageManagerDB()
    const list = new ProductManagerDB()
    const CartManager = new CartManagerDB()

    socket.on('new_message_front_to_back', async (message, userName) => {
      try {
        await MessageManager.addMessage(message, userName)
        const messages = await MessageManager.getMessages()
        socket.emit('message_created_back_to_front', newMessage(true, 'message created', messages))
      }
      catch (e) {
        console.log(e)
        socket.emit('message_created_back_to_front', newMessage(false, 'an error ocurred', ''))
      }
    })
    socket.on('msg_front_to_back', async (data) => {
      try {
        const { title, description, price, thumbnails, code, stock } = data.data
        socket.emit('newProduct_to_front', await list.addProduct(title, description, price, thumbnails, code, stock), await list.getProducts())
      }
      catch (e) {
        console.log(e)
        socket.emit('newProduct_to_front', { status: 'failure', message: 'something went wrong :(', data: {} })
      }
    })
    socket.emit('msg_back_to_front_products', await list.getProducts())
    socket.on('msg_front_to_back_delete_product', async (product) => {
      await list.deleteProduct(product._id)
      socket.emit('msg_front_to_back_deleted', await list.getProducts())
    })
    // vista /products
    socket.on('add_product_to_cart_front_to_back', async (idProduct) => {
      const { _id } = await cartModel.findOne({})
      const { status } = await CartManager.addProduct(_id, idProduct)
      socket.emit('add_product_to_cart_back_to_front', { status, cartId: _id })
    })
  })
}
export async function connectMongo() {
  try {
    await connect(`${process.env.MONGO_LINK}`)
  }
  catch (e) {
    console.log(e)
    throw new Error('can not connect to the db')
  }
}
