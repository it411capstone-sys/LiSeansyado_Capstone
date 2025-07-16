import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus2, RefreshCw, Eye, Bell, ShieldCheck } from "lucide-react";

const actions = [
  {
    href: "/fisherfolk/register",
    icon: FilePlus2,
    title: "Register Vessel/Gear",
    description: "Submit a new application for your boat or fishing equipment.",
    color: "bg-primary/10 text-primary",
  },
  {
    href: "/fisherfolk/my-registrations",
    icon: RefreshCw,
    title: "Renew License",
    description: "Renew your existing licenses before they expire.",
    color: "bg-accent/10 text-accent",
  },
  {
    href: "/fisherfolk/my-registrations",
    icon: Eye,
    title: "View My Registrations",
    description: "Check the status and details of all your registrations.",
    color: "bg-green-500/10 text-green-600",
  },
  {
    href: "/fisherfolk/notifications",
    icon: Bell,
    title: "Notifications",
    description: "See important updates, reminders, and alerts.",
    color: "bg-red-500/10 text-red-600",
  }
];

export default function FisherfolkHomePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Maayong Adlaw, Juan!</h1>
        <p className="text-muted-foreground">Welcome to your LiSEAnsyado portal. What would you like to do today?</p>
      </div>

      <Card className="mb-8 border-yellow-500/50 bg-yellow-500/5">
        <CardHeader className="flex flex-row items-center gap-4">
           <ShieldCheck className="h-8 w-8 text-yellow-600" />
           <div>
            <CardTitle>Verify Your Account</CardTitle>
            <CardDescription>Please verify your FishR/BoatR status to access all features, including new registrations.</CardDescription>
           </div>
        </CardHeader>
        <CardContent>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">Start Verification</Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link href={action.href} key={index} className="group">
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 hover:border-primary/50">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <h3 className="text-lg font-semibold group-hover:text-primary">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  );
}
