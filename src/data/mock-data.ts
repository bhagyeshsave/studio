
export interface Ward {
  name: string;
  wardNumber: number;
  hygieneRating: number;
  safetyRating: number;
  issuesResolved: number;
  openIssues: number;
}

export interface Campaign {
  title: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  status: "Active" | "Upcoming" | "Completed";
  date: string;
}

export const communityData = {
  wards: [
    {
      name: "Sunrise Valley",
      wardNumber: 12,
      hygieneRating: 4.2,
      safetyRating: 4.5,
      issuesResolved: 124,
      openIssues: 15,
    },
    {
      name: "Riverbend District",
      wardNumber: 8,
      hygieneRating: 3.8,
      safetyRating: 4.0,
      issuesResolved: 98,
      openIssues: 23,
    },
    {
      name: "Central Heights",
      wardNumber: 5,
      hygieneRating: 4.8,
      safetyRating: 4.9,
      issuesResolved: 210,
      openIssues: 8,
    },
  ] as Ward[],
  campaigns: [
    {
      title: "City-Wide Cleanup Drive",
      description: "Join us this weekend to make our city cleaner and greener. Gloves and bags will be provided.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "city cleanup",
      status: "Active",
      date: "Oct 28-29, 2023",
    },
    {
      title: "Road Safety Awareness Week",
      description: "Participate in workshops and seminars to promote safer roads for everyone.",
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "road safety",
      status: "Upcoming",
      date: "Nov 5-11, 2023",
    },
  ] as Campaign[],
};

export const issueCategories = [
  "Waste Management",
  "Water and Sewage",
  "Roads and Infrastructure",
  "Parks and Recreation",
  "Streetlights",
  "Public Safety",
  "Other",
];

export interface Update {
    status: string;
    date: Date;
    comment: string;
}

export interface Issue {
  id: string;
  title: string;
  status: "Reported" | "In Progress" | "Resolved";
  location: string;
  reporter: string;
  reportedAt: Date;
  imageUrl: string;
  imageHint: string;
  upvotes: number;
  updates: Update[];
  resolutionUrl?: string;
  resolutionHint?: string;
}

export const issues: Issue[] = [
  {
      id: "1",
      title: "Overflowing garbage can at park entrance",
      status: "Reported",
      location: "Sunrise Valley Park",
      reporter: "Jane Doe",
      reportedAt: new Date('2023-10-25T09:00:00Z'),
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "garbage can overflowing",
      upvotes: 5,
      updates: [
          { status: "Reported", date: new Date('2023-10-25T09:00:00Z'), comment: "Issue submitted by user." },
      ]
  },
  {
      id: "2",
      title: "Large pothole on Elm Street",
      status: "In Progress",
      location: "123 Elm Street",
      reporter: "John Smith",
      reportedAt: new Date('2023-10-24T14:30:00Z'),
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "pothole road",
      upvotes: 12,
      updates: [
          { status: "In Progress", date: new Date('2023-10-25T11:00:00Z'), comment: "Work crew has been assigned." },
          { status: "Reported", date: new Date('2023-10-24T14:30:00Z'), comment: "Issue submitted by user." },
      ]
  },
    {
      id: "3",
      title: "Broken streetlight causing safety concern",
      status: "Resolved",
      location: "Corner of Oak & Maple",
      reporter: "Anonymous",
      reportedAt: new Date('2023-10-22T21:00:00Z'),
      imageUrl: "https://placehold.co/600x400.png",
      imageHint: "dark street corner",
      upvotes: 2,
      updates: [
          { status: "Resolved", date: new Date('2023-10-23T16:45:00Z'), comment: "The streetlight has been repaired." },
          { status: "In Progress", date: new Date('2023-10-23T10:00:00Z'), comment: "Technician dispatched to the location." },
          { status: "Reported", date: new Date('2023-10-22T21:00:00Z'), comment: "Issue submitted by user." },
      ],
      resolutionUrl: "https://placehold.co/600x400.png",
      resolutionHint: "fixed streetlight"
  }
];

export interface User {
    rank: number;
    user: string;
    points: number;
    avatar: string;
    badges: string[];
}


export const leaderboardData: User[] = [
  { rank: 1, user: 'CommunityHero', points: 1250, avatar: 'https://placehold.co/100x100.png', badges: ['Top Reporter', 'Validator'] },
  { rank: 2, user: 'CivicSavior', points: 1100, avatar: 'https://placehold.co/100x100.png', badges: ['Clean-up Crew'] },
  { rank: 3, user: 'FixerUpper', points: 980, avatar: 'https://placehold.co/100x100.png', badges: ['Validator'] },
  { rank: 4, user: 'GreenGuardian', points: 850, avatar: 'https://placehold.co/100x100.png', badges: [] },
  { rank: 5, user: 'HelpfulHenry', points: 720, avatar: 'https://placehold.co/100x100.png', badges: ['Top Reporter'] },
];

