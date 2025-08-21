
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
import { Separator } from "./ui/separator";

type UserNavProps = {
  role: 'admin' | 'fisherfolk' | 'mto';
};

export function UserNav({ role }: UserNavProps) {
    const { t } = useTranslation();
    const user = users[role];
    const settingsPath = role === 'fisherfolk' ? '/fisherfolk/settings' : `/admin/settings?role=${role}`;
    
    // This is for the mobile sidebar view
    return (
      <div className="flex flex-col gap-4 p-4 border rounded-lg bg-muted/50 sm:hidden">
          <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                  <p className="text-base font-semibold leading-none">{t("Account")}</p>
                  <p className="text-sm leading-none text-muted-foreground">{user.name}</p>
              </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-1">
              <Link href={settingsPath} className="p-2 rounded-md hover:bg-accent text-sm font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>{t("Settings")}</span>
              </Link>
              <Link href="/" className="p-2 rounded-md hover:bg-accent text-sm font-medium flex items-center gap-2">
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("Log out")}</span>
              </Link>
          </div>
      </div>
    );
}
