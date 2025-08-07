
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, LinkIcon, Receipt, Hash, Bell, ListFilter, Check, FileLock, FilePen } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/contexts/language-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { payments } from "@/lib/data";
import { Payment } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Checkbox } from "@/components/ui/checkbox";


function AdminPaymentsPageContent() {
    const { toast } = useToast();
    const [localPayments, setLocalPayments] = useState(payments);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { t } = useTranslation();
    const [notificationPayment, setNotificationPayment] = useState<Payment | null>(null);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [statusFilters, setStatusFilters] = useState<string[]>([]);
    const [orNumber, setOrNumber] = useState("");
    const [isCertified, setIsCertified] = useState(false);
    const searchParams = useSearchParams();
    const role = searchParams.get('role');

    const updatePayment = (transactionId: string, updates: Partial<Payment>) => {
        const updatedPayments = localPayments.map(p =>
            p.transactionId === transactionId ? { ...p, ...updates } : p
        );
        setLocalPayments(updatedPayments);
        // Also update the global `payments` array
        const paymentIndex = payments.findIndex(p => p.transactionId === transactionId);
        if (paymentIndex !== -1) {
            payments[paymentIndex] = { ...payments[paymentIndex], ...updates };
        }
        const updatedSelection = updatedPayments.find(p => p.transactionId === transactionId);
        setSelectedPayment(updatedSelection || null);
    };

    const handleOpenNotificationDialog = (payment: Payment) => {
        setNotificationPayment(payment);
        const salutation = `Dear ${payment.payerName},\n\nThis is to confirm your recent payment. Here are the details for your records:\n\n`;
        
        const receiptDetails = `
--- E-Receipt ---
Transaction ID: ${payment.transactionId}
OR Number: ${payment.referenceNumber}
Date Paid: ${payment.date}
Payment For: Registration ${payment.registrationId}
Method: ${payment.paymentMethod}
--------------------
Total Amount: ₱${payment.amount.toFixed(2)}
--------------------
        `;

        const bodyMessage = `Your registration is now being processed.`;
        const signature = `\n\nThank you,\nLiSEAnsyado Admin`;
        setNotificationMessage(`${salutation}${receiptDetails.trim()}\n\n${bodyMessage}${signature}`);
    };

    const handleSendNotification = () => {
        if (!notificationPayment) return;
        toast({
            title: t("Notification Sent"),
            description: t("Payment confirmation sent to {payerName}.").replace('{payerName}', notificationPayment.payerName),
        });
        setNotificationPayment(null);
    }
    
    const filteredPayments = localPayments.filter(p => {
        const matchesSearch = p.payerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              p.registrationId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilters.length === 0 || statusFilters.includes(p.status);
        return matchesSearch && matchesStatus;
    });

    const handleStatusFilterChange = (status: string) => {
        setStatusFilters((prev) =>
          prev.includes(status)
            ? prev.filter((s) => s !== status)
            : [...prev, status]
        );
    };

    const getStatusBadgeVariant = (status: Payment['status']) => {
        switch (status) {
          case 'Paid':
            return 'default';
          case 'Pending':
            return 'secondary';
          case 'Failed':
            return 'destructive';
          case 'For Verification':
              return 'outline';
          default:
            return 'outline';
        }
    };

    const handleMtoSubmit = (transactionId: string) => {
        if (!orNumber) {
            toast({
                variant: "destructive",
                title: "OR Number Required",
                description: "Please enter the Official Receipt number.",
            });
            return;
        }
        if (!isCertified) {
            toast({
                variant: "destructive",
                title: "Certification Required",
                description: "Please certify the payment by checking the box.",
            });
            return;
        }
        updatePayment(transactionId, { 
            status: 'For Verification', 
            referenceNumber: orNumber, 
            mtoVerifiedStatus: 'verified' 
        });
        toast({
            title: "OR Number Submitted",
            description: `OR Number for ${transactionId} has been sent to MAO for verification.`,
        });
    };

    const handleMaoVerify = (transactionId: string) => {
        updatePayment(transactionId, { 
            status: 'Paid',
            date: new Date().toISOString().split('T')[0],
        });
         toast({
            title: "Payment Verified",
            description: `Transaction ${transactionId} has been marked as Paid.`,
        });
    }

    const handleSelectPayment = (payment: Payment) => {
        setSelectedPayment(payment);
        let initialOrNumber = payment.referenceNumber || payment.uploadedOrNumber || '';
        if (initialOrNumber === 'N/A') {
            initialOrNumber = '';
        }
        setOrNumber(initialOrNumber);
        setIsCertified(payment.mtoVerifiedStatus === 'verified');
    };
    
    const handleEditPayment = (payment: Payment) => {
        updatePayment(payment.transactionId, { status: 'Pending', mtoVerifiedStatus: 'unverified' });
        // The selection will be updated via the `updatePayment` function's side effect
    };

  return (
    <Dialog>
    <AlertDialog>
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
                                    <Button variant="outline" className="gap-1 flex-shrink-0">
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span>{t("Status: ")} {statusFilters.length ? statusFilters.map(s => t(s)).join(', ') : t('All')}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {(['Paid', 'Pending', 'Failed', 'For Verification'] as const).map(status => (
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
                                        <TableRow key={payment.transactionId} onClick={() => handleSelectPayment(payment)} className="cursor-pointer" data-state={selectedPayment?.transactionId === payment.transactionId && 'selected'}>
                                            <TableCell className="font-medium">{payment.payerName}</TableCell>
                                            <TableCell>₱{payment.amount.toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusBadgeVariant(payment.status)} className="capitalize">
                                                    {t(payment.status)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {role === 'mto' ? (
                                                    <Button variant="outline" size="sm" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditPayment(payment);
                                                    }}>
                                                        <FilePen className="mr-2 h-4 w-4"/> {t("Edit Payment")}
                                                    </Button>
                                                ) : (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            {role === 'admin' && (
                                                                <>
                                                                    <DialogTrigger asChild>
                                                                        <DropdownMenuItem onSelect={() => setSelectedPayment(payment)}>{t("E-Receipt")}</DropdownMenuItem>
                                                                    </DialogTrigger>
                                                                    {payment.status === 'For Verification' && (
                                                                        <DropdownMenuItem onSelect={() => handleMaoVerify(payment.transactionId)}>
                                                                            <Check className="mr-2 h-4 w-4"/> {t("Verify Payment")}
                                                                        </DropdownMenuItem>
                                                                    )}
                                                                    <AlertDialogTrigger asChild>
                                                                        <DropdownMenuItem onSelect={() => handleOpenNotificationDialog(payment)}>{t("Notify Payer")}</DropdownMenuItem>
                                                                    </AlertDialogTrigger>
                                                                </>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
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
                                <Badge variant={getStatusBadgeVariant(selectedPayment.status)} className="capitalize">{t(selectedPayment.status)}</Badge>
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
                                {role === 'mto' ? (
                                    <Button variant="outline" className="w-full justify-start" disabled>
                                        <FileLock className="mr-2 h-4 w-4"/>
                                        {selectedPayment.registrationId}
                                    </Button>
                                ) : (
                                    <Link href={`/admin/registrations?id=${selectedPayment.registrationId}`} className="w-full">
                                        <Button variant="outline" className="w-full justify-start">
                                            <LinkIcon className="mr-2 h-4 w-4"/>
                                            {selectedPayment.registrationId}
                                        </Button>
                                    </Link>
                                )}
                            </div>

                             {selectedPayment.uploadedReceiptUrl && role !== 'mto' && (
                                <div>
                                    <h4 className="font-medium mb-2">{t("Uploaded Receipt")}</h4>
                                    <DialogTrigger asChild>
                                        <img src={selectedPayment.uploadedReceiptUrl} alt="Receipt" className="rounded-md border cursor-pointer hover:opacity-80"/>
                                    </DialogTrigger>
                                </div>
                            )}

                            {role === 'admin' && selectedPayment.uploadedOrNumber && (
                                <div>
                                    <Label htmlFor="or-number-fisherfolk">{t("OR Number (from Fisherfolk)")}</Label>
                                    <div className="flex items-center gap-2 p-2 rounded-md bg-muted font-mono text-xs min-h-10">
                                        <Hash className="h-4 w-4"/>
                                        {selectedPayment.uploadedOrNumber}
                                    </div>
                                </div>
                            )}
                            
                            <div>
                                <Label htmlFor="or-number">{t("OR Number")}</Label>
                                {role === 'mto' && (selectedPayment.status === 'Pending' || (selectedPayment.status === 'For Verification' && selectedPayment.mtoVerifiedStatus !== 'verified')) ? (
                                    <div className="space-y-4">
                                        <Input 
                                            id="or-number" 
                                            placeholder="Enter Official Receipt No."
                                            value={orNumber}
                                            onChange={(e) => setOrNumber(e.target.value)}
                                        />
                                        <div className="p-4 border rounded-md space-y-4">
                                            <div className="flex items-start space-x-3">
                                                <Checkbox id="certification" checked={isCertified} onCheckedChange={(checked) => setIsCertified(!!checked)} className="mt-1" />
                                                <div className="grid gap-1.5 leading-none">
                                                    <label
                                                        htmlFor="certification"
                                                        className="text-xs italic text-muted-foreground"
                                                    >
                                                    "I hereby CERTIFY that the mentioned applicant for Fishing permits / licenses paid the corresponding fees under Municipal Ordinance 6-2010 and Municipal Revenue Code."
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <p className="font-semibold">Corazon R. Grumo</p>
                                                <p className="text-xs text-muted-foreground">Municipal Treasurer</p>
                                            </div>
                                        </div>

                                        <Button className="w-full" onClick={() => handleMtoSubmit(selectedPayment.transactionId)}>Submit to MAO</Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 p-2 rounded-md bg-muted font-mono text-xs min-h-10">
                                        <Hash className="h-4 w-4"/>
                                        {selectedPayment.referenceNumber && selectedPayment.referenceNumber !== 'N/A' ? selectedPayment.referenceNumber : orNumber}
                                    </div>
                                )}
                            </div>
                            
                            {role === 'admin' && selectedPayment.mtoVerifiedStatus === 'verified' && (
                                <>
                                <Separator/>
                                <div className="space-y-4 text-center">
                                    <p className="text-xs italic text-muted-foreground">
                                        "I hereby CERTIFY that the mentioned applicant for Fishing permits / licenses paid the corresponding fees under Municipal Ordinance 6-2010 and Municipal Revenue Code."
                                    </p>
                                    <div>
                                        <p className="font-semibold">Corazon R. Grumo</p>
                                        <p className="text-xs text-muted-foreground">Municipal Treasurer</p>
                                    </div>
                                </div>
                                </>
                            )}
                        </CardContent>
                        {role === 'admin' && (
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
                        )}
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
                    <DialogTitle>{t(selectedPayment.uploadedReceiptUrl ? "Uploaded Receipt" : "E-Receipt")}</DialogTitle>
                    <DialogDescription>Transaction ID: {selectedPayment.transactionId}</DialogDescription>
                </DialogHeader>
                {selectedPayment.uploadedReceiptUrl ? (
                    <img src={selectedPayment.uploadedReceiptUrl} alt="Receipt" className="rounded-md w-full h-auto"/>
                ) : (
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
                        <span>{t("OR Number")}:</span>
                        <span className="font-mono text-xs">{selectedPayment.referenceNumber}</span>
                    </div>
                    <Separator />
                     <div className="flex justify-between items-center font-bold text-lg">
                        <span>Total Amount:</span>
                        <span>₱{selectedPayment.amount.toFixed(2)}</span>
                    </div>
                </div>
                )}
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

export default function AdminPaymentsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminPaymentsPageContent />
        </Suspense>
    )
}
