import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IFolder extends Document {
  name: string
  owner: Types.ObjectId
  parentFolder?: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const FolderSchema = new Schema<IFolder>(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    parentFolder: { type: Schema.Types.ObjectId, ref: 'Folder' },
  },
  { timestamps: true }
)

export const Folder = mongoose.model<IFolder>('Folder', FolderSchema)
