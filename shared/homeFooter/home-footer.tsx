import { Zap } from "lucide-react";
import Link from "next/link";

export default function HomeFooter() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-8 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">EasyPos</span>
          <span className="text-xs text-muted-foreground">© 2026</span>
        </div>

        <nav className="sm:ml-auto flex gap-5 text-xs text-muted-foreground">
          <Link
            href="/terms"
            className="hover:text-foreground transition-colors"
          >
            Términos
          </Link>
          <Link
            href="/privacy"
            className="hover:text-foreground transition-colors"
          >
            Privacidad
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">
            Soporte
          </Link>
        </nav>
      </div>
    </footer>
  );
}
