import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "../user/user.model";

export interface IThread extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  fileIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const threadSchema = new Schema<IThread>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    fileIds: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Thread: Model<IThread> = mongoose.model<IThread>("Thread", threadSchema);
export default Thread;
