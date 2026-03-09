import { Request, Response } from "express";
import { ApiResponse } from "../../shared/utils/api-response";
import { AsyncHandler } from "../../shared/utils/async-handler";
import User from "../user/user.model";
import { LoginSchema, SignupSchema } from "./auth.schema";
import bcrypt from "bcrypt";
import { ApiError } from "../../shared/errors/api-error";
import { generateAccessToken } from "../../shared/utils/jwt";

const SALT_WORK_FACTOR = 10;

/**
 * Signup endpoint
 * POST /api/auth/signup
 */
export const signup = AsyncHandler(
  async (_req: Request, res: Response) => {

    const { name, email, password } = _req.body as SignupSchema;
    const hash = await bcrypt.hash(password, SALT_WORK_FACTOR);
    try {
      const user = await User.create({
        name,
        email,
        passwordHash: hash
      });

      return ApiResponse.Success(res, "Signup successfully", true);
    } catch (error) {
      throw ApiError.server("Signup failed");
    }
  }
);

/**
 * Login endpoint
 * POST /api/auth/login
 */
export const login = AsyncHandler(
  async (_req: Request, res: Response) => {
    const { email, password } = _req.body as LoginSchema;

    try {
      const user = await User.findOne({ email }, { passwordHash: 1 });
      if (!user) {
        throw ApiError.badRequest("Invalid email or password");
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        throw ApiError.badRequest("Invalid email or password");
      }

      const token = generateAccessToken({
        _id: user._id.toString()
      });

      return ApiResponse.Success(res, "Login successfully", {
        accessToken: token
      });
    } catch (error) {
      console.log("🔍 ~ AsyncHandler() callback ~ server/src/modules/auth/auth.controller.ts:61 ~ error:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.server("Login failed");
    }
  }
);
