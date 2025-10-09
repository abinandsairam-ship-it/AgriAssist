
"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  LayoutGrid,
  ScanLine,
  Triangle,
  Bug,
  ShoppingCart,
  Store,
  Newspaper,
  User,
  Settings,
  Leaf,
  Calendar,
  Video,
  History,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg font-headline">AgriAssist</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <Collapsible asChild defaultOpen>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={pathname.startsWith('/dashboard')}
                  className="justify-between"
                >
                  <div className="flex items-center gap-2">
                    <LayoutGrid />
                    <span>Dashboard</span>
                  </div>
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 [&[data-state=open]]:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <li>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname.startsWith('/dashboard/crop-detection')}
                    >
                      <Link href="/dashboard/crop-detection">
                        <ScanLine />
                        <span>Crop Detection</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </li>
                  <li>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname.startsWith('/dashboard/crop-suitability')}
                    >
                      <Link href="/dashboard/crop-suitability">
                        <Triangle />
                        <span>Crop Suitability</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </li>
                   <li>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname.startsWith('/dashboard/agri-videos')}
                    >
                      <Link href="/dashboard/agri-videos">
                        <Video />
                        <span>Agri Videos</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </li>
                  <li>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname.startsWith('/dashboard/issue-reporter')}
                    >
                      <Link href="/dashboard/issue-reporter">
                        <Bug />
                        <span>Issue Reporter</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </li>
                   <li>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname.startsWith('/dashboard/history')}
                    >
                      <Link href="/dashboard/history">
                        <History />
                        <span>Prediction History</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </li>
                   <li>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname.startsWith('/dashboard/supply-store')}
                    >
                      <Link href="/dashboard/supply-store">
                        <ShoppingCart />
                        <span>Agri-Supply Store</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </li>
                   <li>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname.startsWith('/dashboard/farmers-market')}
                    >
                      <Link href="/dashboard/farmers-market">
                        <Store />
                        <span>Farmer's Market</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </li>
                   <li>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname.startsWith('/dashboard/news')}
                    >
                      <Link href="/dashboard/news">
                        <Newspaper />
                        <span>Farming News</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </li>
                  <li>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname.startsWith('/dashboard/calendar')}
                    >
                      <Link href="/dashboard/calendar">
                        <Calendar />
                        <span>Calendar</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </li>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Account">
              <Link href="#">
                <User />
                <span>Account</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="#">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
