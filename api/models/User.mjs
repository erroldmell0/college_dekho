import mongoose from 'mongoose'

const { Schema, model } = mongoose

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

const User = model('User', UserSchema)

export default User
