import { Request, Response } from "express";
import { ApiResponse } from "../../shared/utils/api-response";
import { AsyncHandler } from "../../shared/utils/async-handler";
import User from "../user/user.model";
import { ApiError } from "../../shared/errors/api-error";
import { UserRequest } from "@/src/types/user";

const SALT_WORK_FACTOR = 10;

/**
 * Get user profile
 * GET /api/user/profile
 */
export const getProfile = AsyncHandler(
  async (_req: Request, res: Response) => {
    const userId = (_req as UserRequest).user?._id;

    try {
      const user = await User.findById(userId, { passwordHash: 0, __v: 0 }, { lean: true });

      if (!user) {
        throw ApiError.notFound("User not found");
      }

      return ApiResponse.Success(res, "Get profile successfully", user);
    } catch (error) {

      if (error instanceof ApiError) {
        throw error;
      }

      throw ApiError.server("Get profile failed");
    }
  }
);