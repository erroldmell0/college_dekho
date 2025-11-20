import mongoose from 'mongoose'

const { Schema, model } = mongoose

const CollegeSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

const College = model('College', CollegeSchema)

export default College
