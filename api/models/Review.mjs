import mongoose from 'mongoose'

const { Schema, model, Types } = mongoose

const ReviewSchema = new Schema({
  college: { type: Types.ObjectId, ref: 'College', required: true },
  collegeName: { type: String },
  user: { type: Types.ObjectId, ref: 'User' },
  studentName: { type: String },
  course: { type: String },
  year: { type: Number },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String },
  review: { type: String },
  createdAt: { type: Date, default: Date.now },
})

const Review = model('Review', ReviewSchema)

export default Review
