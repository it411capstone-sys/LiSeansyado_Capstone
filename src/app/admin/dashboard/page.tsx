
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { registrations } from "@/lib/data";
import { AlertTriangle, BadgeHelp, Fish, Ship } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useTranslation } from "@/contexts/language-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInspections } from "@/contexts/inspections-context";
import { format } from "date-fns";

const translationKeys = [
  "Registered Vessels",
  "+5 since last month",
  "Registered Gears",
  "+12 since last month",
  "Pending Registrations",
  "2 need immediate review",
  "Alerts",
  "Expiring licenses",
  "Registration Overview",
  "Monthly registration trends.",
  "Upcoming Inspections",
  "Inspections scheduled for the next 7 days.",
  "Vessel",
  "Date",
  "Inspector"
];

export default function AdminDashboard() {
  const { t } = useTranslation(translationKeys);
  const router = useRouter();
  const { inspections } = useInspections();

  const chartData = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 0 },
    { name: "Aug", total: 0 },
    { name: "Sep", total: 0 },
    { name: "Oct", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Dec", total: 0 },
  ];

  registrations.forEach(reg => {
    const month = new Date(reg.registrationDate).getMonth();
    chartData[month].total += 1;
  });

  const totalVessels = registrations.filter(r => r.type === 'Vessel').length;
  const totalGears = registrations.filter(r => r.type === 'Gear').length;
  const pendingRegistrations = registrations.filter(r => r.status === 'Pending').length;
  const expiringLicenses = registrations.filter(r => new Date(r.expiryDate) < new Date(new Date().setMonth(new Date().getMonth() + 1)) && r.status === 'Approved').length;

  const handleChartClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const month = data.activePayload[0].payload.name;
      router.push(`/admin/registrations?month=${month}`);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/registrations?type=Vessel">
            <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("Registered Vessels")}</CardTitle>
                <Ship className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalVessels}</div>
                <p className="text-xs text-muted-foreground">{t("+5 since last month")}</p>
            </CardContent>
            </Card>
        </Link>
        <Link href="/admin/registrations?type=Gear">
            <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("Registered Gears")}</CardTitle>
                <Fish className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalGears}</div>
                <p className="text-xs text-muted-foreground">{t("+12 since last month")}</p>
            </CardContent>
            </Card>
        </Link>
        <Link href="/admin/registrations?status=Pending">
            <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("Pending Registrations")}</CardTitle>
                <BadgeHelp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{pendingRegistrations}</div>
                <p className="text-xs text-muted-foreground">{t("2 need immediate review")}</p>
            </CardContent>
            </Card>
        </Link>
        <Link href="/admin/registrations?status=Expiring">
            <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("Alerts")}</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{expiringLicenses}</div>
                <p className="text-xs text-muted-foreground">{t("Expiring licenses")}</p>
            </CardContent>
            </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t("Registration Overview")}</CardTitle>
            <CardDescription>{t("Monthly registration trends.")}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="w-[800px] h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} onClick={handleChartClick}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} domain={[0, 40]} />
                        <Tooltip cursor={{fill: 'hsl(var(--background))'}} contentStyle={{backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))'}}/>
                        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>{t("Upcoming Inspections")}</CardTitle>
            <CardDescription>
              {t("Inspections scheduled for the next 7 days.")}
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Vessel")}</TableHead>
                  <TableHead>{t("Date")}</TableHead>
                  <TableHead>{t("Inspector")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inspections.filter(i => i.status === 'Scheduled').map((item) => (
                    <TableRow 
                        key={item.id} 
                        className="cursor-pointer"
                        onClick={() => router.push(`/admin/inspections?id=${item.id}`)}
                    >
                      <TableCell>
                        <div className="font-medium">{item.vesselName}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {item.registrationId}
                        </div>
                      </TableCell>
                      <TableCell>{format(item.scheduledDate, 'PPp')}</TableCell>
                      <TableCell>{item.inspector}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
