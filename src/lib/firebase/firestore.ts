
import { db } from './config';
import { collection, getDocs, query, orderBy, limit, where, addDoc, serverTimestamp, writeBatch, documentId } from 'firebase/firestore';

// Types to match the database structure

export interface UserProfile {
  id: string;
  displayName: string;
  avatarUrl: string;
  points: number;
  badges: string[];
}

export interface Issue {
  id:string;
  title: string;
  description: string;
  category: string;
  location: string;
  reporterId: string;
  reporterName: string;
  status: 'Reported' | 'In Progress' | 'Resolved';
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  upvotes: number;
  reportCount: number;
  mediaUrl?: string;
  resolutionMediaUrl?: string;
}

// Every time a user reports an issue, it creates one of these.
export interface IssueReport {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    reporterId: string;
    reporterName: string;
    createdAt: any; // Firestore Timestamp
    mediaUrl?: string;
    linkedIssueId?: string; // ID of the canonical issue in the `issues` collection
}


export interface Ward {
  id: string; // ward number as string
  name: string;
  hygieneRating: number;
  safetyRating: number;
  issuesResolved: number;
  openIssues: number;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status: 'Active' | 'Upcoming' | 'Completed';
  date: string;
}


// Fetch Functions

/**
 * Fetches the top users for the leaderboard.
 */
export async function getLeaderboard(): Promise<UserProfile[]> {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, orderBy('points', 'desc'), limit(10));
  const querySnapshot = await getDocs(q);
  
  const leaderboard: UserProfile[] = [];
  querySnapshot.forEach((doc) => {
    leaderboard.push({ id: doc.id, ...doc.data() } as UserProfile);
  });
  return leaderboard;
}

/**
 * Fetches all reported issues.
 */
export async function getIssues(): Promise<Issue[]> {
  const issuesRef = collection(db, 'issues');
  const q = query(issuesRef, orderBy('createdAt', 'desc'), limit(20));
  const querySnapshot = await getDocs(q);

  const issues: Issue[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    issues.push({ 
      id: doc.id,
      ...data,
      // Convert Firestore Timestamps to JS Dates
      createdAt: data.createdAt.toDate(), 
      updatedAt: data.updatedAt.toDate(),
    } as Issue);
  });
  return issues;
}

/**
 * Fetches community scorecard data for all wards.
 */
export async function getWards(): Promise<Ward[]> {
  const wardsRef = collection(db, 'wards');
  const querySnapshot = await getDocs(wardsRef);

  const wards: Ward[] = [];
  querySnapshot.forEach((doc) => {
    wards.push({ id: doc.id, ...doc.data() } as Ward);
  });
  return wards;
}

/**
 * Fetches all local campaigns.
 */
export async function getCampaigns(): Promise<Campaign[]> {
  const campaignsRef = collection(db, 'campaigns');
  const q = query(campaignsRef, orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);

  const campaigns: Campaign[] = [];
  querySnapshot.forEach((doc) => {
    campaigns.push({ id: doc.id, ...doc.data() } as Campaign);
  });
  return campaigns;
}
