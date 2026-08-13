import mongoose, { Schema, Document, Types } from 'mongoose'

export interface INotification extends Document {
  user: Types.ObjectId
  type: 'task' | 'assignment' | 'message' | 'deadline' | 'file' | 'workspace' | 'announcement'
  title: string
  message: string
  isRead: boolean
  createdAt: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['task', 'assignment', 'message', 'deadline', 'file', 'workspace', 'announcement'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema)
