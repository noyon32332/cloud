import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'

// Routes
import healthRoutes from './routes/healthRoutes'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  })
)

// API Routes
app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

// Start server
function startServer(): void {
  try {
    app.listen(PORT, () => {
      console.log(`StudySphere backend running on http://localhost:${PORT}`)
      console.log(`Firebase Authentication & Firestore Integration Active`)
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Failed to start server: ${errorMessage}`)
    process.exit(1)
  }
}

void startServer()

export default app
