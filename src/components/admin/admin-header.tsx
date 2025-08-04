
'use client';
import { Logo } from "@/components/logo";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import {
    Bell,
    CalendarCheck,
    FileText,
    Home,
    MessageSquare,
    PanelLeft,
    BarChart2,
    Wallet,
} from "lucide-react"
import { LanguageToggle } from "../language-toggle";
import { usePathname } from "next/navigation";

const adminNavItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/registrations', label: 'Registrations', icon: FileText },
    { href: '/admin/inspections', label: 'Inspections', icon: CalendarCheck },
    { href: '/admin/payments', label: 'Payments', icon: Wallet },
    { href: '/admin/reports', label: 'Reports', icon: BarChart2 },
    { href: '/admin/feedbacks', label: 'Feedbacks', icon: MessageSquare },
    { href: '/admin/notifications', label: 'Notifications', icon: Bell },
];

const mtoNavItems = [
    { href: '/admin/payments', label: 'Payments', icon: Wallet },
];

export function AdminHeader() {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');
  
  // A bit of a trick to determine role based on the URL and what pages are available.
  // In a real app with auth, this would come from a session.
  const isMtoRoute = pathname.startsWith('/admin/payments') && !pathname.startsWith('/admin/dashboard');

  const role = isMtoRoute ? 'mto' : 'admin';
  const navItems = role === 'mto' ? mtoNavItems : adminNavItems;


  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
        <div className="flex items-center">
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Logo />
                        {navItems.map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="hidden sm:block ml-4">
                <Logo />
            </div>
        </div>
        <div className="flex-1 flex justify-center">
            <div className="hidden sm:block">
                <MainNav role={role} />
            </div>
        </div>
        <div className="flex items-center gap-2">
            <LanguageToggle />
            <UserNav role={role} />
        </div>
    </header>
  );
}
