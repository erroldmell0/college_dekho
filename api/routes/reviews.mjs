import express from 'express'
import { check, validationResult } from 'express-validator'
import Review from '../models/Review.mjs'
import College from '../models/College.mjs'
import auth from '../middleware/auth.mjs'

const router = express.Router()

// POST /api/reviews - create a review (authenticated)
router.post(
  '/',
  auth,
  [
    check('collegeId', 'collegeId is required').notEmpty(),
    check('rating', 'Rating 1-5 is required').isInt({ min: 1, max: 5 }),
    check('title', 'Title is required').notEmpty(),
    check('review', 'Review text is required').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    try {
      const { collegeId, collegeName, course, year, rating, title, review } = req.body

      const college = await College.findById(collegeId)
      if (!college) return res.status(404).json({ message: 'College not found' })

      const newReview = new Review({
        college: college._id,
        collegeName: collegeName || college.name,
        user: req.user && req.user.id ? req.user.id : undefined,
        studentName: req.body.studentName || undefined,
        course,
        year,
        rating,
        title,
        review,
      })

      const saved = await newReview.save()

      // update college average rating
      try {
        const stats = await Review.aggregate([
          { $match: { college: college._id } },
          { $group: { _id: '$college', avgRating: { $avg: '$rating' } } },
        ])
        const avg = stats && stats[0] ? stats[0].avgRating : rating
        college.rating = avg
        await college.save()
      } catch (err) {
        console.warn('Failed to update college rating', err.message)
      }

      res.status(201).json(saved)
    } catch (err) {
      console.error(err)
      res.status(500).send('Server error')
    }
  }
)

// GET /api/reviews/college/:id - list reviews for a college
router.get('/college/:id', async (req, res) => {
  try {
    const reviews = await Review.find({ college: req.params.id }).sort({ createdAt: -1 }).limit(200)
    res.json(reviews)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

export default router
