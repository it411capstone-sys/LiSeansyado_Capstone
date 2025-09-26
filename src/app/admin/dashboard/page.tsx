
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, MessageSquare, Download, ListFilter, Files, BarChart, FileCheck, FileX, Percent, MoreHorizontal, User, Clock, Search, Folder, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/contexts/language-context";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { useState, useEffect, useMemo } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Registration, VerificationSubmission, Payment, Feedback, Inspection, License, Fisherfolk } from "@/lib/types";
import * as XLSX from 'xlsx';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

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

    return () => {
        unsubRegistrations();
        unsubVerifications();
        unsubPayments();
        unsubFeedbacks();
        unsubInspections();
        unsubLicenses();
        unsubFisherfolk();
    };
  }, []);

  const { totalApprovedRegistrations, approvedVessels, approvedGears } = useMemo(() => {
    const approved = registrations.filter(r => r.status === 'Approved');
    return {
        totalApprovedRegistrations: approved.length,
        approvedVessels: approved.filter(r => r.type === 'Vessel').length,
        approvedGears: approved.filter(r => r.type === 'Gear').length,
    }
  }, [registrations]);
  
  const { totalPending, pendingVessels, pendingGears } = useMemo(() => {
    const pending = registrations.filter(r => r.status === 'Pending');
    return {
        totalPending: pending.length,
        pendingVessels: pending.filter(r => r.type === 'Vessel').length,
        pendingGears: pending.filter(r => r.type === 'Gear').length,
    }
  }, [registrations]);

  const pendingChartData = [
    { name: 'Vessels', value: pendingVessels, fill: 'hsl(var(--primary))' },
    { name: 'Gears', value: pendingGears, fill: 'hsl(var(--accent))' },
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
    
    const registrationHistory = useMemo(() => {
        return registrations.flatMap(reg => 
            reg.history.map(h => ({
                ...h,
                registrationId: reg.id,
                ownerName: reg.ownerName,
                ownerId: reg.ownerId,
            }))
        ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
    }, [registrations]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <div className="flex gap-2">
            <Input placeholder="Search..." className="hidden md:block w-64"/>
            <Button>New Registration</Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-3 bg-gradient-to-br from-primary/80 to-accent/80 text-primary-foreground">
            <CardHeader>
                <CardTitle>Total Registrations</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-5xl font-bold">{totalApprovedRegistrations}</div>
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                        <p className="text-primary-foreground/80">Vessels</p>
                        <p className="font-bold text-lg">{approvedVessels}</p>
                    </div>
                     <div>
                        <p className="text-primary-foreground/80">Gears</p>
                        <p className="font-bold text-lg">{approvedGears}</p>
                    </div>
                </div>
                <div className="h-24 mt-4 opacity-50">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[{v: 1, g: 2}, {v:3, g:1}, {v:2,g:4}]}>
                            <Line type="monotone" dataKey="v" stroke="hsl(var(--primary-foreground))" strokeWidth={2} dot={false} />
                             <Line type="monotone" dataKey="g" stroke="hsl(var(--primary-foreground))" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Pending Registrations</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 items-center">
                    <div>
                        <div className="text-5xl font-bold">{totalPending}</div>
                        <div className="text-sm mt-4">
                             <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <span className="text-muted-foreground">Vessels: </span>
                                <span className="font-bold">{pendingVessels}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-accent" />
                                <span className="text-muted-foreground">Gears: </span>
                                <span className="font-bold">{pendingGears}</span>
                             </div>
                        </div>
                    </div>
                    <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pendingChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={5}>
                                    {pendingChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
        
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                        <MessageSquare className="h-6 w-6 text-primary"/>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{totalFeedbacks}</p>
                        <p className="text-sm text-muted-foreground">Feedbacks</p>
                    </div>
                    <Progress value={(feedbacks.filter(f => f.status === 'Resolved').length / totalFeedbacks) * 100 || 0} className="w-20 h-1.5"/>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Post Stats</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-20 flex items-center justify-center text-muted-foreground text-sm">
                        [Chart Placeholder]
                    </div>
                </CardContent>
            </Card>
        </div>
        
        <div className="lg:col-span-5">
            <Tabs defaultValue="activity">
                <TabsList>
                    <TabsTrigger value="activity">Registration Activity</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                </TabsList>
                <TabsContent value="activity">
                     <Card>
                        <CardContent className="p-0">
                           <Table>
                               <TableHeader>
                                   <TableRow>
                                       <TableHead>Registration</TableHead>
                                       <TableHead>Action</TableHead>
                                       <TableHead>Actor</TableHead>
                                       <TableHead>Date</TableHead>
                                   </TableRow>
                               </TableHeader>
                               <TableBody>
                                   {registrationHistory.map((h, i) => (
                                       <TableRow key={i}>
                                            <TableCell>
                                                <Link href={`/admin/registrations?id=${h.registrationId}`} className="font-medium hover:underline">
                                                    {h.registrationId}
                                                </Link>
                                                <div className="text-xs text-muted-foreground">{h.ownerName}</div>
                                           </TableCell>
                                           <TableCell>
                                                <Badge variant={h.action === 'Approved' ? 'default' : h.action === 'Rejected' ? 'destructive' : 'secondary'}>
                                                    {h.action}
                                                </Badge>
                                           </TableCell>
                                           <TableCell>{h.actor}</TableCell>
                                           <TableCell>{format(new Date(h.date), 'PP')}</TableCell>
                                       </TableRow>
                                   ))}
                               </TableBody>
                           </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="users">
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                               <TableHeader>
                                   <TableRow>
                                       <TableHead>User</TableHead>
                                       <TableHead>Status</TableHead>
                                       <TableHead>Last Activity</TableHead>
                                   </TableRow>
                               </TableHeader>
                               <TableBody>
                                   {fisherfolk.slice(0,5).map(f => (
                                        <TableRow key={f.uid}>
                                            <TableCell className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={f.avatarUrl} />
                                                    <AvatarFallback>{f.displayName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                {f.displayName}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                                            </TableCell>
                                            <TableCell>5 mins ago</TableCell>
                                        </TableRow>
                                   ))}
                               </TableBody>
                           </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Completed Posts</CardTitle>
                </CardHeader>
                 <CardContent>
                    <div className="h-20 flex items-center justify-center text-muted-foreground text-sm">
                        [Placeholder]
                    </div>
                </CardContent>
            </Card>
            <Card>
                 <CardHeader>
                    <CardTitle>Links Shared</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-20 flex items-center justify-center text-muted-foreground text-sm">
                        [Placeholder]
                    </div>
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}
