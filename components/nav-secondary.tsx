
"use client"

import * as React from "react"
import { type Icon } from "@tabler/icons-react"

import Link from "next/link"

import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: Icon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {

  const pathname = usePathname()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1 group-data-[collapsible=icon]:space-y-3">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={`
    ${pathname === item.url
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-background/90"
                    : ""}
    group-data-[collapsible=icon]:justify-center 
    group-data-[collapsible=icon]:gap-0
  `}
              >
                <Link href={item.url}>
                  <item.icon className="h-5 w-5 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
