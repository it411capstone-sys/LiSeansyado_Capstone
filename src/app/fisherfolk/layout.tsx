import { Logo } from "@/components/logo";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function FisherfolkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-card">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <Logo />
          <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
            <MainNav role="fisherfolk" />
             <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Language</span>
            </Button>
            <UserNav role="fisherfolk" />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
