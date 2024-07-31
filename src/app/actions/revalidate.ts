"use server";

import { revalidatePath } from "next/cache";

export async function revalidatePost(path: string) {
  revalidatePath(path);
}
