"use server";

import { db } from "@/server/db";
import { drafts } from "@/server/db/schema";
import { Descendant } from "slate";
import { getUserId } from "./user";
import { eq, and } from "drizzle-orm";
import { getJobId, deleteJobId } from "@/server/redis";
import { getQueue } from "@/server/bull/queue";
import { env } from "@/env";

export type Draft = {
  id: string;
  name?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  scheduledFor?: Date;
  userId: string;
  status: string;
  linkedInId: string;
  documentUrn?: string;
  downloadUrl?: string;
};

type Result<T = void> = {
  success: boolean;
  message: string;
  data?: T;
};

export async function getDraft(draftId: string): Promise<Result<Draft>> {
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
      .where(and(eq(drafts.id, draftId), eq(drafts.userId, userId)))
      .limit(1);

    if (draft.length === 0) {
      return {
        success: false,
        message: "Draft not found",
      };
    }

    return {
      success: true,
      message: "Draft fetched successfully",
      data: draft[0] as Draft,
    };
  } catch (error) {
    console.error("Error fetching draft:", error);
    return {
      success: false,
      message: "Failed to fetch draft",
    };
  }
}

export async function getDrafts(status?: string): Promise<Result<Draft[]>> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
        data: [],
      };
    }

    let query;

    switch (status) {
      case "saved":
        query = db
          .select()
          .from(drafts)
          .where(and(eq(drafts.userId, userId), eq(drafts.status, "saved")));
        break;
      case "scheduled":
        query = db
          .select()
          .from(drafts)
          .where(
            and(eq(drafts.userId, userId), eq(drafts.status, "scheduled")),
          );
        break;
      case "published":
        query = db
          .select()
          .from(drafts)
          .where(
            and(eq(drafts.userId, userId), eq(drafts.status, "published")),
          );
        break;
      default:
        query = db.select().from(drafts).where(eq(drafts.userId, userId));
        break;
    }

    const userDrafts = await query;

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
export async function deleteDraft(draftId: string): Promise<Result> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // First, check if the draft exists and get its status
    const draftToDelete = await db
      .select()
      .from(drafts)
      .where(and(eq(drafts.id, draftId), eq(drafts.userId, userId)))
      .limit(1);

    if (draftToDelete.length === 0) {
      return {
        success: false,
        message: "Draft not found",
      };
    }

    const draftStatus = draftToDelete[0]?.status;

    // If the draft is scheduled, remove it from the queue
    if (draftStatus === "scheduled") {
      const queue = getQueue();
      if (!queue) {
        return {
          success: false,
          message: "Queue not initialized",
        };
      }

      const jobId = await getJobId(userId, draftId);
      console.log(`Job ID for draft ${draftId}: ${jobId}`);

      if (jobId) {
        const job = await queue.getJob(jobId);
        if (job) {
          await job.remove();
          console.log(`Removed job ${jobId} from queue`);
        } else {
          console.log(`Job ${jobId} not found in queue`);
        }

        // Always delete the job ID from Redis
        await deleteJobId(userId, draftId);
        console.log(`Deleted job ID from Redis for draft ${draftId}`);
      } else {
        console.log(`No job ID found in Redis for draft ${draftId}`);

        // If no job ID in Redis, search for the job in the queue using draft data
        const allJobs = await queue.getJobs(["active", "waiting", "delayed"]);
        const jobToRemove = allJobs.find(
          (j) => j.data.userId === userId && j.data.postId === draftId,
        );

        if (jobToRemove) {
          await jobToRemove.remove();
          console.log(
            `Removed job for draft ${draftId} found directly in queue`,
          );
        } else {
          console.log(`No job found in queue for draft ${draftId}`);
        }
      }
    }

    // Now delete the draft from the database
    const deletedDraft = await db
      .delete(drafts)
      .where(and(eq(drafts.id, draftId), eq(drafts.userId, userId)))
      .returning();

    if (deletedDraft.length === 0) {
      return {
        success: false,
        message: "Failed to delete draft",
      };
    }

    return {
      success: true,
      message:
        draftStatus === "scheduled"
          ? "Draft deleted and unscheduled successfully"
          : "Draft deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting draft:", error);
    return {
      success: false,
      message: "Failed to delete draft",
    };
  }
}
export async function saveDraft(
  draftId: string,
  content: string | Descendant[],
): Promise<Result<Draft>> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    let serializedContent: string;
    if (typeof content === "string") {
      try {
        JSON.parse(content);
        serializedContent = content;
      } catch {
        serializedContent = JSON.stringify([
          {
            type: "paragraph",
            children: [{ text: content }],
          },
        ]);
      }
    } else {
      serializedContent = JSON.stringify(content);
    }

    const existingDraft = await db
      .select()
      .from(drafts)
      .where(and(eq(drafts.id, draftId), eq(drafts.userId, userId)))
      .limit(1);

    if (existingDraft.length > 0) {
      const updateResult = await db
        .update(drafts)
        .set({
          content: serializedContent,
          updatedAt: new Date(),
        })
        .where(eq(drafts.id, draftId))
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
      const insertResult = await db
        .insert(drafts)
        .values({
          id: draftId,
          status: "saved",
          userId: userId,
          content: serializedContent,
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

      // Get the user flow state
      const options = {
        method: "GET",
        headers: { Authorization: `Bearer ${env.FRIGADE_API_KEY}` },
      };

      const response = await fetch(
        `https://api.frigade.com/v1/public/flowStates?userId=${userId}`,
        options,
      );
      const data = await response.json();
      // Find the flow with slug "flow_pUF3qW42"
      const targetFlow = data.eligibleFlows.find(
        (flow: any) => flow.flowSlug === "flow_pUF3qW42",
      );

      if (targetFlow) {
        // Find the step with id "checklist-step-two"
        const targetStep = targetFlow.data.steps.find(
          (step: any) => step.id === "checklist-step-two",
        );
        console.log(targetStep);

        if (targetStep) {
          const isCompleted = targetStep.$state.completed;
          const isStarted = targetStep.$state.started;
          console.log(`Step "checklist-step-two" is completed: ${isCompleted}`);
          console.log(`Step "checklist-step-two" is started: ${isStarted}`);

          if (!isCompleted) {
            let startOptions = {
              method: "POST",
              headers: {
                Authorization: `Bearer ${env.FRIGADE_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: userId,
                flowSlug: "flow_pUF3qW42",
                stepId: "checklist-step-two",
                actionType: "STARTED_STEP",
              }),
            };

            const startResponse = await fetch(
              "https://api.frigade.com/v1/public/flowStates",
              startOptions,
            );

            if (startResponse.ok) {
              console.log("Step marked as started.");

              let completeOptions = {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${env.FRIGADE_API_KEY}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: userId,
                  flowSlug: "flow_pUF3qW42",
                  stepId: "checklist-step-two",
                  actionType: "COMPLETED_STEP",
                }),
              };

              const completeResponse = await fetch(
                "https://api.frigade.com/v1/public/flowStates",
                completeOptions,
              );

              if (completeResponse.ok) {
                console.log("Step marked as completed.");
              } else {
                console.error("Failed to mark step as completed.");
              }
            } else {
              console.error("Failed to mark step as started.");
            }
          }
        } else {
          console.log("Step 'checklist-step-two' not found in the flow.");
        }
      } else {
        console.log("Flow 'flow_pUF3qW42' not found in eligible flows.");
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

export async function updateDraft(
  draftId: string,
  status: string,
): Promise<Result> {
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
        status: status as "saved" | "published" | "scheduled",
        updatedAt: new Date(),
      })
      .where(and(eq(drafts.id, draftId), eq(drafts.userId, userId)))
      .returning();

    if (updatedDraft.length === 0) {
      return {
        success: false,
        message: "Draft not found",
      };
    }

    return {
      success: true,
      message: "Draft status updated successfully",
    };
  } catch (error) {
    console.error("Error updating draft status:", error);
    return {
      success: false,
      message: "Failed to update draft status",
    };
  }
}

export async function updateDraftDocumentUrn(
  id: string,
  documentUrn: string,
  content?: string,
): Promise<Result> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const existingDraft = await db
      .select()
      .from(drafts)
      .where(and(eq(drafts.id, id), eq(drafts.userId, userId)))
      .limit(1);

    if (existingDraft.length === 0) {
      if (content === undefined) {
        return {
          success: false,
          message: "Content is required to create a new draft",
        };
      }

      const insertResult = await db
        .insert(drafts)
        .values({
          id: id,
          status: "saved",
          userId: userId,
          content: content,
          documentUrn: documentUrn,
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
        message: "Draft created and document URN set successfully",
      };
    } else {
      const updatedDraft = await db
        .update(drafts)
        .set({
          documentUrn: documentUrn,
          updatedAt: new Date(),
        })
        .where(and(eq(drafts.id, id), eq(drafts.userId, userId)))
        .returning();

      if (updatedDraft.length === 0) {
        return {
          success: false,
          message: "Failed to update draft document URN",
        };
      }

      return {
        success: true,
        message: "Draft document URN updated successfully",
      };
    }
  } catch (error) {
    console.error("Error updating draft document URN:", error);
    return {
      success: false,
      message: "Failed to update draft document URN",
    };
  }
}

export async function removeDraftDocumentUrn(id: string): Promise<Result> {
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
        documentUrn: null,
        updatedAt: new Date(),
      })
      .where(and(eq(drafts.id, id), eq(drafts.userId, userId)))
      .returning();

    if (updatedDraft.length === 0) {
      return {
        success: false,
        message: "Draft not found",
      };
    }

    return {
      success: true,
      message: "Draft document URN removed successfully",
    };
  } catch (error) {
    console.error("Error removing draft document URN:", error);
    return {
      success: false,
      message: "Failed to remove draft document URN",
    };
  }
}

export async function updateDownloadUrl(
  id: string,
  downloadUrl: string,
): Promise<Result> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const existingDraft = await db
      .select()
      .from(drafts)
      .where(and(eq(drafts.id, id), eq(drafts.userId, userId)))
      .limit(1);

    if (existingDraft.length === 0) {
      const insertResult = await db.insert(drafts).values({
        id: id,
        status: "saved",
        userId: userId,
        downloadUrl: downloadUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (insertResult.length === 0) {
        return {
          success: false,
          message: "Failed to create new draft",
        };
      }

      return {
        success: true,
        message: "Draft created and download URL set successfully",
      };
    } else {
      const updatedDraft = await db
        .update(drafts)
        .set({
          downloadUrl: downloadUrl,
          updatedAt: new Date(),
        })
        .where(and(eq(drafts.id, id), eq(drafts.userId, userId)));

      if (updatedDraft.length === 0) {
        return {
          success: false,
          message: "Failed to update draft download URL",
        };
      }

      return {
        success: true,
        message: "Draft download URL updated successfully",
      };
    }
  } catch (error) {
    console.error("Error updating draft download URL:", error);
    return {
      success: false,
      message: "Failed to update draft download URL",
    };
  }
}

export async function deleteDownloadUrl(id: string): Promise<Result> {
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
        downloadUrl: null,
        updatedAt: new Date(),
      })
      .where(and(eq(drafts.id, id), eq(drafts.userId, userId)))
      .returning();

    if (updatedDraft.length === 0) {
      return {
        success: false,
        message: "Draft not found",
      };
    }

    return {
      success: true,
      message: "Draft download URL removed successfully",
    };
  } catch (error) {
    console.error("Error removing draft download URL:", error);
    return {
      success: false,
      message: "Failed to remove draft download URL",
    };
  }
}

export async function getDownloadUrl(
  id: string,
): Promise<Result<string | null>> {
  try {
    const userId = await getUserId();

    if (!userId) {
      return {
        success: false,
        message: "User not authenticated",
        data: null,
      };
    }

    const draft = await db
      .select({
        downloadUrl: drafts.downloadUrl,
      })
      .from(drafts)
      .where(and(eq(drafts.id, id), eq(drafts.userId, userId)))
      .limit(1);

    if (draft.length === 0) {
      return {
        success: false,
        message: "Draft not found",
        data: null,
      };
    }

    return {
      success: true,
      message: "Download URL retrieved successfully",
      data: draft[0]?.downloadUrl,
    };
  } catch (error) {
    console.error("Error retrieving draft download URL:", error);
    return {
      success: false,
      message: "Failed to retrieve draft download URL",
      data: null,
    };
  }
}
