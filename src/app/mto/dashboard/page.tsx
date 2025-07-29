
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { registrations } from "@/lib/data";
import { DollarSign, Wallet, Users, BarChart2 } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { useTranslation } from "@/contexts/language-context";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

export default function MtoDashboard() {
  const { t } = useTranslation();

  const chartData = [
    { name: "Jan", total: 1200 },
    { name: "Feb", total: 2100 },
    { name: "Mar", total: 1500 },
    { name: "Apr", total: 2800 },
    { name: "May", total: 2300 },
    { name: "Jun", total: 3400 },
  ];

  const paymentTypeData = [
    { name: 'New Registration', value: 400 },
    { name: 'Renewal', value: 300 },
    { name: 'Penalties', value: 200 },
  ];
  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

  const totalRevenue = chartData.reduce((acc, curr) => acc + curr.total, 0);
  const totalTransactions = 125;
  const pendingCollections = 15;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("Total Revenue (YTD)")}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">₱{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{t("+20.1% from last month")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("Total Transactions")}</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">+{totalTransactions}</div>
              <p className="text-xs text-muted-foreground">{t("+18.1% from last month")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("Paying Users")}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">+{registrations.length}</div>
              <p className="text-xs text-muted-foreground">{t("+1 since last hour")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("Pending Collections")}</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
              <div className="text-2xl font-bold">{pendingCollections}</div>
              <p className="text-xs text-muted-foreground">{t("From unpaid fees & penalties")}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t("Revenue Overview")}</CardTitle>
            <CardDescription>{t("Monthly revenue from fees and penalties.")}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₱${value/1000}k`} />
                <Tooltip cursor={{fill: 'hsl(var(--background))'}} contentStyle={{backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))'}}/>
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>{t("Payment Type Distribution")}</CardTitle>
            <CardDescription>
              {t("Breakdown of revenue sources.")}
            </CardDescription>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                    <Tooltip cursor={{fill: 'hsl(var(--background))'}} contentStyle={{backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))'}}/>
                    <Legend />
                    <Pie data={paymentTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {paymentTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
