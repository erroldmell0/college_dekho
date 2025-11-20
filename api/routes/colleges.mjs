import express from 'express'
import { check, validationResult } from 'express-validator'
import College from '../models/College.mjs'

const router = express.Router()

// GET /api/colleges - list colleges
router.get('/', async (req, res) => {
  try {
    const colleges = await College.find().sort({ createdAt: -1 }).limit(100)
    res.json(colleges)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// GET /api/colleges/:id - get details
router.get('/:id', async (req, res) => {
  try {
    const college = await College.findById(req.params.id)
    if (!college) return res.status(404).json({ message: 'College not found' })
    res.json(college)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// POST /api/colleges - create (no auth for now)
router.post(
  '/',
  [check('name', 'Name is required').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    try {
      const { name, location, description, rating } = req.body
      const college = new College({ name, location, description, rating })
      await college.save()
      res.status(201).json(college)
    } catch (err) {
      console.error(err)
      res.status(500).send('Server error')
    }
  }
)

export default router
