"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { Zap, ArrowRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomeNavbar() {
  const { status } = useSession();
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center gap-2" href="#">
          <Zap className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold tracking-tight">EasyPos</span>
        </Link>

        <div className="ml-4">
          <ModeToggle />
        </div>

        <nav className="hidden sm:flex ml-auto gap-3">
          {status === "authenticated" ? (
            <Button asChild size="sm">
              <Link href="/dashboard">
                Ir al dashboard <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Iniciar sesión</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Registrarse gratis</Link>
              </Button>
            </>
          )}
        </nav>

        <div className="sm:hidden ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {status === "authenticated" ? (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/sign-in">Iniciar sesión</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/sign-up">Registrarse gratis</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
