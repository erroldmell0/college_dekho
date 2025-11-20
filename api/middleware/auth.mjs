import jwt from 'jsonwebtoken'

export default function auth(req, res, next) {
  const authHeader = req.header('authorization') || ''
  const token = authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret')
    req.user = decoded.user
    next()
  } catch (err) {
    console.error('Token error', err.message)
    res.status(401).json({ message: 'Token is not valid' })
  }
}
