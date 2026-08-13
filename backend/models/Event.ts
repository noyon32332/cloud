import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IEvent extends Document {
  title: string
  description?: string
  type: 'class' | 'assignment' | 'meeting' | 'presentation' | 'exam' | 'deadline'
  startDate: Date
  endDate: Date
  createdBy: Types.ObjectId
  workspace?: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    type: {
      type: String,
      enum: ['class', 'assignment', 'meeting', 'presentation', 'exam', 'deadline'],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
  },
  { timestamps: true }
)

export const Event = mongoose.model<IEvent>('Event', EventSchema)
