
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useTranslation } from '@/contexts/language-context';
import { registrations } from '@/lib/data';

const monthlyData = [
    { month: 'Jan', Vessel: 12, Gear: 20 },
    { month: 'Feb', Vessel: 19, Gear: 30 },
    { month: 'Mar', Vessel: 3, Gear: 5 },
    { month: 'Apr', Vessel: 15, Gear: 25 },
    { month: 'May', Vessel: 10, Gear: 18 },
    { month: 'Jun', Vessel: 22, Gear: 35 },
];

const gearData = [
  { name: 'Gillnet', value: 400 },
  { name: 'Hook & Line', value: 300 },
  { name: 'Longline', value: 200 },
  { name: 'Fish Corral', value: 278 },
  { name: 'Spear Gun', value: 189 },
];

const complianceData = [
    { month: 'Jan', Approved: 28, Rejected: 4 },
    { month: 'Feb', Approved: 45, Rejected: 4 },
    { month: 'Mar', Approved: 8, Rejected: 0 },
    { month: 'Apr', Approved: 35, Rejected: 5 },
    { month: 'May', Approved: 25, Rejected: 3 },
    { month: 'Jun', Approved: 50, Rejected: 7 },
];

export default function AdminReportsPage() {
    const { t } = useTranslation();

    const handleExportCSV = () => {
        const headers = [
            "id", "ownerName", "email", "contact", "address", 
            "vesselName", "gearType", "type", "registrationDate", 
            "expiryDate", "status", "vesselDetails", "fishingGearDetails", 
            "boatrVerified", "fishrVerified"
        ];
        
        const csvContent = [
            headers.join(','),
            ...registrations.map(row => 
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
            link.setAttribute("download", `liseansyado_full_export.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">{t("Reports & Analytics")}</h2>
            <div className="flex items-center gap-2">
                <Button>{t("Export Monthly Report")}</Button>
                <Button onClick={handleExportCSV} variant="outline"><Download className="mr-2 h-4 w-4" />{t("Export All Data (CSV)")}</Button>
            </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader>
                    <CardTitle>{t("Monthly Registrations")}</CardTitle>
                    <CardDescription>{t("Total new vessel and gear registrations per month for the last 6 months.")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Vessel" fill="hsl(var(--primary))" />
                            <Bar dataKey="Gear" fill="hsl(var(--accent))" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
             </Card>

             <Card>
                <CardHeader>
                    <CardTitle>{t("Gear Type Distribution")}</CardTitle>
                    <CardDescription>{t("Breakdown of all registered fishing gears.")}</CardDescription>
                </CardHeader>
                <CardContent>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={gearData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" width={80} />
                            <Tooltip />
                            <Bar dataKey="value" fill="hsl(var(--primary))" name="Count" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
             </Card>

             <Card>
                <CardHeader>
                    <CardTitle>{t("Compliance Trends")}</CardTitle>
                    <CardDescription>{t("Monthly trend of approved vs. rejected registrations.")}</CardDescription>
                </CardHeader>
                <CardContent>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={complianceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Approved" stackId="a" fill="#16a34a" />
                            <Bar dataKey="Rejected" stackId="a" fill="#dc2626" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
             </Card>
        </div>
    </div>
  );
}
