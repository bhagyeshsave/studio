
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import type { z } from "zod";
import { db } from "./config";
import type { issueSchema } from "@/data/schemas";

// Note: This is a simplified schema for adding an issue.
// The full Issue schema will be more complex.
type IssueInput = Omit<z.infer<typeof issueSchema>, 'media'>;

/**
 * Adds a new issue to Firestore. File upload is temporarily disabled for debugging.
 * @param issueData - The data for the issue (without media).
 * @returns The ID of the newly created issue document.
 */
export async function addIssue(
  issueData: IssueInput
): Promise<string> {
  // 1. Add issue document to Firestore
  try {
    console.log("Attempting to write the following data to Firestore:", {
      ...issueData,
      imageUrl: "", // Will be empty for now
      status: "Reported",
      upvotes: 0,
      // reportedAt will be set by the server
    });

    const docRef = await addDoc(collection(db, "issues"), {
      ...issueData,
      imageUrl: "", // Media is disabled
      status: "Reported",
      reportedAt: serverTimestamp(),
      upvotes: 0,
    });
    console.log("Successfully wrote to Firestore with document ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error("Failed to submit issue to Firestore.");
  }
}
