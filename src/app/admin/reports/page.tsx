
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ListFilter } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { useTranslation } from "@/contexts/language-context";
import { useState } from "react";
import { registrations } from "@/lib/data";
import { Registration } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const monthlyData = [
  { month: "Jan", registrations: 18 },
  { month: "Feb", registrations: 25 },
  { month: "Mar", registrations: 22 },
  { month: "Apr", registrations: 30 },
  { month: "May", registrations: 28 },
  { month: "Jun", registrations: 35 },
];

const gearTypeData = [
  { name: "Gillnet", value: 400 },
  { name: "Hook and Line", value: 300 },
  { name: "Longline", value: 300 },
  { name: "Cast Net", value: 200 },
  { name: "Other", value: 150 },
];
const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function AdminReportsPage() {
    const { t } = useTranslation();
    const [exportFilter, setExportFilter] = useState<"All" | "Vessel" | "Gear">("All");

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
      <div className="flex items-center justify-end space-y-2">
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>{t("Monthly Registrations")}</CardTitle>
            <CardDescription>{t("Total new vessel and gear registrations per month for the last 6 months.")}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: 'hsl(var(--background))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}/>
                    <Bar dataKey="registrations" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-5">
            <CardHeader>
                <CardTitle>{t("Gear Type Distribution")}</CardTitle>
                <CardDescription>{t("Breakdown of all registered fishing gears.")}</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Tooltip cursor={{ fill: 'hsl(var(--background))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}/>
                        <Pie data={gearTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                            {gearTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="lg:col-span-12">
            <CardHeader>
                <CardTitle>{t("Compliance Trends")}</CardTitle>
                <CardDescription>{t("Monthly trend of approved vs. rejected registrations.")}</CardDescription>
            </CardHeader>
            <CardContent>
                 <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData.map(d => ({...d, rejected: Math.floor(d.registrations / 5)}))}>
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: 'hsl(var(--background))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}/>
                        <Line type="monotone" dataKey="registrations" name="Approved" stroke="hsl(var(--chart-1))" />
                        <Line type="monotone" dataKey="rejected" name="Rejected" stroke="hsl(var(--destructive))" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
