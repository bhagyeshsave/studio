
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Bot,
  Clapperboard,
  Construction,
  Droplets,
  LayoutDashboard,
  LifeBuoy,
  Megaphone,
  Map,
  Trophy,
  ClipboardList,
  Trash2,
  Settings,
} from "lucide-react";
import { NexusLogo } from "./icons";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

export const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/report", label: "Report Issue", icon: Megaphone },
  { href: "/issues", label: "Validate Issues", icon: Map },
  { href: "/tracking", label: "Track Issues", icon: ClipboardList },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/chatbot", label: "Civic Chatbot", icon: Bot },
  { href: "/vlogs", label: "Area Vlogs", icon: Clapperboard },
];

const issueTypeIcons = {
  "Garbage": Trash2,
  "Water Leakage": Droplets,
  "Roads": Construction,
};

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="group-data-[collapsible=icon]:border-r">
      <SidebarHeader className="h-16">
        <Link href="/" className="flex items-center gap-2">
          <NexusLogo className="w-8 h-8 text-primary" />
          <span className="font-bold text-lg font-headline group-data-[collapsible=icon]:hidden">Nexus</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  as="a"
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:-ml-1">
        <SidebarSeparator />
        <SidebarMenu>
            <SidebarMenuItem>
                 <SidebarMenuButton tooltip={{ children: "Settings" }}>
                    <Settings />
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                 <SidebarMenuButton tooltip={{ children: "Support" }}>
                    <LifeBuoy />
                    <span>Support</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
