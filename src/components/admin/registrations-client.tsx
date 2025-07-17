
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Registration } from "@/lib/data";
import { ListFilter, Search, Check, X, Bell, FileTextIcon, Mail, Phone, Home, RefreshCcw, FilePen, Calendar as CalendarIcon, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';

interface RegistrationsClientProps {
  data: Registration[];
}

export function RegistrationsClient({ data }: RegistrationsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(data[0] || null);

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
            <div className="relative flex-1 w-full md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by Owner or Vessel ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full"
                />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-1 flex-shrink-0">
                        <ListFilter className="h-3.5 w-3.5" />
                        <span>Status: {statusFilters.length ? statusFilters.join(', ') : 'All'}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {allStatuses.map(status => (
                            <DropdownMenuCheckboxItem
                                key={status}
                                checked={statusFilters.includes(status)}
                                onCheckedChange={() => handleStatusFilterChange(status)}
                            >
                                {status}
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
                        <CalendarIcon className="h-4 w-4" />
                        {dateFilter ? format(dateFilter, "PPP") : <span>Pick a date</span>}
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
                        <span>Type: {typeFilters.length ? typeFilters.join(', ') : 'All'}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {allTypes.map(type => (
                            <DropdownMenuCheckboxItem
                                key={type}
                                checked={typeFilters.includes(type)}
                                onCheckedChange={() => handleTypeFilterChange(type)}
                            >
                                {type}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className='space-y-4'>
            <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead padding="checkbox">
                    <Checkbox />
                    </TableHead>
                    <TableHead>Owner Name</TableHead>
                    <TableHead>Vessel/Gear ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                                {reg.status}
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
                                    <DropdownMenuCheckboxItem>Approve</DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem>Reject</DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem>Send Reminder</DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                            No results found.
                        </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
                <p>Showing 1-{filteredData.length < 10 ? filteredData.length : 10} of {filteredData.length} records</p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">{'<'}</Button>
                    <Button variant="outline" size="sm">1</Button>
                    <Button variant="outline" size="sm">{'>'}</Button>
                </div>
            </div>
        </div>
        <div className='space-y-6'>
            {selectedRegistration ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Registration Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={selectedRegistration.avatar} alt={selectedRegistration.ownerName} />
                                    <AvatarFallback>{selectedRegistration.ownerName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-1">
                                    <p className="font-bold text-lg">{selectedRegistration.ownerName}</p>
                                    <p className="text-sm text-muted-foreground">{selectedRegistration.id}</p>
                                    <div className="text-sm text-muted-foreground mt-2 space-y-1">
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
                                </div>
                            </div>
                             <div className='flex flex-col items-center p-2 border rounded-md bg-muted/20'>
                                <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${selectedRegistration.id}`} width={120} height={120} alt={`QR Code for ${selectedRegistration.id}`} />
                                <p className='text-xs text-muted-foreground mt-2 text-center'>Scan for vessel/gear info</p>
                            </div>
                        </div>

                        
                        <div className="grid gap-4">
                             <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <Badge variant={getStatusBadgeVariant(selectedRegistration.status)} className="capitalize text-sm">{selectedRegistration.status}</Badge>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Registration Date</p>
                                <p className="font-medium">{selectedRegistration.registrationDate}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Type</p>
                                <p className="font-medium">{selectedRegistration.type}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className='font-semibold mb-2'>History Log</h4>
                            <div className="space-y-2 text-sm text-muted-foreground border-l-2 border-primary/20 pl-4">
                                {selectedRegistration.history.map((log, index) => {
                                    const Icon = log.action === 'Inspected' ? CalendarIcon : log.action === 'Renewed' ? RefreshCcw : FilePen;
                                    return (
                                        <div key={index} className='flex items-start gap-3 relative'>
                                             <div className="absolute -left-[27px] mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                                                <Icon className='h-3 w-3 text-primary' />
                                             </div>
                                            <span>{log.action} on {log.date} by {log.actor}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        
                        <Button className="w-full">
                            <CalendarIcon className="mr-2 h-4 w-4"/>
                            Schedule Inspection
                        </Button>
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
                            <Button variant="default" className='bg-green-600 hover:bg-green-700'><Check className='mr-2 h-4 w-4' /> Approve</Button>
                            <Button variant="destructive"><X className='mr-2 h-4 w-4' /> Reject</Button>
                            <Button variant="secondary"><Bell className='mr-2 h-4 w-4' /> Send Reminder</Button>
                        </div>
                        
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className='p-6 h-full flex flex-col items-center justify-center text-center'>
                        <FileTextIcon className="h-12 w-12 text-muted-foreground" />
                        <CardTitle className='mt-4'>No Registration Selected</CardTitle>
                        <CardDescription className='mt-2'>Click on a registration from the list to view its details here.</CardDescription>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
