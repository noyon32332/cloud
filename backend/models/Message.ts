import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IMessage extends Document {
  sender: Types.ObjectId
  receiver?: Types.ObjectId
  workspace?: Types.ObjectId
  message: string
  attachments?: string[]
  createdAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User' },
    workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
    message: { type: String, required: true },
    attachments: [{ type: String }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

export const Message = mongoose.model<IMessage>('Message', MessageSchema)
