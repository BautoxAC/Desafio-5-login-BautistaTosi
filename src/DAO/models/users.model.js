import { Schema, model } from 'mongoose'

const schema = new Schema({
  userName: { type: String, required: true, max: 65, unique: true },
  userPassword: { type: String, required: true, max: 65 },
  isAdmin: Boolean,
})

export const userModel = model('users', schema)
