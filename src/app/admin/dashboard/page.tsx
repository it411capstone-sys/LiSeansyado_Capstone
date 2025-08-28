
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { registrations } from "@/lib/data";
import { AlertTriangle, BadgeHelp, Fish, Ship, Download, ListFilter } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useTranslation } from "@/contexts/language-context";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInspections } from "@/contexts/inspections-context";
import { format } from "date-fns";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const { inspections } = useInspections();
  const [exportFilter, setExportFilter] = useState<"All" | "Vessel" | "Gear">("All");

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

  const handleExportCSV = () => {
        const dataToExport = registrations.filter(reg => {
            if (exportFilter === 'All') return true;
            return reg.type === exportFilter;
        });

        const headers = [
            "id", "ownerName", "email", "contact", "address", 
            "vesselName", "gearType", "type", "registrationDate", 
            "expiryDate", "status", "vesselDetails", "fishingGearDetails", 
            "boatrVerified", "fishrVerified"
        ];
        
        const csvContent = [
            headers.join(','),
            ...dataToExport.map(row => 
                headers.map(header => 
                    `"${String((row as any)[header] ?? '').replace(/"/g, '""')}"`
                ).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `liseansyado_${exportFilter.toLowerCase()}_export.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <ListFilter className="mr-2 h-4 w-4" />
                        {t("Filter Export")}: {t(exportFilter)}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>{t("Select data to export")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={exportFilter} onValueChange={(value) => setExportFilter(value as any)}>
                        <DropdownMenuRadioItem value="All">{t("All")}</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Vessel">{t("Vessels Only")}</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Gear">{t("Gears Only")}</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
             <Button onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" /> {t("Export Data (CSV)")}
            </Button>
        </div>
      </div>
      
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
                    <BarChart data={chartData}>
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
