import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// optional: connect to MongoDB if MONGO_URI provided
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB (ESM API)'))
    .catch((err) => console.error('MongoDB connection error:', err.message))
}

// simple routes
import pingRouter from './routes/ping.mjs'
import usersRouter from './routes/users.mjs'
import collegesRouter from './routes/colleges.mjs'
import collegeRouter from './routes/college.mjs'
import reviewsRouter from './routes/reviews.mjs'

app.use('/api/ping', pingRouter)
app.use('/api/users', usersRouter)
app.use('/api/colleges', collegesRouter)
app.use('/api/college', collegeRouter)
app.use('/api/reviews', reviewsRouter)

app.get('/', (req, res) => res.send('College Dekho ESM API'))

app.listen(PORT, () => console.log(`ESM API listening on port ${PORT}`))
