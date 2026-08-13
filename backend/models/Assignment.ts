import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IAssignment extends Document {
  title: string
  description?: string
  course: Types.ObjectId
  createdBy: Types.ObjectId
  deadline: Date
  resources?: string[]
  submissions: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    deadline: { type: Date, required: true },
    resources: [{ type: String }],
    submissions: [{ type: Schema.Types.ObjectId, ref: 'Submission' }],
  },
  { timestamps: true }
)

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema)
