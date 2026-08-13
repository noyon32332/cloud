import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IWorkspace extends Document {
  name: string
  description?: string
  owner: Types.ObjectId
  members: Types.ObjectId[]
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

const WorkspaceSchema = new Schema<IWorkspace>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    avatar: { type: String },
  },
  { timestamps: true }
)

export const Workspace = mongoose.model<IWorkspace>('Workspace', WorkspaceSchema)
