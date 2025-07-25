
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ListFilter, Search, MoreHorizontal, FileText, FileCheck, FileX, LinkIcon, Receipt } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/contexts/language-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Payment = {
  transactionId: string;
  date: string;
  payerName: string;
  payerAvatar: string;
  registrationId: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed';
  paymentMethod: string;
};

const initialPayments: Payment[] = [
  { transactionId: 'PAY-001', date: '2024-07-20', payerName: 'Juan Dela Cruz', payerAvatar: `https://i.pravatar.cc/150?u=juan.delacruz@email.com`, registrationId: 'REG-001', amount: 150.00, status: 'Paid', paymentMethod: 'GCash' },
  { transactionId: 'PAY-002', date: '2024-07-19', payerName: 'Maria Clara', payerAvatar: 'https://i.pravatar.cc/150?u=maria.clara', registrationId: 'REG-002', amount: 150.00, status: 'Paid', paymentMethod: 'GCash' },
  { transactionId: 'PAY-003', date: '2024-07-18', payerName: 'Crisostomo Ibarra', payerAvatar: 'https://i.pravatar.cc/150?u=crisostomo.ibarra', registrationId: 'REG-003', amount: 150.00, status: 'Pending', paymentMethod: 'GCash' },
  { transactionId: 'PAY-004', date: '2024-07-17', payerName: 'Andres Bonifacio', payerAvatar: 'https://i.pravatar.cc/150?u=andres.bonifacio', registrationId: 'REG-004', amount: 250.00, status: 'Failed', paymentMethod: 'GCash' },
];

const translationKeys = [
    "Payment Management",
    "View and manage all payment transactions.",
    "Search by payer or registration ID...",
    "Filter by status",
    "Paid",
    "Pending",
    "Failed",
    "Transaction ID",
    "Date",
    "Payer Name",
    "Registration ID",
    "Amount",
    "Status",
    "Method",
    "Actions",
    "No Payment Selected",
    "Click on a transaction from the list to view its details here.",
    "Mark as Paid",
    "Mark as Failed",
    "Official Receipt",
    "Payer Information",
    "Registration Details",
];

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>(initialPayments);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { t } = useTranslation(translationKeys);

    const getStatusVariant = (status: Payment['status']) => {
        switch (status) {
            case 'Paid': return 'default';
            case 'Pending': return 'secondary';
            case 'Failed': return 'destructive';
            default: return 'outline';
        }
    };
    
    const updatePaymentStatus = (transactionId: string, status: Payment['status']) => {
        setPayments(prev => prev.map(p => p.transactionId === transactionId ? {...p, status} : p));
        if (selectedPayment && selectedPayment.transactionId === transactionId) {
            setSelectedPayment(prev => prev ? {...prev, status} : null);
        }
    };

    const filteredPayments = payments.filter(p => 
        p.payerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.registrationId.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Dialog>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
                 <Card>
                    <CardHeader>
                    <CardTitle>{t("Payment Management")}</CardTitle>
                    <CardDescription>{t("View and manage all payment transactions.")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 pb-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                placeholder={t("Search by payer or registration ID...")}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                                />
                            </div>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-1">
                                <ListFilter className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{t("Filter by status")}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuCheckboxItem checked>{t("Paid")}</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>{t("Pending")}</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>{t("Failed")}</DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t("Payer Name")}</TableHead>
                                        <TableHead>{t("Amount")}</TableHead>
                                        <TableHead>{t("Status")}</TableHead>
                                        <TableHead>{t("Actions")}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPayments.map(payment => (
                                        <TableRow key={payment.transactionId} onClick={() => setSelectedPayment(payment)} className="cursor-pointer" data-state={selectedPayment?.transactionId === payment.transactionId && 'selected'}>
                                            <TableCell className="font-medium">{payment.payerName}</TableCell>
                                            <TableCell>₱{payment.amount.toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(payment.status)}>
                                                    {t(payment.status)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onSelect={() => updatePaymentStatus(payment.transactionId, 'Paid')}>{t("Mark as Paid")}</DropdownMenuItem>
                                                        <DropdownMenuItem onSelect={() => updatePaymentStatus(payment.transactionId, 'Failed')}>{t("Mark as Failed")}</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                 {selectedPayment ? (
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{selectedPayment.transactionId}</CardTitle>
                                    <CardDescription>{selectedPayment.date}</CardDescription>
                                </div>
                                <Badge variant={getStatusVariant(selectedPayment.status)}>{t(selectedPayment.status)}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">{t("Amount")}</span>
                                <span className="font-bold text-lg">₱{selectedPayment.amount.toFixed(2)}</span>
                            </div>
                            <Separator />

                            <div>
                                <h4 className="font-medium mb-2">{t("Payer Information")}</h4>
                                <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={selectedPayment.payerAvatar} />
                                        <AvatarFallback>{selectedPayment.payerName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{selectedPayment.payerName}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-medium mb-2">{t("Registration Details")}</h4>
                                <Link href={`/admin/registrations?id=${selectedPayment.registrationId}`} className="w-full">
                                    <Button variant="outline" className="w-full justify-start">
                                        <LinkIcon className="mr-2 h-4 w-4"/>
                                        {selectedPayment.registrationId}
                                    </Button>
                                </Link>
                            </div>

                        </CardContent>
                        <CardFooter className="flex-col gap-2 items-stretch">
                             <DialogTrigger asChild>
                                <Button>
                                    <Receipt className="mr-2 h-4 w-4"/> {t("Official Receipt")}
                                </Button>
                            </DialogTrigger>
                             <div className="flex gap-2">
                                <Button variant="secondary" className="w-full" onClick={() => updatePaymentStatus(selectedPayment.transactionId, 'Paid')}>
                                    <FileCheck className="mr-2 h-4 w-4"/> {t("Mark as Paid")}
                                </Button>
                                <Button variant="destructive" className="w-full" onClick={() => updatePaymentStatus(selectedPayment.transactionId, 'Failed')}>
                                    <FileX className="mr-2 h-4 w-4"/> {t("Mark as Failed")}
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ) : (
                    <Card className="h-full flex items-center justify-center">
                        <CardContent className="text-center">
                            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-medium">{t("No Payment Selected")}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{t("Click on a transaction from the list to view its details here.")}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
        {selectedPayment && (
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("Official Receipt")}</DialogTitle>
                    <DialogDescription>Transaction ID: {selectedPayment.transactionId}</DialogDescription>
                </DialogHeader>
                <div className="p-4 border rounded-lg my-4 space-y-4 bg-muted/30">
                     <div className="flex justify-between items-center text-sm">
                        <span>Date Paid:</span>
                        <span>{selectedPayment.date}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <span>Paid by:</span>
                        <span>{selectedPayment.payerName}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <span>Payment For:</span>
                        <span>Registration {selectedPayment.registrationId}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm">
                        <span>Method:</span>
                        <span>{selectedPayment.paymentMethod}</span>
                    </div>
                    <Separator />
                     <div className="flex justify-between items-center font-bold text-lg">
                        <span>Total Amount:</span>
                        <span>₱{selectedPayment.amount.toFixed(2)}</span>
                    </div>
                </div>
            </DialogContent>
        )}
        </div>
    </Dialog>
  );
}
