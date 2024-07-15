"use server";

import { db } from "@/server/db";
import { drafts } from "@/server/db/schema";
import { getUserId } from "./user";
import { eq, and, or } from "drizzle-orm";
// Define the Draft type
export type Draft = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  linkedInId: string;
};

// Define common result type
type Result<T = void> = {
  success: boolean;
  message: string;
  data?: T;
};

// Define the return types for each function
type SaveDraftResult = Result<Draft>;
type GetDraftsResult = Result<Draft[]>;
type DeleteDraftResult = Result;

export async function saveDraft(
  id: string,
  content: string,
): Promise<SaveDraftResult> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Check if the draft exists and belongs to the user
    const existingDraft = await db
      .select()
      .from(drafts)
      .where(and(eq(drafts.id, id), eq(drafts.userId, userId)))
      .limit(1);

    if (existingDraft.length > 0) {
      // Update existing draft
      const updateResult = await db
        .update(drafts)
        .set({
          content: content,
          updatedAt: new Date(),
        })
        .where(eq(drafts.id, id))
        .returning();

      if (updateResult.length === 0) {
        return {
          success: false,
          message: "Failed to update draft",
        };
      }
      return {
        success: true,
        message: "Draft updated successfully",
        data: updateResult[0] as Draft,
      };
    } else {
      // Create new draft with the provided id
      const insertResult = await db
        .insert(drafts)
        .values({
          id: id,
          status: "saved",
          userId: userId,
          content: content,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      if (insertResult.length === 0) {
        return {
          success: false,
          message: "Failed to create new draft",
        };
      }
      return {
        success: true,
        message: "Draft created successfully",
        data: insertResult[0] as Draft,
      };
    }
  } catch (error) {
    console.error("Error saving draft:", error);
    return {
      success: false,
      message: "Failed to save draft",
    };
  }
}
export async function getDrafts(): Promise<GetDraftsResult> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
        data: [],
      };
    }

    const userDrafts = await db
      .select()
      .from(drafts)
      .where(
        and(
          eq(drafts.userId, userId),
          or(eq(drafts.status, "saved"), eq(drafts.status, "scheduled")),
        ),
      );

    return {
      success: true,
      message: "Drafts fetched successfully",
      data: userDrafts as Draft[],
    };
  } catch (error) {
    console.error("Error fetching drafts:", error);
    return {
      success: false,
      message: "Failed to fetch drafts",
      data: [],
    };
  }
}

export async function deleteDraft(draftId: string): Promise<DeleteDraftResult> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const deletedDraft = await db
      .delete(drafts)
      .where(eq(drafts.id, draftId))
      .returning();

    if (deletedDraft.length === 0) {
      return {
        success: false,
        message: "Draft not found or already deleted",
      };
    }

    return {
      success: true,
      message: "Draft deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting draft:", error);
    return {
      success: false,
      message: "Failed to delete draft",
    };
  }
}
export async function getDraft(id: string) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const draft = await db
      .select()
      .from(drafts)
      .where(
        and(
          eq(drafts.id, id),
          eq(drafts.userId, userId),
          eq(drafts.status, "saved"),
        ),
      );

    if (!draft || draft.length === 0) {
      return {
        success: false,
        message: "Draft not found",
      };
    }

    return {
      success: true,
      message: "Draft fetched successfully",
      data: draft[0], // Return the first (and should be only) result
    };
  } catch (error) {
    console.error("Error fetching draft:", error);
    return {
      success: false,
      message: "Failed to fetch draft",
    };
  }
}

export async function getScheduledDrafts() {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
        data: [],
      };
    }

    const scheduledDrafts = await db
      .select()
      .from(drafts)
      .where(and(eq(drafts.userId, userId), eq(drafts.status, "scheduled")));

    return {
      success: true,
      message: "Scheduled drafts fetched successfully",
      data: scheduledDrafts as Draft[],
    };
  } catch (error) {
    console.error("Error fetching scheduled drafts:", error);
    return {
      success: false,
      message: "Failed to fetch scheduled drafts",
      data: [],
    };
  }
}

export async function updateDraftStatus(id: string): Promise<Result> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const updatedDraft = await db
      .update(drafts)
      .set({
        status: "published",
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(drafts.id, id),
          eq(drafts.userId, userId),
          eq(drafts.status, "scheduled"),
        ),
      )
      .returning();

    if (updatedDraft.length === 0) {
      return {
        success: false,
        message: "Draft not found or not in scheduled status",
      };
    }

    return {
      success: true,
      message: "Draft status updated to published successfully",
    };
  } catch (error) {
    console.error("Error updating draft status:", error);
    return {
      success: false,
      message: "Failed to update draft status",
    };
  }
}
