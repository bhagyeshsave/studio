
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import type { z } from "zod";
import { db, storage } from "./config";
import type { issueSchema } from "@/data/schemas";

// Note: This is a simplified schema for adding an issue.
// The full Issue schema will be more complex.
type IssueInput = z.infer<typeof issueSchema>;

/**
 * Adds a new issue to Firestore and uploads an image if provided.
 * @param issueData - The data for the issue.
 * @param mediaFile - The optional media file (image/video) to upload.
 * @returns The ID of the newly created issue document.
 */
export async function addIssue(
  issueData: IssueInput,
  mediaFile?: File
): Promise<string> {
  let mediaUrl = "";

  // 1. Upload media if it exists
  if (mediaFile) {
    const fileExtension = mediaFile.name.split(".").pop();
    const fileName = `issues/${uuidv4()}.${fileExtension}`;
    const storageRef = ref(storage, fileName);

    try {
      const snapshot = await uploadBytes(storageRef, mediaFile);
      mediaUrl = await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("File upload failed. Please try again.");
    }
  }

  // 2. Add issue document to Firestore
  try {
    const docRef = await addDoc(collection(db, "issues"), {
      ...issueData,
      imageUrl: mediaUrl,
      status: "Reported",
      reportedAt: serverTimestamp(),
      upvotes: 0,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error("Failed to submit issue.");
  }
}
