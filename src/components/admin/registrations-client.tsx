

'use client';
import { useState } from 'react';
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
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Registration } from "@/lib/data";
import { ListFilter, Search, Check, X, Bell, FileTextIcon, Mail, Phone, Home, RefreshCcw, FilePen, Calendar as CalendarIcon, MoreHorizontal, ShieldCheck, ShieldX } from 'lucide-react';
import Image from 'next/image';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { Separator } from '../ui/separator';
import { useTranslation } from '@/contexts/language-context';

interface RegistrationsClientProps {
  data: Registration[];
}

export function RegistrationsClient({ data }: RegistrationsClientProps) {
  const { t } = useTranslation([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(data[0] || null);
  const [inspectionDate, setInspectionDate] = useState<Date | undefined>();


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

  const filteredData = data.filter((reg) => {
    const matchesSearch =
      reg.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.vesselName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      statusFilters.length === 0 || statusFilters.includes(reg.status);
    
    const matchesType =
      typeFilters.length === 0 || typeFilters.includes(reg.type);

    const matchesDate = 
      !dateFilter || new Date(reg.registrationDate).toDateString() === dateFilter.toDateString();

    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const allStatuses: Registration['status'][] = ['Approved', 'Pending', 'Rejected', 'Expired'];
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


  return (
    <div className='space-y-4'>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                <div className="relative flex-1 w-full min-w-[150px] md:max-w-xs">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t("Search by Owner or Vessel ID...")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-full"
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-1 flex-shrink-0">
                        <ListFilter className="h-3.5 w-3.5" />
                        <span>{t("Status: ")} {statusFilters.length ? statusFilters.map(s => t(s)).join(', ') : t('All')}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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

                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "gap-1 flex-shrink-0 justify-start text-left font-normal",
                        !dateFilter && "text-muted-foreground"
                        )}
                    >
                         <ListFilter className="h-3.5 w-3.5" />
                        {dateFilter ? format(dateFilter, "PPP") : <span>{t("Date")}</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={dateFilter}
                        onSelect={setDateFilter}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-1 flex-shrink-0">
                        <ListFilter className="h-3.5 w-3.5" />
                        <span>{t("Type: ")} {typeFilters.length ? typeFilters.map(type => t(type)).join(', ') : t('All')}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {allTypes.map(type => (
                            <DropdownMenuCheckboxItem
                                key={type}
                                checked={typeFilters.includes(type)}
                                onCheckedChange={() => handleTypeFilterChange(type)}
                            >
                                {t(type)}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

      <div className="grid md:grid-cols-5 gap-8">
        <div className='space-y-4 md:col-span-3'>
            <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead padding="checkbox">
                    <Checkbox />
                    </TableHead>
                    <TableHead>{t("Owner Name")}</TableHead>
                    <TableHead>{t("Vessel/Gear ID")}</TableHead>
                    <TableHead>{t("Status")}</TableHead>
                    <TableHead className="text-right">{t("Actions")}</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredData.length > 0 ? (
                    filteredData.map((reg) => (
                        <TableRow key={reg.id} onClick={() => setSelectedRegistration(reg)} className='cursor-pointer' data-state={selectedRegistration?.id === reg.id && 'selected'}>
                        <TableCell padding="checkbox">
                            <Checkbox />
                        </TableCell>
                        <TableCell className="font-medium flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={reg.avatar} alt={reg.ownerName} />
                                <AvatarFallback>{reg.ownerName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {reg.ownerName}
                        </TableCell>
                        <TableCell>{reg.id}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusBadgeVariant(reg.status)} className="capitalize">
                                {t(reg.status)}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="ghost">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>{t("Approve")}</DropdownMenuItem>
                                    <DropdownMenuItem>{t("Reject")}</DropdownMenuItem>
                                    <DropdownMenuItem>{t("Send Reminder")}</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    ))
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
            <div className="flex justify-between items-center text-sm text-muted-foreground">
                <p>{t("Showing 1-")}{filteredData.length < 10 ? filteredData.length : 10}{t(" of ")}{filteredData.length}{t(" records")}</p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">{'<'}</Button>
                    <Button variant="outline" size="sm">1</Button>
                    <Button variant="outline" size="sm">{'>'}</Button>
                </div>
            </div>
        </div>
        <div className='space-y-4 md:col-span-2'>
            {selectedRegistration ? (
                <Card className="overflow-hidden">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={selectedRegistration.avatar} alt={selectedRegistration.ownerName} />
                                    <AvatarFallback>{selectedRegistration.ownerName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-0.5">
                                    <p className="font-bold text-lg">{selectedRegistration.ownerName}</p>
                                    <p className="text-sm text-muted-foreground">{selectedRegistration.id}</p>
                                </div>
                            </div>
                             <div className='flex flex-col items-center p-2 border rounded-md bg-muted/20 flex-shrink-0'>
                                <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${selectedRegistration.id}`} width={80} height={80} alt={`QR Code for ${selectedRegistration.id}`} />
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
                            <h4 className="font-semibold mb-2 text-foreground">{t("Verification Status")}</h4>
                             <div className='grid grid-cols-2 gap-2'>
                                <Badge variant={selectedRegistration.boatrVerified ? 'default' : 'secondary'} className='gap-1'>
                                    {selectedRegistration.boatrVerified ? <ShieldCheck className="h-3.5 w-3.5"/> : <ShieldX className="h-3.5 w-3.5"/>}
                                    {t(selectedRegistration.boatrVerified ? 'BoatR Verified' : 'BoatR Unverified')}
                                </Badge>
                                 <Badge variant={selectedRegistration.fishrVerified ? 'default' : 'secondary'} className='gap-1'>
                                    {selectedRegistration.fishrVerified ? <ShieldCheck className="h-3.5 w-3.5"/> : <ShieldX className="h-3.5 w-3.5"/>}
                                    {t(selectedRegistration.fishrVerified ? 'FishR Verified' : 'FishR Unverified')}
                                </Badge>
                             </div>
                             <div className="grid grid-cols-2 gap-2 mt-2">
                                <Button variant="outline" size="sm">{t("Verify BoatR")}</Button>
                                <Button variant="outline" size="sm">{t("Verify FishR")}</Button>
                             </div>
                        </div>

                        <div className="grid gap-2">
                             <div>
                                <p className="text-xs text-muted-foreground">{t("Status")}</p>
                                <Badge variant={getStatusBadgeVariant(selectedRegistration.status)} className="capitalize text-sm">{t(selectedRegistration.status)}</Badge>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">{t("Registration Date")}</p>
                                <p className="font-medium">{selectedRegistration.registrationDate}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">{t("Type")}</p>
                                <p className="font-medium">{t(selectedRegistration.type)}</p>
                            </div>
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
                    <CardFooter className="flex-col items-stretch gap-2 p-6 pt-0">
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !inspectionDate && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {inspectionDate ? format(inspectionDate, "PPP") : <span>{t("Schedule Inspection")}</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={inspectionDate} onSelect={setInspectionDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                        
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
                            <Button variant="default" className='bg-green-600 hover:bg-green-700'><Check className='mr-2 h-4 w-4' /> {t("Approve")}</Button>
                            <Button variant="destructive"><X className='mr-2 h-4 w-4' /> {t("Reject")}</Button>
                            <Button variant="secondary"><Bell className='mr-2 h-4 w-4' /> {t("Send Reminder")}</Button>
                        </div>
                    </CardFooter>
                </Card>
            ) : (
                <Card>
                    <CardContent className='p-6 h-full flex flex-col items-center justify-center text-center'>
                        <FileTextIcon className="h-12 w-12 text-muted-foreground" />
                        <CardTitle className='mt-4'>{t("No Registration Selected")}</CardTitle>
                        <CardDescription className='mt-2'>{t("Click on a registration from the list to view its details here.")}</CardDescription>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
