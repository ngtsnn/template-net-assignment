import mongoose, { Document, Model, Schema } from "mongoose";

export interface IChat extends Document {
  _id: mongoose.Types.ObjectId;
  threadId: mongoose.Types.ObjectId;
  role: "user" | "assistant" | "system", // "user", "assistant", or "system"
  content: string,
  attachments: Array<{
    type: string;
    url: string;
  }>,
  createdAt: Date,
  updatedAt: Date,
}

const chatSchema = new Schema<IChat>(
  {
    threadId: {
      type: mongoose.Types.ObjectId,
      ref: "Thread",
      required: [true, "Thread ID is required"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
      enum: ["user", "assistant", "system"]
    },
    attachments: {
      type: [String],
      default: []
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Chat: Model<IChat> = mongoose.model<IChat>("Chat", chatSchema);
export default Chat;
