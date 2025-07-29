
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
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

const monthlyData = [
  { month: "Jan", revenue: 18000 },
  { month: "Feb", revenue: 25000 },
  { month: "Mar", revenue: 22000 },
  { month: "Apr", revenue: 30000 },
  { month: "May", revenue: 28000 },
  { month: "Jun", revenue: 35000 },
];

const paymentMethodData = [
  { name: "GCash", value: 400 },
  { name: "Over-the-Counter", value: 300 },
  { name: "Bank Transfer", value: 150 },
];
const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function MtoReportsPage() {
    const { t } = useTranslation();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-end space-y-2">
        <div className="flex gap-2">
            <Button>
            <Download className="mr-2 h-4 w-4" /> {t("Export Financial Report")}
            </Button>
             <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> {t("Export All Transactions (CSV)")}
            </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>{t("Monthly Revenue")}</CardTitle>
            <CardDescription>{t("Total revenue collected per month for the last 6 months.")}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₱${value/1000}k`}/>
                    <Tooltip cursor={{ fill: 'hsl(var(--background))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}/>
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-5">
            <CardHeader>
                <CardTitle>{t("Payment Method Distribution")}</CardTitle>
                <CardDescription>{t("Breakdown of transactions by payment method.")}</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Tooltip cursor={{ fill: 'hsl(var(--background))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}/>
                        <Pie data={paymentMethodData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                            {paymentMethodData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="lg:col-span-12">
            <CardHeader>
                <CardTitle>{t("Collection Trends")}</CardTitle>
                <CardDescription>{t("Monthly trend of collected fees vs. pending payments.")}</CardDescription>
            </CardHeader>
            <CardContent>
                 <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData.map(d => ({...d, pending: Math.floor(d.revenue / 5)}))}>
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₱${value/1000}k`}/>
                        <Tooltip cursor={{ fill: 'hsl(var(--background))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}/>
                        <Line type="monotone" dataKey="revenue" name="Collected" stroke="hsl(var(--chart-1))" />
                        <Line type="monotone" dataKey="pending" name="Pending" stroke="hsl(var(--destructive))" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
