import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: 'student' | 'teacher' | 'admin'
  profileImage?: string
  department?: string
  studentId?: string
  teacherId?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
    profileImage: { type: String },
    department: { type: String },
    studentId: { type: String },
    teacherId: { type: String },
  },
  { timestamps: true }
)

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const obj = ret as unknown as Record<string, unknown>
    delete obj.password
    return obj
  },
})

export const User = mongoose.model<IUser>('User', UserSchema)
