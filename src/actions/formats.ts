"use server";

import { db } from "@/server/db";
import { postFormats } from "@/server/db/schema";
import { getUserId } from "./user";
import { eq, is, isNull } from "drizzle-orm";

// Define the PostFormat type
export type PostFormat = {
  id: string;
  userId: string | null;
  templates: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
};

// Define common result type
type Result<T = void> = {
  success: boolean;
  message: string;
  data?: T;
};

// Define the return types for CRUD operations
type GetPostFormatsResult = Result<PostFormat[]>;
type SavePostFormatResult = Result<PostFormat>;
type DeletePostFormatResult = Result;

export async function savePostFormat(
  templates: string[],
  category: string,
  isPublic: boolean,
): Promise<SavePostFormatResult> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const id = crypto.randomUUID();
    const newPostFormat = await db
      .insert(postFormats)
      .values({
        id,
        userId: isPublic ? null : userId,
        templates,
        category,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return {
      success: true,
      message: "Post format saved successfully.",
      data: newPostFormat[0] as PostFormat,
    };
  } catch (error) {
    console.error("Error saving post format:", error);
    return {
      success: false,
      message: "Failed to save post format",
    };
  }
}

export async function getPostFormats(
  isPublic: boolean,
): Promise<GetPostFormatsResult> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
        data: [],
      };
    }

    let userPostFormats;
    if (isPublic) {
      userPostFormats = await db
        .select()
        .from(postFormats)
        .where(isNull(postFormats.userId));
    } else {
      userPostFormats = await db
        .select()
        .from(postFormats)
        .where(eq(postFormats.userId, userId));
    }

    if (userPostFormats.length === 0) {
      return {
        success: true,
        message: "No post formats found",
        data: [],
      };
    }

    return {
      success: true,
      message: "Post formats fetched successfully",
      data: userPostFormats as PostFormat[],
    };
  } catch (error) {
    console.error("Error fetching post formats:", error);
    return {
      success: false,
      message: "Failed to fetch post formats",
      data: [],
    };
  }
}

export async function getPostFormat(
  formatId: string,
): Promise<Result<PostFormat>> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const postFormat = await db
      .select()
      .from(postFormats)
      .where(eq(postFormats.id, formatId))
      .limit(1);

    if (postFormat.length === 0) {
      return {
        success: false,
        message: "Post format not found",
      };
    }

    return {
      success: true,
      message: "Post format fetched successfully",
      data: postFormat[0] as PostFormat,
    };
  } catch (error) {
    console.error("Error fetching post format:", error);
    return {
      success: false,
      message: "Failed to fetch post format",
    };
  }
}

export async function deletePostFormat(
  formatId: string,
): Promise<DeletePostFormatResult> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const deletedPostFormat = await db
      .delete(postFormats)
      .where(eq(postFormats.id, formatId))
      .returning();

    if (deletedPostFormat.length === 0) {
      return {
        success: false,
        message: "Post format not found or already deleted",
      };
    }

    return {
      success: true,
      message: "Post format deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting post format:", error);
    return {
      success: false,
      message: "Failed to delete post format",
    };
  }
}
