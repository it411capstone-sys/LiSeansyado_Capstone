import { Logo } from "@/components/logo";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-card">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <Logo />
          <MainNav role="admin" className="mx-6" />
          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Button variant="outline" className="w-full md:w-auto justify-start text-sm text-muted-foreground">
                <Search className="mr-2 h-4 w-4" />
                <span className="hidden lg:inline-flex">Search registrations...</span>
                <span className="inline-flex lg:hidden">Search...</span>
              </Button>
            </div>
            <UserNav role="admin" />
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
