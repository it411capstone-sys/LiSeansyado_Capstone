
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, MessageSquare, Download, ListFilter, Files, BarChart, FileCheck, FileX, Percent } from "lucide-react";
import { useTranslation } from "@/contexts/language-context";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { useState, useEffect, useMemo } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Registration, VerificationSubmission, Payment, Feedback, Inspection, License } from "@/lib/types";
import * as XLSX from 'xlsx';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EXPORT_CATEGORIES = ["Verifications", "Registrations", "Inspections", "Payments", "Feedbacks"] as const;
type ExportCategory = typeof EXPORT_CATEGORIES[number];

const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i));

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [verifications, setVerifications] = useState<VerificationSubmission[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  
  const [selectedMonth, setSelectedMonth] = useState<string>(String(new Date().getMonth()));
  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));

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

    const unsubLicenses = onSnapshot(collection(db, "licenses"), (snapshot) => {
        const lics: License[] = [];
        snapshot.forEach((doc) => {
            lics.push({ id: doc.id, ...doc.data() } as License);
        });
        setLicenses(lics);
    });

    return () => {
        unsubRegistrations();
        unsubVerifications();
        unsubPayments();
        unsubFeedbacks();
        unsubInspections();
        unsubLicenses();
    };
  }, []);

  const filteredPeriodRegistrations = useMemo(() => {
    return registrations.filter(reg => {
        const regDate = new Date(reg.registrationDate);
        return regDate.getMonth() === parseInt(selectedMonth) && regDate.getFullYear() === parseInt(selectedYear);
    });
  }, [registrations, selectedMonth, selectedYear]);

  const periodStats = useMemo(() => {
    const total = filteredPeriodRegistrations.length;
    const vessels = filteredPeriodRegistrations.filter(r => r.type === 'Vessel').length;
    const gears = filteredPeriodRegistrations.filter(r => r.type === 'Gear').length;
    const approved = filteredPeriodRegistrations.filter(r => r.status === 'Approved').length;
    const approvalRate = total > 0 ? (approved / total) * 100 : 0;

    return { total, vessels, gears, approvalRate };
  }, [filteredPeriodRegistrations]);


  const totalApprovedRegistrations = registrations.filter(r => r.status === 'Approved').length;
  const totalLicenses = licenses.length;
  const totalFeedbacks = feedbacks.length;
  

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
      
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/registrations?status=Approved">
            <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("Registered Gears/Vessels")}</CardTitle>
                <Files className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalApprovedRegistrations}</div>
                <p className="text-xs text-muted-foreground">&nbsp;</p>
            </CardContent>
            </Card>
        </Link>
        <Link href="/admin/licenses">
            <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("Licensed Gears/Vessels")}</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalLicenses}</div>
                <p className="text-xs text-muted-foreground">&nbsp;</p>
            </CardContent>
            </Card>
        </Link>
        <Link href="/admin/feedbacks">
            <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("Feedbacks")}</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalFeedbacks}</div>
                <p className="text-xs text-muted-foreground">&nbsp;</p>
            </CardContent>
            </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t("Registration Overview")}</CardTitle>
            <CardDescription>{t("Monthly registration trends.")}</CardDescription>
             <div className="flex items-center gap-2 pt-2">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map((month, index) => (
                            <SelectItem key={month} value={String(index)}>{month}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                     <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                         {years.map(year => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
             </div>
          </CardHeader>
          <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                            <Files className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{periodStats.total}</div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Vessel vs. Gear</CardTitle>
                            <BarChart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{periodStats.vessels} <span className="text-sm text-muted-foreground">Vessels</span> / {periodStats.gears} <span className="text-sm text-muted-foreground">Gears</span></div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approved</CardTitle>
                            <FileCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{filteredPeriodRegistrations.filter(r => r.status === 'Approved').length}</div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                            <Percent className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{periodStats.approvalRate.toFixed(1)}%</div>
                        </CardContent>
                    </Card>
                </div>
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
