import { Request, Response } from "express";
import { ApiResponse } from "../../shared/utils/api-response";
import { AsyncHandler } from "../../shared/utils/async-handler";
import { ApiError } from "../../shared/errors/api-error";
import { UserRequest } from "@/src/types/user";
import Thread from "./thread.model";
import mongoose from "mongoose";
import { env } from "../../shared/configs/env";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import Chat from "../chats/chat.model";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: env.AI_API_KEY,
});


/**
 * Get threads
 * GET /api/threads
 */
export const getThreads = AsyncHandler(
  async (_req: Request, res: Response) => {
    const userId = (_req as UserRequest).user?._id;

    try {
      const threads = await Thread.find({ userId });

      if (!threads) {
        throw ApiError.notFound("Threads not found");
      }

      return ApiResponse.Success(res, "Get threads successfully", threads);
    } catch (error) {

      if (error instanceof ApiError) {
        throw error;
      }

      throw ApiError.server("Get threads failed");
    }
  }
);

/**
 * Create thread
 * POST /api/threads
 */
export const newThread = AsyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as UserRequest).user?._id;
    const { content, attachments } = req.body;

    if (!userId) {
      throw ApiError.unauthorized("Unauthorized");
    }

    if (!content) {
      throw ApiError.badRequest("Message content is required");
    }

    try {
      // 1. Generate a short title using a fast model based on the initial message
      const { text: generatedTitle } = await generateText({
        model: groq("llama-3.1-8b-instant"),
        prompt: `Generate a very short, concise title (max 5 words) for a chat thread starting with this message. Do not include quotes or labels, just the title itself: "${content.substring(0, 500)}"`,
      });

      // 2. Create the Thread
      const thread = await Thread.create({
        userId: new mongoose.Types.ObjectId(userId as string),
        title: generatedTitle.trim() || "New Chat",
      });

      // 4. Format initial message for AI
      const contentParts: any[] = [{ type: "text", text: content }];
      if (attachments && attachments.length > 0) {
        for (const attachment of attachments) {
          contentParts.push({
            type: "file",
            data: new URL(attachment.url),
            mediaType: attachment.type,
          });
        }
      }

      const coreMessages: any[] = [
        {
          role: "user",
          content: contentParts,
        },
      ];

      // 5. Generate AI response
      const { text: aiResponseText } = await generateText({
        model: groq("openai/gpt-oss-120b"),
        messages: coreMessages,
      });

      // 6. Save AI response
      const assistantMessage = await Chat.create([{
        threadId: thread._id,
        role: "user",
        content,
        attachments: attachments || [],
      }, {
        threadId: thread._id,
        role: "assistant",
        content: aiResponseText,
        attachments: [],
      }]);

      // 7. Return thread and generated message
      return ApiResponse.Success(res, "Thread created successfully", {
        thread,
        message: assistantMessage,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.server("Create thread failed");
    }
  }
);

/**
 * Get thread messages
 * GET /api/threads/:threadId/messages
 */
export const getThreadMessages = AsyncHandler(
  async (req: Request, res: Response) => {
    const threadId = req.params.threadId;
    try {
      const messages = await Chat.find({ threadId: threadId });

      if (!messages) {
        throw ApiError.notFound("Messages not found");
      }

      return ApiResponse.Success(res, "Get thread messages successfully", messages);
    } catch (error) {

      if (error instanceof ApiError) {
        throw error;
      }

      throw ApiError.server("Get thread messages failed");
    }
  }
);

/**
 * Create message
 * POST /api/threads/:threadId/messages
 */
export const newMessage = AsyncHandler(
  async (req: Request, res: Response) => {
    const threadId = req.params.threadId;
    const { content, attachments } = req.body;

    if (!content) {
      throw ApiError.badRequest("Message content is required");
    }

    try {
      // Validate thread existence
      const thread = await Thread.findById(threadId);
      if (!thread) {
        throw ApiError.notFound("Thread not found");
      }

      // Retrieve full message history
      const history = await Chat.find({ threadId }).sort({ createdAt: 1 });

      // Format history to CoreMessage array
      const coreMessages: any[] = history.map((msg) => {
        if (msg.role === "user" && msg.attachments && msg.attachments.length > 0) {
          const contentParts: any[] = [{ type: "text", text: msg.content }];
          for (const attachment of msg.attachments) {
            contentParts.push({
              type: 'image',
              data: new URL(attachment.url),
              // mediaType: attachment.type,
            });
          }
          return {
            role: "user",
            content: contentParts
          };
        }

        return {
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content
        };
      });

      // Generate AI response
      const { text } = await generateText({
        model: groq("openai/gpt-oss-120b"),
        messages: coreMessages,
      });

      // Save AI response
      const assistantMessage = await Chat.create({
        threadId: new mongoose.Types.ObjectId(threadId as string),
        role: "user",
        content,
        attachments: attachments || []
      }, {
        threadId: new mongoose.Types.ObjectId(threadId as string),
        role: "assistant",
        content: text,
        attachments: []
      });

      return ApiResponse.Success(res, "Message generated successfully", {
        message: assistantMessage
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw ApiError.server("Create message failed");
    }
  }
);
