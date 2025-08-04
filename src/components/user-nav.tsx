
'use client';
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, HelpCircle, LogOut, Settings, User } from "lucide-react";
import { users } from "@/lib/data";
import { useTranslation } from "@/contexts/language-context";

type UserNavProps = {
  role: 'admin' | 'fisherfolk' | 'mto';
};

export function UserNav({ role }: UserNavProps) {
    const { t } = useTranslation();
    const user = users[role];
    const settingsPath = role === 'fisherfolk' ? '/fisherfolk/settings' : `/admin/settings?role=${role}`;
    const notificationsPath = `/${role === 'mto' ? 'admin' : role}/notifications?role=${role}`;

  return (
    <div className="flex items-center gap-2">
        {role !== 'mto' && (
            <Button variant="ghost" size="icon" asChild>
                <Link href={notificationsPath}>
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Link>
            </Button>
        )}
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                {user.email}
                </p>
            </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                
                    <DropdownMenuItem asChild>
                        <Link href={settingsPath}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>{t("Settings")}</span>
                        </Link>
                    </DropdownMenuItem>
                
                {role !== 'mto' && (
                    <DropdownMenuItem asChild>
                        <Link href="#">
                            <HelpCircle className="mr-2 h-4 w-4" />
                            <span>{t("Help & Feedback")}</span>
                        </Link>
                    </DropdownMenuItem>
                )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("Log out")}</span>
                </Link>
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
}
