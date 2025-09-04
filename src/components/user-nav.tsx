
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
import { LogOut, Settings } from "lucide-react";
import { users } from "@/lib/data";
import { useTranslation } from "@/contexts/language-context";
import { useAuth } from "@/hooks/use-auth";

type UserNavProps = {
  role: 'admin' | 'fisherfolk' | 'mto';
};

export function UserNav({ role }: UserNavProps) {
    const { t } = useTranslation();
    const { user, userData } = useAuth();
    
    // Fallback to mock data if auth isn't ready or for admin roles
    const displayUser = role === 'fisherfolk' ? userData : users[role];
    const displayEmail = role === 'fisherfolk' ? user?.email : users[role].email;
    const displayName = role === 'fisherfolk' ? userData?.displayName : users[role].name;

    const settingsPath = role === 'fisherfolk' ? '/fisherfolk/settings' : `/admin/settings`;

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${displayEmail}`} alt={displayName || ''} />
                        <AvatarFallback>{displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{displayName || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                        {displayEmail || 'No email'}
                    </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link href={settingsPath}>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>{t("Settings")}</span>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <Link href="/">
                    <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{t("Log out")}</span>
                    </DropdownMenuItem>
                </Link>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
