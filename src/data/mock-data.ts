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

export const issues = [
  {
    id: "ISU-001",
    title: "Overflowing garbage bin near park",
    category: "Waste Management",
    location: "Sunrise Valley, Park Entrance",
    status: "In Progress",
    upvotes: 12,
    reporter: "Alice Johnson",
    reportedAt: "2023-10-25T10:00:00Z",
    imageUrl: "https://placehold.co/400x300.png",
    imageHint: "overflowing trash",
    updates: [
        { status: "Reported", date: "2023-10-25T10:00:00Z", comment: "The bin has been full for 3 days." },
        { status: "In Progress", date: "2023-10-25T14:00:00Z", comment: "Assigned to sanitation crew. Expected resolution within 24 hours." },
    ]
  },
  {
    id: "ISU-002",
    title: "Large pothole on Elm Street",
    category: "Roads & Infrastructure",
    location: "Riverbend District, 123 Elm St",
    status: "Resolved",
    upvotes: 28,
    reporter: "You",
    reportedAt: "2023-10-22T15:30:00Z",
    imageUrl: "https://placehold.co/400x300.png",
    imageHint: "pothole road",
    resolutionUrl: "https://placehold.co/400x300.png",
    resolutionHint: "fixed pothole",
    updates: [
        { status: "Reported", date: "2023-10-22T15:30:00Z", comment: "Deep pothole causing traffic issues." },
        { status: "Acknowledged", date: "2023-10-23T09:00:00Z", comment: "Public works department has scheduled a fix." },
        { status: "Resolved", date: "2023-10-24T16:00:00Z", comment: "Pothole has been filled and the road is now smooth." },
    ]
  },
  {
    id: "ISU-003",
    title: "Streetlight out at corner of Oak & Pine",
    category: "Streetlights",
    location: "Central Heights, Oak & Pine Intersection",
    status: "Reported",
    upvotes: 5,
    reporter: "Bob Williams",
    reportedAt: "2023-10-26T20:00:00Z",
    imageUrl: "https://placehold.co/400x300.png",
    imageHint: "dark street",
    updates: [
         { status: "Reported", date: "2023-10-26T20:00:00Z", comment: "The entire corner is dark, which feels unsafe." },
    ]
  },
  {
    id: "ISU-004",
    title: "Leaking fire hydrant",
    category: "Water & Sewage",
    location: "Sunrise Valley, 451 Beacon Ave",
    status: "Reported",
    upvotes: 9,
    reporter: "You",
    reportedAt: "2023-10-27T08:00:00Z",
    updates: [
        { status: "Reported", date: "2023-10-27T08:00:00Z", comment: "Water has been leaking for a few hours." },
    ]
  }
];

export const leaderboardData = [
  { rank: 1, user: "Catherine Lee", points: 2450, avatar: "https://placehold.co/40x40.png", badges: ["Top Reporter", "Community Hero"] },
  { rank: 2, user: "Bob Williams", points: 2100, avatar: "https://placehold.co/40x40.png", badges: ["Validator"] },
  { rank: 3, user: "You", points: 1850, avatar: "https://placehold.co/40x40.png", badges: ["Trailblazer"] },
  { rank: 4, user: "David Chen", points: 1600, avatar: "https://placehold.co/40x40.png", badges: ["Reporter"] },
  { rank: 5, user: "Emily Rodriguez", points: 1420, avatar: "https://placehold.co/40x40.png", badges: [] },
  { rank: 6, user: "Frank Green", points: 1100, avatar: "https://placehold.co/40x40.png", badges: ["Validator"] },
  { rank: 7, user: "Grace Hall", points: 950, avatar: "https://placehold.co/40x40.png", badges: [] },
  { rank: 8, user: "Henry Taylor", points: 800, avatar: "https://placehold.co/40x40.png", badges: ["Reporter"] },
];
