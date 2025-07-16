import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function FisherfolkSettingsPage() {
  return (
    <div className="container mx-auto max-w-2xl p-4 md:p-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Account Settings</h1>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Info</CardTitle>
            <CardDescription>Manage your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Juan Dela Cruz" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="juan.delacruz@email.com" />
              </div>
              <Button>Update Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security & Access</CardTitle>
            <CardDescription>Update your password for account security.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Change Password</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logout & Switch Account</CardTitle>
            <CardDescription>Securely log out or switch to another account.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button variant="destructive">Logout</Button>
            <Button variant="outline">Switch Account</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
