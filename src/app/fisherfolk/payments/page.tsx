
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslation } from "@/contexts/language-context";
import { payments } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Payment } from "@/lib/types";

export default function FisherfolkPaymentsPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [userPayments, setUserPayments] = useState(payments.filter(p => p.payerName === 'Juan Dela Cruz'));
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [orNumber, setOrNumber] = useState("");
    const [receiptPhoto, setReceiptPhoto] = useState<File | null>(null);
    const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
    const receiptFileRef = useRef<HTMLInputElement>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setReceiptPhoto(file);
            setReceiptPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmitReceipt = (transactionId: string) => {
        if (!orNumber || !receiptPhoto) {
            toast({
                variant: "destructive",
                title: "Incomplete Information",
                description: "Please enter the OR Number and upload a photo of the receipt.",
            });
            return;
        }

        const paymentIndex = payments.findIndex(p => p.transactionId === transactionId);
        if (paymentIndex !== -1) {
            payments[paymentIndex] = {
                ...payments[paymentIndex],
                status: 'For Verification',
                uploadedOrNumber: orNumber,
                uploadedReceiptUrl: receiptPreview
            };
            setUserPayments(payments.filter(p => p.payerName === 'Juan Dela Cruz'));
        }

        toast({
            title: "Receipt Submitted",
            description: "Your receipt for transaction " + transactionId + " has been submitted for verification.",
        });
        setIsDialogOpen(false);
        setOrNumber("");
        setReceiptPhoto(null);
        setReceiptPreview(null);
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


  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t("Payments")}</h1>
        <p className="text-muted-foreground">
          {t("The Municipal Agriculture Office will verify your registration, inspect your fishing gears and vessels, and then send you the summary of your payment. Please wait patiently for the official notification.  Once you receive it, you may settle your payment at the Municipal Treasurer's Office.")}
        </p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>{t("Pending Dues")}</CardTitle>
          <CardDescription>{t("Settle your outstanding payments at the Municipal Treasurer's Office.")}</CardDescription>
        </CardHeader>
        <CardContent>
            {userPayments.length > 0 ? (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("Transaction ID")}</TableHead>
                                <TableHead>{t("For Registration")}</TableHead>
                                <TableHead>{t("Amount")}</TableHead>
                                <TableHead>{t("Status")}</TableHead>
                                <TableHead className="text-right">{t("Action")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userPayments.map((payment) => (
                                <TableRow key={payment.transactionId}>
                                    <TableCell className="font-mono text-xs">{payment.transactionId}</TableCell>
                                    <TableCell>{payment.registrationId}</TableCell>
                                    <TableCell>₱{payment.amount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(payment.status)}>{t(payment.status)}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DialogTrigger asChild>
                                            <Button 
                                                variant="default"
                                                size="sm"
                                                disabled={payment.status !== 'Pending'}
                                                onClick={() => setSelectedPayment(payment)}
                                            >
                                                {t("Upload Receipt")}
                                            </Button>
                                        </DialogTrigger>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                 <p className="text-muted-foreground text-center py-8">{t("You have no pending payments.")}</p>
            )}
        </CardContent>
      </Card>
      
    </div>
    {selectedPayment && (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t("Upload Official Receipt")}</DialogTitle>
                <DialogDescription>
                    {t("For transaction")} {selectedPayment.transactionId}
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="or-number">{t("OR Number")}</Label>
                    <Input id="or-number" placeholder="Enter the OR Number from your receipt" value={orNumber} onChange={e => setOrNumber(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="receipt-photo">{t("Receipt Photo")}</Label>
                    <input type="file" ref={receiptFileRef} className="hidden" onChange={handleFileChange} accept="image/*"/>
                    <Button variant="outline" className="w-full" onClick={() => receiptFileRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4"/> {t("Upload Photo")}
                    </Button>
                </div>
                {receiptPreview && (
                    <div className="border rounded-md p-2">
                        <Image src={receiptPreview} alt="Receipt preview" width={400} height={400} className="w-full h-auto rounded-md object-contain" />
                    </div>
                )}
            </div>
            <Button className="w-full" onClick={() => handleSubmitReceipt(selectedPayment.transactionId)}>
                {t("Submit for Verification")}
            </Button>
        </DialogContent>
    )}
    </Dialog>
  );
}
