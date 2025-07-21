// src/lib/firebase/firestore.ts
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

export interface IssueData {
    title: string;
    description: string;
    category: string;
    location: string;
    imageUrl?: string;
    reporter: string; // For now, we'll use "anonymous"
    status: "Reported";
    upvotes: number;
    createdAt: any;
}

export async function addIssue(issueData: Omit<IssueData, 'createdAt' | 'reporter' | 'status' | 'upvotes'>) {
    try {
        const docRef = await addDoc(collection(db, "issues"), {
            ...issueData,
            reporter: "anonymous", // In a real app, this would be the logged-in user's ID
            status: "Reported",
            upvotes: 1,
            createdAt: serverTimestamp(),
        });
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Could not add issue to the database.");
    }
}
