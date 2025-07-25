
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, LinkIcon, Receipt, Hash, Bell } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/contexts/language-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

type Payment = {
  transactionId: string;
  referenceNumber: string;
  date: string;
  payerName: string;
  payerAvatar: string;
  registrationId: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed';
  paymentMethod: string;
};

const initialPayments: Payment[] = [
  { transactionId: 'PAY-001', referenceNumber: 'GC-REF-1A2B3C4D', date: '2024-07-20', payerName: 'Juan Dela Cruz', payerAvatar: `https://i.pravatar.cc/150?u=juan.delacruz@email.com`, registrationId: 'REG-001', amount: 150.00, status: 'Paid', paymentMethod: 'GCash' },
  { transactionId: 'PAY-002', referenceNumber: 'GC-REF-5E6F7G8H', date: '2024-07-19', payerName: 'Maria Clara', payerAvatar: 'https://i.pravatar.cc/150?u=maria.clara', registrationId: 'REG-002', amount: 150.00, status: 'Paid', paymentMethod: 'GCash' },
  { transactionId: 'PAY-003', referenceNumber: 'GC-REF-9I0J1K2L', date: '2024-07-18', payerName: 'Crisostomo Ibarra', payerAvatar: 'https://i.pravatar.cc/150?u=crisostomo.ibarra', registrationId: 'REG-003', amount: 150.00, status: 'Paid', paymentMethod: 'GCash' },
  { transactionId: 'PAY-004', referenceNumber: 'GC-REF-3M4N5O6P', date: '2024-07-17', payerName: 'Andres Bonifacio', payerAvatar: 'https://i.pravatar.cc/150?u=andres.bonifacio', registrationId: 'REG-004', amount: 250.00, status: 'Paid', paymentMethod: 'GCash' },
];

const translationKeys = [
    "Payment Management",
    "View and manage all successful payment transactions.",
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
    "Notify Payer",
    "E-Receipt",
    "Payer Information",
    "Registration Details",
    "GCash Ref No.",
    "Notification Sent",
    "Payment confirmation sent to {payerName}.",
    "Notify of Payment",
    "Customize and send a payment notification."
];

export default function AdminPaymentsPage() {
    const { toast } = useToast();
    const [payments, setPayments] = useState<Payment[]>(initialPayments.filter(p => p.status === 'Paid'));
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { t } = useTranslation(translationKeys);
    const [notificationPayment, setNotificationPayment] = useState<Payment | null>(null);
    const [notificationMessage, setNotificationMessage] = useState("");

    const handleOpenNotificationDialog = (payment: Payment) => {
        setNotificationPayment(payment);
        const salutation = `Dear ${payment.payerName},\n\n`;
        const bodyMessage = `This is to confirm that we have successfully received your payment of ₱${payment.amount.toFixed(2)} for registration ${payment.registrationId}. Your transaction ID is ${payment.transactionId} and your GCash reference is ${payment.referenceNumber}.\n\nYour registration is now being processed.`;
        const signature = `\n\nThank you,\nLiSEAnsyado Admin`;
        setNotificationMessage(`${salutation}${bodyMessage}${signature}`);
    };

    const handleSendNotification = () => {
        if (!notificationPayment) return;
        toast({
            title: t("Notification Sent"),
            description: t("Payment confirmation sent to {payerName}.").replace('{payerName}', notificationPayment.payerName),
        });
        setNotificationPayment(null);
    }
    
    const filteredPayments = payments.filter(p => 
        p.payerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.registrationId.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Dialog>
    <AlertDialog>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
                 <Card>
                    <CardHeader>
                    <CardTitle>{t("Payment Management")}</CardTitle>
                    <CardDescription>{t("View and manage all successful payment transactions.")}</CardDescription>
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
                                                <Badge variant="default">
                                                    {t(payment.status)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DialogTrigger asChild>
                                                            <DropdownMenuItem onSelect={() => setSelectedPayment(payment)}>{t("E-Receipt")}</DropdownMenuItem>
                                                        </DialogTrigger>
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem onSelect={() => handleOpenNotificationDialog(payment)}>{t("Notify Payer")}</DropdownMenuItem>
                                                        </AlertDialogTrigger>
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
                                <Badge variant="default">{t(selectedPayment.status)}</Badge>
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
                            
                            <div>
                                <h4 className="font-medium mb-2">{t("GCash Ref No.")}</h4>
                                <div className="flex items-center gap-2 p-2 rounded-md bg-muted font-mono text-xs">
                                    <Hash className="h-4 w-4"/>
                                    {selectedPayment.referenceNumber}
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter className="flex-col gap-2 items-stretch">
                             <DialogTrigger asChild>
                                <Button>
                                    <Receipt className="mr-2 h-4 w-4"/> {t("E-Receipt")}
                                </Button>
                            </DialogTrigger>
                             <AlertDialogTrigger asChild>
                                <Button variant="secondary" onClick={() => handleOpenNotificationDialog(selectedPayment)}>
                                    <Bell className="mr-2 h-4 w-4"/> {t("Notify Payer")}
                                </Button>
                            </AlertDialogTrigger>
                        </CardFooter>
                    </Card>
                ) : (
                    <Card className="h-full flex items-center justify-center">
                        <CardContent className="text-center">
                            <Receipt className="mx-auto h-12 w-12 text-muted-foreground" />
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
                    <DialogTitle>{t("E-Receipt")}</DialogTitle>
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
                     <div className="flex justify-between items-center text-sm">
                        <span>{t("GCash Ref No.")}:</span>
                        <span className="font-mono text-xs">{selectedPayment.referenceNumber}</span>
                    </div>
                    <Separator />
                     <div className="flex justify-between items-center font-bold text-lg">
                        <span>Total Amount:</span>
                        <span>₱{selectedPayment.amount.toFixed(2)}</span>
                    </div>
                </div>
            </DialogContent>
        )}
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{t("Notify of Payment")}</AlertDialogTitle>
                <AlertDialogDescription>{t("Customize and send a payment notification.")}</AlertDialogDescription>
            </AlertDialogHeader>
            <Textarea 
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                rows={10}
            />
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setNotificationPayment(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSendNotification}>Send Notification</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </div>
    </AlertDialog>
    </Dialog>
  );
}
