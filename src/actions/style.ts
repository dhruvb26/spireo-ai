"use server";

import { db } from "@/server/db";
import { contentStyles } from "@/server/db/schema";
import { getUserId } from "./user";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

// Define the ContentStyle type
export type ContentStyle = {
  id: string;
  userId: string;
  name: string;
  examples: string[];
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
type GetContentStylesResult = Result<ContentStyle[]>;
type SaveContentStyleResult = Result<ContentStyle>;
type DeleteContentStyleResult = Result;

export async function saveContentStyle(
  name: string,
  examples: string[],
): Promise<SaveContentStyleResult> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const id = uuid();

    const newContentStyle = await db
      .insert(contentStyles)
      .values({
        id,
        userId,
        name,
        examples,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return {
      success: true,
      message: "Content style saved successfully.",
      data: newContentStyle[0] as ContentStyle,
    };
  } catch (error) {
    console.error("Error saving content style:", error);
    return {
      success: false,
      message: "Failed to save content style",
    };
  }
}

export async function getContentStyles(): Promise<GetContentStylesResult> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
        data: [],
      };
    }

    const userContentStyles = await db
      .select()
      .from(contentStyles)
      .where(eq(contentStyles.userId, userId));

    if (userContentStyles.length === 0) {
      return {
        success: true,
        message: "No content styles found",
        data: [],
      };
    }

    return {
      success: true,
      message: "Content styles fetched successfully",
      data: userContentStyles as ContentStyle[],
    };
  } catch (error) {
    console.error("Error fetching content styles:", error);
    return {
      success: false,
      message: "Failed to fetch content styles",
      data: [],
    };
  }
}

export async function getContentStyle(
  styleId: string,
): Promise<Result<ContentStyle>> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const contentStyle = await db
      .select()
      .from(contentStyles)
      .where(eq(contentStyles.id, styleId))
      .limit(1);

    if (contentStyle.length === 0) {
      return {
        success: false,
        message: "Content style not found",
      };
    }

    return {
      success: true,
      message: "Content style fetched successfully",
      data: contentStyle[0] as ContentStyle,
    };
  } catch (error) {
    console.error("Error fetching content style:", error);
    return {
      success: false,
      message: "Failed to fetch content style",
    };
  }
}

export async function deleteContentStyle(
  styleId: string,
): Promise<DeleteContentStyleResult> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const deletedContentStyle = await db
      .delete(contentStyles)
      .where(eq(contentStyles.id, styleId))
      .returning();

    if (deletedContentStyle.length === 0) {
      return {
        success: false,
        message: "Content style not found or already deleted",
      };
    }

    return {
      success: true,
      message: "Content style deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting content style:", error);
    return {
      success: false,
      message: "Failed to delete content style",
    };
  }
}
