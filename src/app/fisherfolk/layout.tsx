import { Logo } from "@/components/logo";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";

export default function FisherfolkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <Logo />
          <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
            <MainNav role="fisherfolk" />
            <LanguageToggle />
            <UserNav role="fisherfolk" />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
