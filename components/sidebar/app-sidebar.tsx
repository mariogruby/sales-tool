/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import * as React from "react";
import { NavDocuments } from "@/components/sidebar/nav-documents";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ModeToggle } from "../mode-toggle";
import { Zap } from "lucide-react";
import Link from "next/link";
import { data } from "./data";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between w-full px-2">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="size-5 group-data-[collapsible=icon]:hidden" />
            <span className="text-base font-semibold group-data-[collapsible=icon]:hidden">
              EasyPos
            </span>
          </Link>
          <ModeToggle className="group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
