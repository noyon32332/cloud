import mongoose, { Schema, Document, Types } from 'mongoose'

export interface ITask extends Document {
  title: string
  description?: string
  assignedTo?: Types.ObjectId
  createdBy: Types.ObjectId
  workspace?: Types.ObjectId
  dueDate?: Date
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in-progress' | 'completed'
  createdAt: Date
  updatedAt: Date
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
    dueDate: { type: Date },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['todo', 'in-progress', 'completed'], default: 'todo' },
  },
  { timestamps: true }
)

export const Task = mongoose.model<ITask>('Task', TaskSchema)
