/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"

import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
  type Icon,
} from "@tabler/icons-react"

import { ChevronRight } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: Icon
  }[]
}) {
  const { isMobile } = useSidebar()
const pathname = usePathname()
const isActiveGroup = items.some((item) => pathname === item.url)  

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Datos de ventas</SidebarGroupLabel>
      <Collapsible defaultOpen={isActiveGroup} className="group/collapsible">
        <SidebarMenu>
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton closeSidebarOnClick={false}>
                <span>Documentos</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <SidebarMenuSub>
                {items.map((item) => (
                  <SidebarMenuSubItem key={item.name}>
                    <SidebarMenuSubButton
                      asChild
                      className={
                        pathname === item.url
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-background/90"
                          : ""
                      }
                    >
                      <Link href={item.url}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </SidebarMenu>
      </Collapsible>
    </SidebarGroup>
  )
}
