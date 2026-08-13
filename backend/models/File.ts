import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IFile extends Document {
  name: string
  originalName: string
  url: string
  s3Key?: string
  size: number
  mimeType: string
  uploadedBy: Types.ObjectId
  workspace?: Types.ObjectId
  folderId?: Types.ObjectId
  sharedWith: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const FileSchema = new Schema<IFile>(
  {
    name: { type: String, required: true, trim: true },
    originalName: { type: String, required: true },
    url: { type: String, required: true },
    s3Key: { type: String },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
    folderId: { type: Schema.Types.ObjectId, ref: 'Folder' },
    sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
)

export const File = mongoose.model<IFile>('File', FileSchema)
