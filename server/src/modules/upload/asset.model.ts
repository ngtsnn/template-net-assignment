import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "../user/user.model";

export interface IAsset extends Document {
  _id: mongoose.Types.ObjectId;
  fileName: string;
  fileType: string;
  url: string;
  isIndexed: boolean;
  fileSize: number;
  uploadedBy: IUser;

  createdAt: Date;
  updatedAt: Date;
}

const assetSchema = new Schema<IAsset>(
  { 
    fileName: {
      type: String,
      required: [true, "File name is required"],
      trim: true
    },
    url: {
      type: String,
      required: [true, "URL is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    isIndexed: {
      type: Boolean,
      default: false
    },
    fileSize: {
      type: Number,
      required: [true, "File size is required"],
    },
    fileType: {
      type: String,
      required: [true, "File type is required"]
    }, 
    uploadedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Uploaded by is required"],
    }
  },
  {
    timestamps: true
  }
);

const Asset: Model<IAsset> = mongoose.model<IAsset>("Asset", assetSchema);
export default Asset;
