
'use client';
import { Logo } from "@/components/logo";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import {
    PanelRight,
    Settings,
    LogOut,
    Bell
} from "lucide-react"
import { LanguageToggle } from "../language-toggle";
import { adminNavItems, mtoNavItems, maoInspectorNavItems, maoHelpDeskNavItems } from "@/lib/nav-items";
import { Separator } from "../ui/separator";
import { useTranslation } from "@/contexts/language-context";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Badge } from "../ui/badge";
import { useAuth } from "@/hooks/use-auth";

export function AdminHeader() {
  const { t } = useTranslation();
  const { user, userData } = useAuth();
  
  const [notificationCount, setNotificationCount] = useState(0);
  
  const role = (userData as any)?.role;
  let navItems;
  switch (role) {
    case 'mto':
      navItems = mtoNavItems;
      break;
    case 'mao_inspector':
      navItems = maoInspectorNavItems;
      break;
    case 'mao_help_desk':
        navItems = maoHelpDeskNavItems;
        break;
    case 'mao':
    default:
      navItems = adminNavItems;
      break;
  }
  
  const settingsPath = `/admin/settings`;

  useEffect(() => {
    if (role === 'mao') {
      const q = query(collection(db, "adminNotifications"), where("isRead", "==", false));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setNotificationCount(snapshot.size);
      });
      return () => unsubscribe();
    }
  }, [role]);

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
        <div className="flex items-center gap-4">
            <Logo />
        </div>
        <div className="flex-1 flex justify-center">
            <MainNav role={role} />
        </div>
        <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
                <LanguageToggle />
                {role === 'mao' && (
                  <Link href="/admin/notifications">
                      <Button variant="ghost" size="icon" className="relative">
                          <Bell className="h-5 w-5"/>
                          {notificationCount > 0 && (
                              <Badge variant="destructive" className="absolute -top-1 -right-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full p-1 text-xs">
                                  {notificationCount}
                              </Badge>
                          )}
                      </Button>
                  </Link>
                )}
                <UserNav role={role} />
            </div>
            <div className="flex sm:hidden items-center gap-2">
                <LanguageToggle />
            </div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                        <PanelRight className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="sm:max-w-xs flex flex-col">
                    <SheetHeader>
                        <SheetTitle className="sr-only">Admin Navigation Menu</SheetTitle>
                    </SheetHeader>
                    <nav className="grid gap-6 text-lg font-medium mt-8">
                        {navItems.map(item => (
                            <Link
                                key={item.href}
                                href={`${item.href}`}
                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                     <div className="mt-auto flex flex-col gap-4">
                        <Separator />
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={userData?.avatarUrl || ''} alt={userData?.displayName || ''} />
                                <AvatarFallback>{userData?.displayName?.charAt(0) || 'A'}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <p className="text-base font-semibold leading-none">{userData?.displayName}</p>
                                <p className="text-sm leading-none text-muted-foreground">{userData?.email}</p>
                            </div>
                        </div>
                        <div className="grid gap-2 text-sm">
                            <Link href={settingsPath} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                                <Settings className="h-4 w-4" />
                                <span>{t("Settings")}</span>
                            </Link>
                             <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                                <LogOut className="h-4 w-4" />
                                <span>{t("Log out")}</span>
                            </Link>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    </header>
  );
}
