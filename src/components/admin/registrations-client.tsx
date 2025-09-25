

'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Registration, Fisherfolk } from "@/lib/types";
import { ListFilter, Search, Check, X, Bell, FileText, Mail, Phone, Home, RefreshCcw, FilePen, Calendar as CalendarIcon, MoreHorizontal, ShieldCheck, ShieldX, Clock, UserPlus, ArrowUpDown } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { format, addYears, setHours, setMinutes, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { Separator } from '../ui/separator';
import { useTranslation } from '@/contexts/language-context';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { useInspections } from '@/contexts/inspections-context';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc, addDoc, getDocs, query, where } from "firebase/firestore";

interface RegistrationsClientProps {
}

const monthMap: { [key: string]: number } = {
  "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5, 
  "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11
};

const inspectorsList = [
    { name: 'Inspector Dela Cruz', id: 'insp-001' },
    { name: 'Inspector Reyes', id: 'insp-002' },
    { name: 'Inspector Santos', id: 'insp-003' },
];


export function RegistrationsClient({}: RegistrationsClientProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { inspections, addInspection } = useInspections();
  
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [fisherfolk, setFisherfolk] = useState<Record<string, Fisherfolk>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [inspectionDates, setInspectionDates] = useState<Record<string, Date | undefined>>({});
  const [inspectionTimes, setInspectionTimes] = useState<Record<string, string>>({});
  const [inspectionAssignees, setInspectionAssignees] = useState<Record<string, string>>({});
  const [notificationReg, setNotificationReg] = useState<Registration | null>(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<'general' | 'inspection'>('general');
  const [submittedSchedules, setSubmittedSchedules] = useState<Record<string, boolean>>({});
  const [currentAssignee, setCurrentAssignee] = useState<string>('');
  const [scheduleConflict, setScheduleConflict] = useState<Registration | null>(null);
  const [conflictMessage, setConflictMessage] = useState('');
  const [isAssignInspectorOpen, setIsAssignInspectorOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>("date-desc");

  useEffect(() => {
    const unsubRegistrations = onSnapshot(collection(db, "registrations"), (snapshot) => {
        const regs: Registration[] = [];
        snapshot.forEach(doc => regs.push({ id: doc.id, ...doc.data() } as Registration));
        setRegistrations(regs);
    });
    
    const unsubFisherfolk = onSnapshot(collection(db, "fisherfolk"), (snapshot) => {
        const folk: Record<string, Fisherfolk> = {};
        snapshot.forEach(doc => folk[doc.id] = { uid: doc.id, ...doc.data() } as Fisherfolk);
        setFisherfolk(folk);
    });

    return () => {
        unsubRegistrations();
        unsubFisherfolk();
    };
  }, []);

  const filteredData = useMemo(() => {
    let filtered = registrations.filter((reg) => {
        const registrationDate = new Date(reg.registrationDate);
        const matchesSearch =
          (reg.ownerName && reg.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (reg.vesselName && reg.vesselName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (reg.id && reg.id.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const isExpiring = statusFilters.includes('Expiring') && new Date(reg.expiryDate) < new Date(new Date().setMonth(new Date().getMonth() + 1)) && reg.status === 'Approved';

        const matchesStatus =
          statusFilters.length === 0 || statusFilters.includes(reg.status) || isExpiring;
        
        const matchesType =
          typeFilters.length === 0 || typeFilters.includes(reg.type);

        const matchesDate = 
          !dateFilter || registrationDate.toDateString() === dateFilter.toDateString();

        return matchesSearch && matchesStatus && matchesType && matchesDate;
    });

    return filtered.sort((a, b) => {
        switch(sortOption) {
            case 'date-desc':
                return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime();
            case 'date-asc':
                return new Date(a.registrationDate).getTime() - new Date(b.registrationDate).getTime();
            case 'owner-asc':
                return a.ownerName.localeCompare(b.ownerName);
            case 'owner-desc':
                return b.ownerName.localeCompare(a.ownerName);
            default:
                return 0;
        }
    });

  }, [registrations, searchTerm, statusFilters, typeFilters, dateFilter, sortOption]);

  const handleStatusFilterChange = (status: string) => {
    setStatusFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };
  
  const handleTypeFilterChange = (type: string) => {
    setTypeFilters((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const updateRegistrationStatus = async (id: string, status: 'Approved' | 'Rejected', actor: string = 'Admin') => {
    const regRef = doc(db, "registrations", id);
    const reg = registrations.find(r => r.id === id);
    if (reg) {
        const newHistory = [...reg.history, {
            action: status,
            date: new Date().toISOString().split('T')[0],
            actor: actor
        }];
        try {
            await updateDoc(regRef, { status, history: newHistory });

            if (status === 'Approved' && actor === 'Admin') { // Only auto-create inspection if manually approved
                await addDoc(collection(db, "inspections"), {
                    registrationId: reg.id,
                    vesselName: reg.vesselName,
                    inspector: "Not Assigned",
                    scheduledDate: new Date(),
                    status: 'Pending',
                    checklist: null,
                    inspectorNotes: null,
                    photos: null,
                });
                toast({
                    title: `Registration Approved`,
                    description: `An inspection for ${reg.id} has been created.`,
                });
            } else {
                toast({
                    title: `Registration ${status}`,
                    description: `Registration ID ${id} has been ${status.toLowerCase()}.`,
                });
            }
        } catch (error) {
            console.error("Error updating registration status: ", error);
            toast({ variant: "destructive", title: "Update Failed" });
        }
    }
  };

  const scheduleInspection = (reg: Registration) => {
      let inspectionDate = inspectionDates[reg.id];
      const inspectionTime = inspectionTimes[reg.id];
      const assignee = inspectionAssignees[reg.id] || "Not Assigned";

      if (inspectionDate) {
          if (inspectionTime) {
              const [hours, minutes] = inspectionTime.split(':').map(Number);
              inspectionDate = setHours(setMinutes(inspectionDate, minutes), hours);
          }
          
          addInspection({
              registrationId: reg.id,
              vesselName: reg.vesselName,
              inspector: assignee,
              scheduledDate: inspectionDate,
          });
          setSubmittedSchedules(prev => ({...prev, [reg.id]: true}));
          toast({title: "Schedule Submitted", description: `Inspection for ${reg.vesselName} scheduled.`});
          
          // Automatically approve the registration
          if (reg.status === 'Pending') {
              updateRegistrationStatus(reg.id, 'Approved', 'System (Auto)');
          }
      }
  }

  const handleScheduleSubmit = (reg: Registration) => {
    let inspectionDate = inspectionDates[reg.id];
    const inspectionTime = inspectionTimes[reg.id];
    const assignee = inspectionAssignees[reg.id] || "Not Assigned";

    if (inspectionDate && inspectionTime) {
        const [hours, minutes] = inspectionTime.split(':').map(Number);
        const proposedDateTime = setHours(setMinutes(inspectionDate, minutes), hours);

        const conflict = inspections.find(
            (insp) =>
            insp.inspector === assignee &&
            insp.scheduledDate.getTime() === proposedDateTime.getTime()
        );

        if (conflict) {
            setConflictMessage(`Inspector ${assignee} already has an inspection for "${conflict.vesselName}" (${conflict.registrationId}) scheduled at this exact time.`);
            setScheduleConflict(reg);
            return;
        }
    }
    
    scheduleInspection(reg);
  };

  const handleSendNotification = async (id: string) => {
      if (!notificationReg) return;
      try {
        await addDoc(collection(db, "notifications"), {
            userId: notificationReg.email,
            date: new Date().toISOString(),
            title: notificationType === 'inspection' ? "Inspection Scheduled" : "Registration Update",
            message: notificationMessage,
            isRead: false,
            type: 'Info'
        });
        toast({
            title: "Notification Sent",
            description: `A notification has been sent for Registration ID ${id}.`,
        });
      } catch (error) {
          console.error("Error sending notification:", error);
          toast({ variant: "destructive", title: "Failed to send notification" });
      }
      setNotificationReg(null);
  }

  const openNotificationDialog = (reg: Registration, type: 'general' | 'inspection') => {
      setNotificationReg(reg);
      setNotificationType(type);
      
      let bodyMessage = "";
      const salutation = `Dear ${reg.ownerName},\n\n`;
      const signature = `\n\nThank you,\nLiSEAnsyado Admin`;

      if (type === 'inspection') {
        let inspectionDate = inspectionDates[reg.id];
        const inspectionTime = inspectionTimes[reg.id];
        if (inspectionDate) {
            if (inspectionTime) {
                const [hours, minutes] = inspectionTime.split(':').map(Number);
                inspectionDate = setHours(setMinutes(inspectionDate, minutes), hours);
            }
            bodyMessage = t("Your inspection is scheduled for {date}. Please be prepared with all necessary documents and equipment.").replace('{date}', format(inspectionDate, "PPp"));
        }
      } else {
          switch (reg.status) {
              case 'Approved':
                  bodyMessage = t("Good news! Your registration has been approved. You may now proceed with the next steps.");
                  break;
              case 'Rejected':
                  bodyMessage = t("We regret to inform you that your registration has been rejected. Please review the requirements and try again.");
                  break;
              case 'Expired':
                  bodyMessage = t("Your license has expired. Please renew it as soon as possible to avoid penalties or disruptions in your fishing activities.");
                  break;
              default:
                  bodyMessage = t("This is a friendly reminder regarding your registration for \"{vesselName}\" ({id}). Please review any pending actions or requirements.").replace('{vesselName}', reg.vesselName).replace('{id}', reg.id);
                  break;
          }
      }
      
      setNotificationMessage(`${salutation}${bodyMessage}${signature}`);
  }

  const handleAssignInspector = () => {
      if (selectedRegistration) {
          setInspectionAssignees(prev => ({ ...prev, [selectedRegistration.id]: currentAssignee }));
          setIsAssignInspectorOpen(false);
      }
  };

  const allStatuses: (Registration['status'] | 'Expiring')[] = ['Approved', 'Pending', 'Rejected', 'Expired', 'Expiring'];
  const allTypes: Registration['type'][] = ['Vessel', 'Gear'];

  const getStatusBadgeVariant = (status: Registration['status']) => {
    switch (status) {
      case 'Approved':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Rejected':
      case 'Expired':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getOwnerAvatar = (ownerId: string) => {
    return fisherfolk[ownerId]?.avatarUrl || `https://i.pravatar.cc/150?u=${ownerId}`;
  };

  useEffect(() => {
    if (selectedRegistration) {
        const updatedSelection = registrations.find(r => r.id === selectedRegistration.id);
        setSelectedRegistration(updatedSelection || null);
    }
  }, [registrations, selectedRegistration?.id]);

  return (
    <Dialog open={isAssignInspectorOpen} onOpenChange={setIsAssignInspectorOpen}>
    <AlertDialog open={!!scheduleConflict || !!notificationReg} onOpenChange={(open) => {
        if (!open) {
            setScheduleConflict(null);
            setNotificationReg(null);
        }
    }}>
    <div className='space-y-4'>
      <div className="grid md:grid-cols-5 gap-8">
        <div className='space-y-4 md:col-span-3'>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                            <CardTitle>{t("Registrations")}</CardTitle>
                            <CardDescription>{t("Manage and review all fisherfolk registrations.")}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                           <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-1">
                                        <ListFilter className="h-4 w-4" />
                                        <span>{t("Filter by Status")}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>{t("Filter by Status")}</DropdownMenuLabel>
                                    {allStatuses.map(status => (
                                        <DropdownMenuCheckboxItem
                                            key={status}
                                            checked={statusFilters.includes(status)}
                                            onCheckedChange={() => handleStatusFilterChange(status)}
                                        >
                                            {t(status)}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-1">
                                        <ArrowUpDown className="h-4 w-4" />
                                        <span>{t("Arrange by")}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>{t("Sort by")}</DropdownMenuLabel>
                                    <DropdownMenuItem onSelect={() => setSortOption('date-desc')}>{t("Date: Newest")}</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setSortOption('date-asc')}>{t("Date: Oldest")}</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setSortOption('owner-asc')}>{t("Owner: A-Z")}</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setSortOption('owner-desc')}>{t("Owner: Z-A")}</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                     <div className="relative pt-4">
                        <Search className="absolute left-2.5 top-6.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t("Search by Owner or Vessel ID...")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 w-full"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>{t("Owner Name")}</TableHead>
                            <TableHead>{t("Vessel/Gear ID")}</TableHead>
                            <TableHead>{t("Status")}</TableHead>
                            <TableHead>{t("Inspection Details")}</TableHead>
                            <TableHead className="text-right">{t("Actions")}</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map((reg) => {
                                const scheduledInspection = inspections.find(insp => insp.registrationId === reg.id);
                                return (
                                <TableRow key={reg.id} onClick={() => setSelectedRegistration(reg)} className='cursor-pointer' data-state={selectedRegistration?.id === reg.id && 'selected'}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={getOwnerAvatar(reg.ownerId)} alt={reg.ownerName || 'U'} />
                                            <AvatarFallback>{reg.ownerName ? reg.ownerName.charAt(0) : 'U'}</AvatarFallback>
                                        </Avatar>
                                        {reg.ownerName || "Unknown Owner"}
                                    </TableCell>
                                    <TableCell>{reg.id}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(reg.status)} className="capitalize">
                                            {t(reg.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {scheduledInspection ? (
                                            <div className="text-xs">
                                                <p>{format(scheduledInspection.scheduledDate, 'PPp')}</p>
                                                <p className="text-muted-foreground">{scheduledInspection.inspector}</p>
                                            </div>
                                        ) : <span className="text-muted-foreground">Not set</span>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onSelect={() => updateRegistrationStatus(reg.id, 'Approved')}>{t("Approve")}</DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => updateRegistrationStatus(reg.id, 'Rejected')}>{t("Reject")}</DropdownMenuItem>
                                                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); openNotificationDialog(reg, 'general'); }}>{t("Send Notification")}</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    {t("No results found.")}
                                </TableCell>
                            </TableRow>
                        )}
                        </TableBody>
                    </Table>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex justify-between items-center text-sm text-muted-foreground w-full">
                        <p>{t("Showing 1-")}{filteredData.length < 10 ? filteredData.length : 10}{t(" of ")}{filteredData.length}{t(" records")}</p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">{'<'}</Button>
                            <Button variant="outline" size="sm">1</Button>
                            <Button variant="outline" size="sm">{'>'}</Button>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
        <div className='space-y-4 md:col-span-2'>
            {selectedRegistration ? (
                 
                <Card className="overflow-hidden">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={getOwnerAvatar(selectedRegistration.ownerId)} alt={selectedRegistration.ownerName} />
                                    <AvatarFallback>{selectedRegistration.ownerName ? selectedRegistration.ownerName.charAt(0) : 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-0.5">
                                    <p className="font-bold text-lg">{selectedRegistration.ownerName || "Unknown Owner"}</p>
                                    <p className="text-sm text-muted-foreground">{selectedRegistration.id}</p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-4 text-sm">
                        <div className="text-muted-foreground space-y-2">
                             <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4"/>
                                <span>{selectedRegistration.email}</span>
                            </div>
                                <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4"/>
                                <span>{selectedRegistration.contact}</span>
                            </div>
                                <div className="flex items-center gap-2">
                                <Home className="h-4 w-4"/>
                                <span>{selectedRegistration.address}</span>
                            </div>
                        </div>

                        <Separator/>
                        
                         <div>
                            <h4 className="font-semibold mb-2 text-foreground">{t("Verification Status")}</h4>
                             <div className='grid grid-cols-2 gap-2'>
                                <Link href={`/admin/verification?name=${encodeURIComponent(selectedRegistration.ownerName)}`} passHref>
                                    <Badge variant={selectedRegistration.boatrVerified ? 'default' : 'destructive'} className='gap-1 w-full justify-center cursor-pointer'>
                                        {selectedRegistration.boatrVerified ? <ShieldCheck className="h-3.5 w-3.5"/> : <ShieldX className="h-3.5 w-3.5"/>}
                                        {t(selectedRegistration.boatrVerified ? 'BoatR Verified' : 'BoatR Unverified')}
                                    </Badge>
                                </Link>
                                <Link href={`/admin/verification?name=${encodeURIComponent(selectedRegistration.ownerName)}`} passHref>
                                     <Badge variant={selectedRegistration.fishrVerified ? 'default' : 'destructive'} className='gap-1 w-full justify-center cursor-pointer'>
                                        {selectedRegistration.fishrVerified ? <ShieldCheck className="h-3.5 w-3.5"/> : <ShieldX className="h-3.5 w-3.5"/>}
                                        {t(selectedRegistration.fishrVerified ? 'FishR Verified' : 'FishR Unverified')}
                                    </Badge>
                                </Link>
                             </div>
                        </div>
                        
                         <div>
                            <h4 className="font-semibold mb-2 text-foreground">{t("Gear/Vessel Photos")}</h4>
                            {selectedRegistration.photos && selectedRegistration.photos.length > 0 ? (
                                <Carousel className="w-full">
                                <CarouselContent>
                                    {selectedRegistration.photos.map((photo, index) => (
                                    <CarouselItem key={index}>
                                        <div className="p-1">
                                        <Card>
                                            <CardContent className="flex aspect-video items-center justify-center p-0">
                                                <Image src={photo} width={400} height={225} alt={`Registered Photo ${index + 1}`} className="rounded-md object-cover"/>
                                            </CardContent>
                                        </Card>
                                        </div>
                                    </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="-left-4"/>
                                <CarouselNext className="-right-4" />
                                </Carousel>
                            ) : (
                                <div className='text-center text-muted-foreground p-4 border-dashed border rounded-md'>{t("No photos uploaded.")}</div>
                            )}
                        </div>
                         <div>
                            <p className="text-xs text-muted-foreground">{t("Type")}</p>
                            <p className="font-medium">{t(selectedRegistration.type)}</p>
                        </div>
                        
                        <div className="grid gap-2">
                            <div>
                                <p className="text-xs text-muted-foreground">{t("Status")}</p>
                                <div className="flex items-center gap-2">
                                    <Badge variant={getStatusBadgeVariant(selectedRegistration.status)} className="capitalize text-sm">{t(selectedRegistration.status)}</Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className='h-4 w-4'/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                            <DropdownMenuItem onSelect={() => updateRegistrationStatus(selectedRegistration.id, 'Approved')}>{t("Approve")}</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => updateRegistrationStatus(selectedRegistration.id, 'Rejected')}>{t("Reject")}</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); openNotificationDialog(selectedRegistration, 'general'); }}>
                                                <Bell className="mr-2 h-4 w-4"/> {t("Send Notification")}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">{t("Registration Date")}</p>
                                <p className="font-medium">{selectedRegistration.registrationDate}</p>
                            </div>
                            {selectedRegistration.history.find(h => h.action === 'Approved') && (
                                <div>
                                    <p className="text-xs text-muted-foreground">{t("Approval Date")}</p>
                                    <p className="font-medium">{selectedRegistration.history.find(h => h.action === 'Approved')?.date}</p>
                                </div>
                            )}
                            {selectedRegistration.status === 'Approved' && (
                                <div>
                                    <p className="text-xs text-muted-foreground">{t("Expiration Date")}</p>
                                    <p className="font-medium">{selectedRegistration.expiryDate}</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <h4 className='font-semibold mb-2 text-foreground'>{t("History Log")}</h4>
                            <div className="space-y-2 text-sm text-muted-foreground border-l-2 border-primary/20 pl-4">
                                {selectedRegistration.history.map((log, index) => {
                                    const Icon = log.action === 'Inspected' ? CalendarIcon : log.action === 'Renewed' ? RefreshCcw : FilePen;
                                    return (
                                        <div key={index} className='flex items-start gap-3 relative'>
                                             <div className="absolute -left-[27px] mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                                                <Icon className='h-3 w-3 text-primary' />
                                             </div>
                                            <span>{t(log.action)}{t(" on ")}{log.date}{t(" by ")}{log.actor}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </CardContent>    
                    <CardFooter className="flex flex-col items-stretch gap-2 p-6 pt-0">
                         <div className="flex gap-2 w-full">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button 
                                        variant={"outline"} 
                                        className={cn(
                                            "w-full justify-start text-left font-normal", 
                                            !inspectionDates[selectedRegistration.id] && "text-muted-foreground",
                                            submittedSchedules[selectedRegistration.id] && "bg-green-500/10 border-green-500/50 text-green-700 hover:bg-green-500/20"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {inspectionDates[selectedRegistration.id] ? format(inspectionDates[selectedRegistration.id]!, "PPP") : <span>{t("Schedule Inspection")}</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar 
                                        mode="single"
                                        selected={inspectionDates[selectedRegistration.id]}
                                        onSelect={(date) => {
                                            setInspectionDates(prev => ({...prev, [selectedRegistration.id]: date}));
                                            setSubmittedSchedules(prev => ({...prev, [selectedRegistration.id]: false}));
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <Input
                                type="time"
                                className="w-32"
                                value={inspectionTimes[selectedRegistration.id] || ''}
                                onChange={(e) => {
                                    setInspectionTimes(prev => ({...prev, [selectedRegistration.id]: e.target.value}));
                                    setSubmittedSchedules(prev => ({...prev, [selectedRegistration.id]: false}));
                                }}
                            />
                         </div>
                         <div className="flex gap-2 w-full">
                            <DialogTrigger asChild>
                                <Button variant="outline" className='w-full justify-start text-left font-normal' onClick={() => setCurrentAssignee(inspectionAssignees[selectedRegistration.id] || '')}>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    {inspectionAssignees[selectedRegistration.id] || "Assign Inspector"}
                                </Button>
                            </DialogTrigger>
                            <Button 
                                size="icon"
                                variant="secondary" 
                                disabled={!inspectionDates[selectedRegistration.id] || submittedSchedules[selectedRegistration.id]} 
                                onClick={() => handleScheduleSubmit(selectedRegistration)}
                            >
                                <Check className="h-4 w-4" />
                                <span className="sr-only">Submit</span>
                            </Button>
                         </div>
                         <Button 
                            variant="ghost" 
                            className='w-full justify-center'
                            disabled={!inspectionDates[selectedRegistration.id]} 
                            onClick={() => openNotificationDialog(selectedRegistration, 'inspection')}
                        >
                            <Bell className="mr-2 h-4 w-4"/>
                            {t("Notify")}
                        </Button>
                    </CardFooter>
                </Card>
                 
            ) : (
                <Card>
                    <CardContent className='p-6 h-full flex flex-col items-center justify-center text-center'>
                        <FileText className="h-12 w-12 text-muted-foreground" />
                        <CardTitle className='mt-4'>{t("No Registration Selected")}</CardTitle>
                        <CardDescription className='mt-2'>{t("Click on a registration from the list to view its details here.")}</CardDescription>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
      <AlertDialogContent>
        {notificationReg ? (
            <>
                <AlertDialogHeader>
                    <AlertDialogTitle>{notificationType === 'inspection' ? t("Notify of Inspection") : t("Send Notification")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {notificationType === 'inspection' ? 
                            t("Customize and send an inspection notification to {ownerName} for {vesselName} ({id}).").replace('{ownerName}', notificationReg.ownerName).replace('{vesselName}', notificationReg.vesselName).replace('{id}', notificationReg.id)
                            : `Edit the message below and send a notification to ${notificationReg.ownerName} for ${notificationReg.vesselName} (${notificationReg.id}).`
                        }
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-2">
                    <Label htmlFor="notification-message" className="sr-only">Notification Message</Label>
                    <Textarea
                        id="notification-message"
                        value={notificationMessage}
                        onChange={(e) => setNotificationMessage(e.target.value)}
                        rows={6}
                        className="text-sm"
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setNotificationReg(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleSendNotification(notificationReg.id)}>Send Notification</AlertDialogAction>
                </AlertDialogFooter>
            </>
        ) : scheduleConflict ? (
            <>
                <AlertDialogHeader>
                    <AlertDialogTitle>Schedule Conflict</AlertDialogTitle>
                    <AlertDialogDescription>
                        {conflictMessage}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setScheduleConflict(null)}>
                        OK
                    </AlertDialogAction>
                </AlertDialogFooter>
            </>
        ) : null}
    </AlertDialogContent>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Assign Inspector</DialogTitle>
            <DialogDescription>Select an inspector to assign to this registration.</DialogDescription>
        </DialogHeader>
        <RadioGroup value={currentAssignee} onValueChange={setCurrentAssignee} className="space-y-2">
            {inspectorsList.map(inspector => (
                <div key={inspector.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={inspector.name} id={inspector.id} />
                    <Label htmlFor={inspector.id}>{inspector.name}</Label>
                </div>
            ))}
        </RadioGroup>
        <Button onClick={handleAssignInspector}>Assign</Button>
    </DialogContent>
    </div>
    </AlertDialog>
    </Dialog>
  );
}


    