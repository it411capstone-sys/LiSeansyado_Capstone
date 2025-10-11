
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, MessageSquare, Download, ListFilter, Files, BarChart, FileCheck, FileX, Percent, MoreHorizontal, User, Clock, Search, Folder, CheckCircle2, CalendarCheck, FileText, CalendarClock, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/contexts/language-context";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, formatDistanceToNow } from "date-fns";
import { useState, useEffect, useMemo } from "react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Registration, VerificationSubmission, Payment, Feedback, Inspection, License, Fisherfolk, AdminNotification } from "@/lib/types";
import * as XLSX from 'xlsx';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const EXPORT_CATEGORIES = ["Verifications", "Registrations", "Inspections", "Payments", "Feedbacks"] as const;
type ExportCategory = typeof EXPORT_CATEGORIES[number];

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [verifications, setVerifications] = useState<VerificationSubmission[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [fisherfolk, setFisherfolk] = useState<Fisherfolk[]>([]);
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>([]);
  
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

    const unsubFisherfolk = onSnapshot(collection(db, "fisherfolk"), (snapshot) => {
        const folks: Fisherfolk[] = [];
        snapshot.forEach((doc) => {
            folks.push({ uid: doc.id, ...doc.data() } as Fisherfolk);
        });
        setFisherfolk(folks);
    });

    const unsubAdminNotifications = onSnapshot(query(collection(db, "adminNotifications"), orderBy("date", "desc"), limit(5)), (snapshot) => {
      const notifs: AdminNotification[] = [];
      snapshot.forEach((doc) => {
        notifs.push({ id: doc.id, ...doc.data() } as AdminNotification);
      });
      setAdminNotifications(notifs);
    });

    return () => {
        unsubRegistrations();
        unsubVerifications();
        unsubPayments();
        unsubFeedbacks();
        unsubInspections();
        unsubLicenses();
        unsubFisherfolk();
        unsubAdminNotifications();
    };
  }, []);

  const totalApprovedRegistrations = useMemo(() => {
    return registrations.filter(r => r.status === 'Approved').length;
  }, [registrations]);
  
  const { totalPending, pendingVessels, pendingGears } = useMemo(() => {
    const pending = registrations.filter(r => r.status === 'Pending');
    return {
        totalPending: pending.length,
        pendingVessels: pending.filter(r => r.type === 'Vessel').length,
        pendingGears: pending.filter(r => r.type === 'Gear').length,
    }
  }, [registrations]);

  const monthlyRegistrationData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data: { month: string; Vessels: number; Gears: number }[] = months.map(m => ({ month: m, Vessels: 0, Gears: 0 }));

    registrations.forEach(reg => {
      if (reg.registrationDate) {
        const monthIndex = new Date(reg.registrationDate).getMonth();
        if (data[monthIndex]) {
          if (reg.type === 'Vessel') {
            data[monthIndex].Vessels++;
          } else if (reg.type === 'Gear') {
            data[monthIndex].Gears++;
          }
        }
      }
    });

    return data;
  }, [registrations]);


  const pendingChartData = [
    { name: 'Vessels', value: pendingVessels, fill: 'hsl(var(--chart-1))' },
    { name: 'Gears', value: pendingGears, fill: 'hsl(var(--chart-2))' },
  ];

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
    
    const upcomingInspections = useMemo(() => 
        inspections.filter(i => i.status === 'Scheduled' && new Date(i.scheduledDate) > new Date())
                   .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    , [inspections]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <div className="flex items-center gap-2">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1">
                        <ListFilter className="h-4 w-4" />
                        <span>Filter by</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter Export Data</DropdownMenuLabel>
                    {EXPORT_CATEGORIES.map(category => (
                        <DropdownMenuCheckboxItem
                            key={category}
                            checked={exportFilters[category]}
                            onCheckedChange={() => handleExportFilterChange(category)}
                        >
                            {category}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" /> Export
            </Button>
        </div>
      </div>
      
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Link href="/admin/registrations?status=Approved" className="transform hover:-translate-y-1 transition-transform duration-300">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
                <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalApprovedRegistrations}</div>
            </CardContent>
            </Card>
        </Link>
        <Link href="/admin/registrations?status=Pending" className="transform hover:-translate-y-1 transition-transform duration-300">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Registrations</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalPending}</div>
            </CardContent>
            </Card>
        </Link>
        <Link href="/admin/inspections?status=Scheduled" className="transform hover:-translate-y-1 transition-transform duration-300">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Inspections</CardTitle>
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{upcomingInspections.length}</div>
            </CardContent>
            </Card>
        </Link>
        <Link href="/admin/licenses" className="transform hover:-translate-y-1 transition-transform duration-300">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Issued Licenses</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{licenses.length}</div>
            </CardContent>
            </Card>
        </Link>
        <Link href="/admin/feedbacks" className="transform hover:-translate-y-1 transition-transform duration-300">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Feedbacks</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalFeedbacks}</div>
            </CardContent>
            </Card>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
            <CardHeader>
                <CardTitle>Registration Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyRegistrationData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" />
                             <XAxis dataKey="month" stroke="hsl(var(--foreground), 0.7)" fontSize={12} tickLine={false} axisLine={false} />
                             <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))'
                                }}
                             />
                            <Legend wrapperStyle={{fontSize: "0.8rem", paddingTop: '10px'}}/>
                            <Line type="monotone" dataKey="Vessels" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--chart-1))" }} />
                            <Line type="monotone" dataKey="Gears" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--chart-2))" }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
        
        <div className="lg:col-span-3">
            <Tabs defaultValue="notifications">
                <TabsList>
                    <TabsTrigger value="notifications">Recent Notifications</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                </TabsList>
                <TabsContent value="notifications">
                     <Card>
                        <CardContent className="p-0">
                           <ScrollArea className="h-[28.75rem] md:h-[26rem] lg:h-[28.75rem]">
                               <Table>
                                   <TableHeader>
                                       <TableRow>
                                           <TableHead>Notification</TableHead>
                                           <TableHead>Date</TableHead>
                                       </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                       {adminNotifications.map((notif, i) => (
                                           <TableRow key={i}>
                                                <TableCell>
                                                    <Link href={notif.link} className="font-medium hover:underline">
                                                        {notif.title}
                                                    </Link>
                                                    <div className="text-xs text-muted-foreground">{notif.message}</div>
                                               </TableCell>
                                               <TableCell className="text-xs">{formatDistanceToNow(new Date(notif.date), { addSuffix: true })}</TableCell>
                                           </TableRow>
                                       ))}
                                   </TableBody>
                               </Table>
                           </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="users">
                    <Card>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[28.75rem] md:h-[26rem] lg:h-[28.75rem]">
                                <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Last Activity</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fisherfolk.map(f => (
                                            <TableRow key={f.uid}>
                                                <TableCell className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={f.avatarUrl} />
                                                        <AvatarFallback>{f.displayName ? f.displayName.charAt(0) : 'U'}</AvatarFallback>
                                                    </Avatar>
                                                    {f.displayName}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {f.lastActivity ? formatDistanceToNow(new Date(f.lastActivity), { addSuffix: true }) : 'N/A'}
                                                </TableCell>
                                            </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                           </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  );
}
