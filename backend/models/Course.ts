import mongoose, { Schema, Document, Types } from 'mongoose'

export interface ICourse extends Document {
  title: string
  courseCode: string
  description?: string
  teacher: Types.ObjectId
  students: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    courseCode: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
)

export const Course = mongoose.model<ICourse>('Course', CourseSchema)
