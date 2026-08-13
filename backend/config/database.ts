import mongoose from 'mongoose'

let isConnected = false

export async function connectDB(uri: string): Promise<void> {
  if (isConnected) {
    console.log('MongoDB is already connected')
    return
  }

  try {
    const conn = await mongoose.connect(uri)
    isConnected = true
    console.log(`MongoDB connected successfully: ${conn.connection.host}`)
  } catch (error) {
    isConnected = false
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`MongoDB connection failed: ${errorMessage}`)
    throw error
  }
}

export async function disconnectDB(): Promise<void> {
  if (!isConnected) return
  try {
    await mongoose.disconnect()
    isConnected = false
    console.log('MongoDB disconnected')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`MongoDB disconnection error: ${errorMessage}`)
  }
}

export function getConnectionStatus(): boolean {
  return isConnected
}
