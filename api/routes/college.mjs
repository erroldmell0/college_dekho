import express from 'express'
import College from '../models/College.mjs'

const router = express.Router()

// GET /api/college/:id - get college by id (singular route)
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

export default router
