
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, LinkIcon, Receipt, Hash, Bell, ListFilter, Check, FileLock, FilePen, XCircle } from "lucide-react";
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
    const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
    const [isEReceiptDialogOpen, setIsEReceiptDialogOpen] = useState(false);

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
        const salutation = `Dear ${payment.payerName},\n\n`;
        const signature = `\n\nThank you,\nLiSEAnsyado Admin`;
        let bodyMessage = "";

        if (payment.status === 'Paid') {
            const receiptDetails = `--- E-Receipt ---\nTransaction ID: ${payment.transactionId}\nOR Number: ${payment.referenceNumber}\nDate Paid: ${payment.date}\nPayment For: Registration ${payment.registrationId}\nMethod: ${payment.paymentMethod}\n--------------------\nTotal Amount: ₱${payment.amount.toFixed(2)}\n--------------------`;
            bodyMessage = `This is to confirm your recent payment. Here are the details for your records:\n\n${receiptDetails.trim()}\n\nYour license is now being processed.`;
        } else if (payment.status === 'Failed') {
            bodyMessage = `Your payment has been rejected. Please review your submission and try again. Below are possible reasons for the rejection:\n\n- Incorrect Payment Amount – The amount paid does not match the required fee.\n- Invalid OR Number – The OR number provided is incorrect or missing.\n- Unverified Proof of Payment – Uploaded receipt or payment slip is unclear, incomplete, or invalid.\n- Mismatched Account Name – The payer's name does not match the registered fisherfolk’s name.\n- Duplicate Payment – A payment has already been submitted for this transaction.\n- Tampered Receipt – The receipt appears edited or suspicious.\n- Technical Error – There was a system issue during the submission or validation of payment.\n\nPlease verify your payment details and resubmit accordingly. If you need assistance, contact the Municipal Treasurer’s Office.`;
        }
        
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

    const handleRejectPayment = (transactionId: string) => {
        updatePayment(transactionId, {
            status: 'Failed',
        });
        toast({
            variant: "destructive",
            title: "Payment Rejected",
            description: `Transaction ${transactionId} has been marked as Failed.`,
        });
    };

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
        toast({
            title: "Payment Now Editable",
            description: `You can now edit the OR Number for ${payment.transactionId}.`,
        });
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
                                                {role === 'mto' && (
                                                    <Button variant="outline" size="sm" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditPayment(payment);
                                                    }}>
                                                        <FilePen className="mr-2 h-4 w-4"/> {t("Edit Payment")}
                                                    </Button>
                                                )}
                                                {role === 'admin' && (payment.status === 'Paid' || payment.status === 'Failed') && (
                                                    <div className="flex gap-2">
                                                         <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="sm" onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleOpenNotificationDialog(payment);
                                                            }}>
                                                                <Bell className="mr-2 h-4 w-4"/> Notify Payer
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                    </div>
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

                             {selectedPayment.uploadedReceiptUrl && role === 'admin' && (
                                <div>
                                    <h4 className="font-medium mb-2">{t("Uploaded Receipt")}</h4>
                                    <DialogTrigger asChild>
                                        <img src={selectedPayment.uploadedReceiptUrl} alt="Receipt" className="rounded-md border cursor-pointer hover:opacity-80" onClick={() => setIsReceiptDialogOpen(true)}/>
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
                                {role === 'mto' && selectedPayment.status !== 'For Verification' && selectedPayment.status !== 'Paid' ? (
                                    <div className="space-y-4">
                                        <Input 
                                            id="or-number" 
                                            placeholder="Enter Official Receipt No."
                                            value={orNumber}
                                            onChange={(e) => setOrNumber(e.target.value)}
                                            disabled={selectedPayment.status === 'For Verification' || selectedPayment.status === 'Paid'}
                                        />
                                        <div className="p-4 border rounded-md space-y-4">
                                            <div className="flex items-start space-x-3">
                                                <Checkbox id="certification" checked={isCertified} onCheckedChange={(checked) => setIsCertified(!!checked)} className="mt-1" disabled={selectedPayment.status === 'For Verification' || selectedPayment.status === 'Paid'}/>
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

                                        <Button className="w-full" onClick={() => handleMtoSubmit(selectedPayment.transactionId)} disabled={selectedPayment.status === 'For Verification' || selectedPayment.status === 'Paid'}>Submit to MAO</Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 p-2 rounded-md bg-muted font-mono text-xs min-h-10">
                                        <Hash className="h-4 w-4"/>
                                        {selectedPayment.referenceNumber && selectedPayment.referenceNumber !== 'N/A' ? selectedPayment.referenceNumber : orNumber}
                                    </div>
                                )}
                            </div>
                            
                            {role === 'admin' && selectedPayment.mtoVerifiedStatus === 'verified' && selectedPayment.status === 'For Verification' &&(
                                <>
                                <Separator/>
                                <div className="space-y-4 text-center">
                                    <div className="space-y-2">
                                        <Button 
                                            variant="default"
                                            className="w-full"
                                            disabled={!selectedPayment.uploadedOrNumber || !selectedPayment.uploadedReceiptUrl}
                                            onClick={() => handleMaoVerify(selectedPayment.transactionId)}
                                            title={!selectedPayment.uploadedOrNumber || !selectedPayment.uploadedReceiptUrl ? "Fisherfolk has not submitted their receipt yet." : "Verify Payment"}
                                        >
                                            <Check className="mr-2 h-4 w-4"/> {t("Verify Payment")}
                                        </Button>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" className="w-full" onClick={(e) => { e.stopPropagation(); }}>
                                                <XCircle className="mr-2 h-4 w-4" /> Reject Payment
                                            </Button>
                                        </AlertDialogTrigger>
                                        <DialogTrigger asChild>
                                            <Button variant="secondary" className="w-full" onClick={() => setIsEReceiptDialogOpen(true)}>
                                                <Receipt className="mr-2 h-4 w-4"/> View E-Receipt
                                            </Button>
                                        </DialogTrigger>
                                    </div>
                                </div>
                                </>
                            )}
                        </CardContent>
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
        <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
            {selectedPayment && selectedPayment.uploadedReceiptUrl && (
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("Uploaded Receipt")}</DialogTitle>
                        <DialogDescription>Transaction ID: {selectedPayment.transactionId}</DialogDescription>
                    </DialogHeader>
                    <img src={selectedPayment.uploadedReceiptUrl} alt="Receipt" className="rounded-md w-full h-auto"/>
                </DialogContent>
            )}
        </Dialog>
        <Dialog open={isEReceiptDialogOpen} onOpenChange={setIsEReceiptDialogOpen}>
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
                            <span>{t("OR Number")}:</span>
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
        </Dialog>
        <AlertDialogContent>
            {notificationPayment ? (
                <>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("Notify of Payment")}</AlertDialogTitle>
                    <AlertDialogDescription>{t("Customize and send a payment notification.")}</AlertDialogDescription>
                </AlertDialogHeader>
                <Textarea 
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    rows={12}
                />
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setNotificationPayment(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSendNotification}>Send Notification</AlertDialogAction>
                </AlertDialogFooter>
                </>
            ) : (
                <AlertDialogHeader>
                    <AlertDialogTitle>Reject Payment Confirmation</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to reject this payment? This action cannot be undone.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => selectedPayment && handleRejectPayment(selectedPayment.transactionId)}>
                            Reject
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogHeader>
            )}
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
