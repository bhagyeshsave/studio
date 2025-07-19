
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
  ],
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
  ],
};

export const issueCategories = [
  "Waste Management",
  "Water & Sewage",
  "Roads & Infrastructure",
  "Parks & Recreation",
  "Streetlights",
  "Public Safety",
  "Other",
];

// This data is now fetched from Firebase, but we keep the structure definition here for reference.
export const issues = [];
export const leaderboardData = [];
