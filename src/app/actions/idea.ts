"use server";

import { db } from "@/server/db";
import { ideas } from "@/server/db/schema";
import { getUserId } from "./user";
import { eq } from "drizzle-orm";

// Define the Idea type
export type Idea = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

// Define common result type
type Result<T = void> = {
  success: boolean;
  message: string;
  data?: T;
};

// Define the return type for getIdeas
type GetIdeasResult = Result<Idea[]>;

// Define the return type for saveIdea
type SaveIdeaResult = Result<Idea>;

// Define the return type for deleteIdea
type DeleteIdeaResult = Result;

export async function saveIdea(
  id: string,
  content: string,
): Promise<SaveIdeaResult> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const updatedIdea = await db
      .update(ideas)
      .set({
        content: content,
        updatedAt: new Date(),
      })
      .where(eq(ideas.id, id))
      .returning();

    if (updatedIdea.length === 0) {
      // If no idea was updated, create a new one
      const newIdea = await db
        .insert(ideas)
        .values({
          id: id,
          userId: userId,
          content: content,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return {
        success: true,
        message: "Idea saved successfully.",
        data: newIdea[0] as Idea,
      };
    }

    return {
      success: true,
      message: "Idea updated successfully",
      data: updatedIdea[0] as Idea,
    };
  } catch (error) {
    console.error("Error saving idea:", error);
    return {
      success: false,
      message: "Failed to save idea",
    };
  }
}

export async function getIdeas(): Promise<GetIdeasResult> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
        data: [],
      };
    }

    const userIdeas = await db
      .select()
      .from(ideas)
      .where(eq(ideas.userId, userId));

    return {
      success: true,
      message: "Ideas fetched successfully",
      data: userIdeas as Idea[],
    };
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return {
      success: false,
      message: "Failed to fetch ideas",
      data: [],
    };
  }
}

export async function deleteIdea(ideaId: string): Promise<DeleteIdeaResult> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const deletedIdea = await db
      .delete(ideas)
      .where(eq(ideas.id, ideaId))
      .returning();

    if (deletedIdea.length === 0) {
      return {
        success: false,
        message: "Idea not found or already deleted",
      };
    }

    return {
      success: true,
      message: "Idea deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting idea:", error);
    return {
      success: false,
      message: "Failed to delete idea",
    };
  }
}
