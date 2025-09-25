
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, BadgeHelp, Fish, Ship, Download, ListFilter } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useTranslation } from "@/contexts/language-context";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInspections } from "@/contexts/inspections-context";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Registration, VerificationSubmission, Payment, Feedback, Inspection } from "@/lib/types";
import * as XLSX from 'xlsx';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const EXPORT_CATEGORIES = ["Verifications", "Registrations", "Inspections", "Payments", "Feedbacks"] as const;
type ExportCategory = typeof EXPORT_CATEGORIES[number];

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [verifications, setVerifications] = useState<VerificationSubmission[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [exportFilters, setExportFilters] = useState<Record<ExportCategory, boolean>>({
    Verifications: true,
    Registrations: true,
    Inspections: true,
    Payments: true,
    Feedbacks: true,
  });


  useEffect(() => {
    const unsubRegistrations = onSnapshot(collection(db, "registrations"), (snapshot) => {
      const regs: Registration[] = [];
      snapshot.forEach((doc) => {
        regs.push({ id: doc.id, ...doc.data() } as Registration);
      });
      setRegistrations(regs);
    });
    
    const unsubVerifications = onSnapshot(collection(db, "verificationSubmissions"), (snapshot) => {
        const vers: VerificationSubmission[] = [];
        snapshot.forEach((doc) => {
            vers.push({ id: doc.id, ...doc.data() } as VerificationSubmission);
        });
        setVerifications(vers);
    });

    const unsubPayments = onSnapshot(collection(db, "payments"), (snapshot) => {
        const pays: Payment[] = [];
        snapshot.forEach((doc) => {
            pays.push({ id: doc.id, ...doc.data() } as Payment);
        });
        setPayments(pays);
    });

    const unsubFeedbacks = onSnapshot(collection(db, "feedbacks"), (snapshot) => {
        const feeds: Feedback[] = [];
        snapshot.forEach((doc) => {
            feeds.push({ id: doc.id, ...doc.data() } as Feedback);
        });
        setFeedbacks(feeds);
    });

    const unsubInspections = onSnapshot(collection(db, "inspections"), (snapshot) => {
        const insps: Inspection[] = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            insps.push({ id: doc.id, ...data, scheduledDate: data.scheduledDate.toDate() } as Inspection);
        });
        setInspections(insps);
    });

    return () => {
        unsubRegistrations();
        unsubVerifications();
        unsubPayments();
        unsubFeedbacks();
        unsubInspections();
    };
  }, []);

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

  const handleExportFilterChange = (category: ExportCategory) => {
    setExportFilters(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleExport = () => {
        const wb = XLSX.utils.book_new();

        if (exportFilters.Verifications) {
            const verificationsWS = XLSX.utils.json_to_sheet(verifications);
            XLSX.utils.book_append_sheet(wb, verificationsWS, "Verifications");
        }
        
        if (exportFilters.Registrations) {
            const registrationsWS = XLSX.utils.json_to_sheet(registrations);
            XLSX.utils.book_append_sheet(wb, registrationsWS, "Registrations");
        }

        if (exportFilters.Inspections) {
            const inspectionsWS = XLSX.utils.json_to_sheet(inspections.map(i => ({...i, scheduledDate: format(i.scheduledDate, 'PPp')})));
            XLSX.utils.book_append_sheet(wb, inspectionsWS, "Inspections");
        }

        if (exportFilters.Payments) {
            const paymentsWS = XLSX.utils.json_to_sheet(payments);
            XLSX.utils.book_append_sheet(wb, paymentsWS, "Payments");
        }
        
        if (exportFilters.Feedbacks) {
            const feedbacksWS = XLSX.utils.json_to_sheet(feedbacks);
            XLSX.utils.book_append_sheet(wb, feedbacksWS, "Feedbacks");
        }

        if (wb.SheetNames.length > 0) {
            XLSX.writeFile(wb, "liseansyado_filtered_export.xlsx");
        }
    };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1">
                        <ListFilter className="h-4 w-4" />
                        <span>{t("Filter Export")}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t("Select data to export")}</DropdownMenuLabel>
                    {EXPORT_CATEGORIES.map(category => (
                        <DropdownMenuCheckboxItem
                            key={category}
                            checked={exportFilters[category]}
                            onCheckedChange={() => handleExportFilterChange(category)}
                        >
                            {t(category)}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
             <Button onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" /> {t("Export Data")}
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
