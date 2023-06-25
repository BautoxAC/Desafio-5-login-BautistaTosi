import express from 'express'
import { isUser, isAdmin } from '../middlewares/auth.js'
import { userModel } from '../DAO/models/users.model.js'
export const authRouter = express.Router()

authRouter.get('/login', (req, res) => {
  return res.render('login', {})
})

authRouter.post('/login', async (req, res) => {
  const { email, pass } = req.body
  if (!email || !pass) {
    return res.status(400).render('error', { error: 'ponga su email y pass' })
  }
  const usarioEncontrado = await userModel.findOne({ userName: email })
  if (email === 'adminCoder@coder.com' && pass === 'adminCod3r123') {
    req.session.email = email
    req.session.isAdmin = true
    return res.redirect('/products')
  }
  // eslint-disable-next-line eqeqeq
  if (usarioEncontrado && usarioEncontrado.userPassword == pass) {
    req.session.email = usarioEncontrado.userName
    req.session.isAdmin = usarioEncontrado.isAdmin
    return res.redirect('/products')
  }
  else {
    return res.status(401).render('error', { error: 'email o pass estan mal' })
  }
})

authRouter.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render('error', { error: 'no se pudo cerrar su session' })
    }
    return res.redirect('/auth/register')
  })
})

authRouter.get('/register', (req, res) => {
  return res.render('register', {})
})
authRouter.post('/register', async (req, res) => {
  const { email, pass } = req.body
  if (!email || !pass) {
    return res.status(400).render('error', { error: 'ponga correctamente los datos' })
  }
  try {
    if (email === 'adminCoder@coder.com' && pass === 'adminCod3r123') {
      req.session.email = email
      req.session.isAdmin = true
      return res.redirect('/products')
    }
    await userModel.create({ userName: email, userPassword: pass, isAdmin: false })
    req.session.email = email
    req.session.isAdmin = false
    return res.redirect('/products')
  }
  catch (e) {
    console.log(e)
    return res.status(400).render('error', { error: 'no se pudo crear el usuario. Intente con otro mail.' })
  }
})
authRouter.get('/perfil', isUser, (req, res) => {
  const user = { email: req.session.email, isAdmin: req.session.isAdmin }
  return res.render('perfil', { user })
})

authRouter.get('/administracion', isUser, isAdmin, (req, res) => {
  return res.send('datos super secretos clasificados sobre los perfiles registrados de la pagina')
})
