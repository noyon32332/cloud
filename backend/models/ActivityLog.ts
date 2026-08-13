import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IActivityLog extends Document {
  user: Types.ObjectId
  action: string
  description?: string
  entityType?: string
  entityId?: Types.ObjectId
  createdAt: Date
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    description: { type: String },
    entityType: { type: String },
    entityId: { type: Schema.Types.ObjectId },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema)
