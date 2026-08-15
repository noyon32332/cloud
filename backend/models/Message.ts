import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IMessage extends Document {
  sender: Types.ObjectId
  receiver?: Types.ObjectId
  workspace?: Types.ObjectId
  content: string
  readBy: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User' },
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
    content: { type: String, required: true, trim: true },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
)

export const Message = mongoose.model<IMessage>('Message', MessageSchema)
