import express from 'express'
import { check, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.mjs'

const router = express.Router()

// GET /api/users - list users (no passwords returned)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('name email')
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// POST /api/users/signup - validation and persist to MongoDB
router.post(
  '/signup',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6+ characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { name, email, password } = req.body
    try {
      let user = await User.findOne({ email })
      if (user) return res.status(400).json({ message: 'User already exists' })

      const salt = await bcrypt.genSalt(10)
      const hashed = await bcrypt.hash(password, salt)

      user = new User({ name, email, password: hashed })
      await user.save()

      const payload = { user: { id: user.id } }
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' })
      res.status(201).json({ id: user.id, name: user.name, email: user.email, token })
    } catch (err) {
      console.error(err)
      res.status(500).send('Server error')
    }
  }
)

// POST /api/users/login
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { email, password } = req.body
    try {
      const user = await User.findOne({ email })
      if (!user) return res.status(400).json({ message: 'Invalid credentials' })

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

      const payload = { user: { id: user.id } }
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' })
      res.json({ token, id: user.id, name: user.name, email: user.email })
    } catch (err) {
      console.error(err)
      res.status(500).send('Server error')
    }
  }
)

export default router
