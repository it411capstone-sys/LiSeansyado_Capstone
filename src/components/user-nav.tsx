
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
import { useTranslation } from "@/contexts/language-context";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

type UserNavProps = {
  role: 'admin' | 'fisherfolk' | 'mto';
};

export function UserNav({ role }: UserNavProps) {
    const { t } = useTranslation();
    const { user, userData, setUserData } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    
    // Use live data if available, otherwise it will be null/undefined during loading
    const displayName = userData?.displayName;
    const displayEmail = user?.email;
    const avatarUrl = userData?.avatarUrl;

    const settingsPath = role === 'fisherfolk' ? '/fisherfolk/settings' : `/admin/settings`;

    const handleLogout = () => {
        signOut(auth).then(() => {
            setUserData(null);
            router.push('/');
        }).catch((error) => {
            console.error("Error signing out: ", error);
            toast({ variant: 'destructive', title: 'Logout Failed', description: 'Could not log you out. Please try again.' });
        });
    };

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={avatarUrl || undefined} alt={displayName || ''} />
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
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("Log out")}</span>
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
