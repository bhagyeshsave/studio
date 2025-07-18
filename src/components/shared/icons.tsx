import * as React from "react";

export const NexusLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <title>Nexus Logo</title>
    <path d="M10.2 2.6L4.7 7.8C3.1 9.4 3.1 12.6 4.7 14.2L10 19.4" />
    <path d="M13.8 21.4L19.3 16.2C20.9 14.6 20.9 11.4 19.3 9.8L14 4.6" />
    <path d="M9.8 14.6L4.7 9.4C3.1 7.8 3.1 4.6 4.7 3L10.2 8.2" />
    <path d="M14.2 9.4L19.3 14.6C20.9 16.2 20.9 19.4 19.3 21L13.8 15.8" />
  </svg>
);
