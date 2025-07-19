
import type { Metadata } from "next";
import { Poppins, PT_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/shared/app-header";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-headline",
});

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
});


export const metadata: Metadata = {
  title: "Nexus",
  description: "Report and track civic issues in your community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={cn("min-h-screen bg-background font-body antialiased", poppins.variable, ptSans.variable)}>
        <SidebarProvider>
        <div className="flex">
            <AppSidebar />
            <SidebarInset className="min-h-screen !m-0 !p-0 !rounded-none !shadow-none">
            <AppHeader />
            <main className="p-4 sm:p-6 lg:p-8">
                {children}
            </main>
            </SidebarInset>
        </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
