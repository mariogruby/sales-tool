"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link";
import {
  // IconCreditCard,
  IconDotsVertical,
  IconLogout,
  // IconNotification,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Settings, Store } from "lucide-react";
import { Logout } from "./logout";

export function NavUser() {
  const { data: session } = useSession()
  const { isMobile } = useSidebar()

  const [openDropdown, setOpenDropdown] = useState(false)
  const [openLogout, setOpenLogout] = useState(false)

  const handleLogoutOpen = () => {
    setOpenDropdown(false)
    setTimeout(() => setOpenLogout(true))
  }

  const user = {
    name: session?.user?.name ?? "cargando...",
    email: session?.user?.email ?? "cargando...",
    avatar: session?.user?.image ?? "",
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Store className="h-8 w-8 text-muted-foreground" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Store className="h-6 w-6 text-muted-foreground" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <IconUserCircle />
                  Cuenta
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem> */}
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings />
                  Configuración
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogoutOpen}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Logout
          open={openLogout}
          setOpen={setOpenLogout}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
