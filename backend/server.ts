import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/database'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'

// Routes
import healthRoutes from './routes/healthRoutes'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import courseRoutes from './routes/courseRoutes'
import workspaceRoutes from './routes/workspaceRoutes'
import taskRoutes from './routes/taskRoutes'
import assignmentRoutes from './routes/assignmentRoutes'
import fileRoutes from './routes/fileRoutes'
import messageRoutes from './routes/messageRoutes'
import notificationRoutes from './routes/notificationRoutes'
import eventRoutes from './routes/eventRoutes'
import activityRoutes from './routes/activityRoutes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
)

// API Routes
app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/workspaces', workspaceRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/assignments', assignmentRoutes)
app.use('/api/files', fileRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/activity', activityRoutes)

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

// Start server
async function startServer(): Promise<void> {
  try {
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      console.error('MONGODB_URI is not defined in environment variables')
      process.exit(1)
    }

    await connectDB(mongoUri)

    app.listen(PORT, () => {
      console.log(`StudySphere backend running on http://localhost:${PORT}`)
      console.log(`API health check: http://localhost:${PORT}/api/health`)
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Failed to start server: ${errorMessage}`)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...')
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('Shutting down server...')
  process.exit(0)
})

void startServer()

export default app
