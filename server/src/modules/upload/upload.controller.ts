import { NextFunction, Request, Response } from "express";

import { ApiResponse } from "../../shared/utils/api-response";
import { AsyncHandler } from "../../shared/utils/async-handler";
import {
  deleteFileFromCloudinary,
  uploadToCloudinary
} from "./upload.service";
import { ApiError } from "../../shared/errors/api-error";
import Asset from "./asset.model";
import { UserRequest } from "@/src/types/user";
import mongoose from "mongoose";

export const uploadFile = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as UserRequest).user?._id as string;
    if (!req.file) {
      return next(ApiError.badRequest("File is required"));
    }

    const file = await uploadToCloudinary(req.file.buffer, {
      folder: "uploads/files",
      resource_type: "auto"
    });

    const asset = await Asset.create({
      fileName: file.original_filename,
      url: file.secure_url,
      fileType: file.resource_type,
      fileSize: file.bytes,
      uploadedBy: new mongoose.Types.ObjectId(userId)
    });

    return ApiResponse.created(res, "File uploaded successfully", asset);
  }
);

export const uploadMultipleFile = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];
    const userId = (req as UserRequest).user?._id as string;

    if (!files || files.length === 0) {
      return next(ApiError.badRequest("Files are required"));
    }

    const results = await Promise.allSettled(
      files.map(async file => {
        return await uploadToCloudinary(file.buffer, {
          folder: "uploads/images"
        });
      })
    );

    const assets = await Asset.create(results.reduce((acc: any[], result) => {
      if (result.status === 'fulfilled') {
        const file = result.value
        acc.push({
          fileName: file.original_filename,
          url: file.secure_url,
          fileType: file.type,
          fileSize: file.bytes,
          uploadedBy: new mongoose.Types.ObjectId(userId)
        })
      }

      return acc 
    }, []) as Array<any>);

    return ApiResponse.created(res, "Files uploaded successfully", assets);
  }
);

export const deleteFile = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { public_id } = req.body;

    if (!public_id) {
      return next(ApiError.badRequest("File ID is required"));
    }

    await deleteFileFromCloudinary([public_id]);

    return ApiResponse.Success(res, "File deleted successfully", null, 200);
  }
);
