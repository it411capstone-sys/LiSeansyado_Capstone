
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslation } from "@/contexts/language-context";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, Receipt, Eye } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Payment, Inspection, AuditLogAction } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { db, storage } from "@/lib/firebase";
import { collection, onSnapshot, query, where, doc, updateDoc, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { compressImage } from '@/lib/image-compression';
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";


const feeCategories = {
    vessels: [
        { item: "Pump boat less than 10 HP", fee: "Php 330.00" },
        { item: "Pump boat 10 HP to 16 HP", fee: "Php 360.00" },
        { item: "Pump boat 16 HP and above but less than 3 G.T", fee: "Php 500.00" },
        { item: "Non-motorized fishing boat", fee: "Php 50.00" },
        { item: "Banca with sail (layag)", fee: "Php 50.00" },
        { item: "Municipal fisherfolk", fee: "Php 50.00" },
    ],
    certificates: [
        { item: "CERTIFICATE OF NUMBER", fee: "Php 120.00" },
        { item: "PERMIT TO OPERATE", fee: "Php 120.00" },
        { item: "MOTORBOAT OPERATORS PERMIT", fee: "Php 120.00" },
    ],
    nets: [
        { item: "For each pocot 5 bundles below (length)", fee: "Php 200.00" },
        { item: "For each pocot 5-10 bundles (length)", fee: "Php 300.00" },
        { item: "For each additional 1 bundle in length", fee: "Php 50.00" },
        { item: "Anod", fee: "Php 20.00" },
        { item: "Pamarongoy with motorboat", fee: "Php 100.00" },
        { item: "Pamarongoy without motorboat", fee: "Php 50.00" },
        { item: "Palaran or drift gill net (panglaklak) - 1-10m", fee: "Php 100.00" },
        { item: "Palaran or drift gill net (panglaklak) - 10-25m", fee: "Php 120.00" },
        { item: "Palaran or drift gill net (panglaklak) - 25m+", fee: "Php 150.00" },
        { item: "Panganduhaw or Panulid - 20-50m", fee: "Php 200.00" },
        { item: "Panganduhaw or Panulid - additional 50m", fee: "Php 20.00" },
        { item: "Sapyao / sarap", fee: "Php 200.00" },
        { item: "Pamo / Pamangsi", fee: "Php 600.00" },
        { item: "Basnig / baling", fee: "Php 800.00" },
        { item: "Baling (special permit)", fee: "Php 350.00" },
    ],
    otherGears: [
        { item: "Lamp and spear", fee: "Php 50.00" },
        { item: "Bow and Arrow with light", fee: "Php 100.00" },
        { item: "Scoop net with light (sarap)", fee: "Php 100.00" },
        { item: "Jigs (squid – kayongkong. Ect)", fee: "Php 50.00" },
    ],
    traps: [
        { item: "Crab lift net (pintol)", fee: "Php 50.00" },
        { item: "Crab lift net - In excess to 100 sq.m", fee: "Php 2.00/sq.m." },
        { item: "Crab pot (panggal/anglambay/bantak)", fee: "Php 50.00" },
        { item: "Crab pot - In excess of 100 sq.m.", fee: "Php 2.00/sq.m." },
        { item: "Lobster pot (bubo pagbanagan)", fee: "Php 110.00" },
        { item: "Lobster pot - In excess of 100 sq.m.", fee: "Php 3.00/sq.m." },
        { item: "Fish Pot-large (bubo-hampas, pangal, timing)", fee: "Php 110.00" },
        { item: "Fish pot-large - In excess of 100 sq.m.", fee: "Php 3.00/sq.m." },
        { item: "Squid Pot (bubo pangnokus) Bungsod", fee: "Php 110.00" },
        { item: "Squid Pot - In excess of 100 sq.m.", fee: "Php 3.00/sq.m" },
        { item: "Bungsod", fee: "Php 150.00" },
    ],
    hookAndLine: [
        { item: "Simple Hook and lines (bira-bira; pamingwit; ton-ton)", fee: "Php 100.00" },
        { item: "Hook and lines with float (pamataw)", fee: "Php 100.00" },
        { item: "Multiple handline (undak-undak; birabira; tuwang-tuwang)", fee: "Php 100.00" },
        { item: "Drag handlines (Margati/bahan)", fee: "Php 300.00" },
        { item: "Troll line (lambu; palangre – lutaw)", fee: "Php 170.00" },
    ],
};

const createAuditLog = async (userId: string, userName: string, action: AuditLogAction, targetId: string) => {
    try {
        await addDoc(collection(db, "auditLogs"), {
            timestamp: new Date(),
            userId: userId,
            userName: userName,
            action: action,
            target: {
                type: 'payment',
                id: targetId,
            },
            details: {}
        });
    } catch (error) {
        console.error("Error writing audit log: ", error);
    }
};

export default function FisherfolkPaymentsPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { user, userData } = useAuth();
    const [userPayments, setUserPayments] = useState<Payment[]>([]);
    const [inspections, setInspections] = useState<Inspection[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [orNumber, setOrNumber] = useState("");
    const [receiptPhoto, setReceiptPhoto] = useState<File | null>(null);
    const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
    const receiptFileRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            const q = query(collection(db, "payments"), where("payerId", "==", user.uid));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const paymentsData: Payment[] = [];
                snapshot.forEach(doc => paymentsData.push({ id: doc.id, ...doc.data() } as Payment));
                setUserPayments(paymentsData);
            });

            const insq = query(collection(db, "inspections"));
             const unsubInspections = onSnapshot(insq, (snapshot) => {
                const inspectionsData: Inspection[] = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    inspectionsData.push({ id: doc.id, ...data, scheduledDate: data.scheduledDate.toDate() } as Inspection);
                });
                setInspections(inspectionsData);
            });
            return () => {
                unsubscribe();
                unsubInspections();
            };
        }
    }, [user]);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setReceiptPhoto(file);
            setReceiptPreview(URL.createObjectURL(file));
        }
    };

    const handleRetryVerification = async (paymentId: string) => {
        const paymentRef = doc(db, "payments", paymentId);
        try {
            await updateDoc(paymentRef, {
                status: 'Pending',
                uploadedOrNumber: null,
                uploadedReceiptUrl: null
            });
            toast({
                title: "Ready to Retry",
                description: "Please upload your receipt again for verification.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not reset payment status.",
            });
        }
    };

    const handleSubmitReceipt = async (paymentId: string) => {
        if (!orNumber || !receiptPhoto) {
            toast({
                variant: "destructive",
                title: "Incomplete Information",
                description: "Please enter the OR Number and upload a photo of the receipt.",
            });
            return;
        }

        if (!user || !userData) {
             toast({
                variant: "destructive",
                title: "Authentication Error",
                description: "You must be logged in to submit a receipt.",
            });
            return;
        }
        
        setIsSubmitting(true);
        const paymentRef = doc(db, "payments", paymentId);
        try {
            const compressedPhoto = await compressImage(receiptPhoto);
            const storageRef = ref(storage, `receipts/${user.uid}/${paymentId}/${compressedPhoto.name}`);
            await uploadBytes(storageRef, compressedPhoto);
            const uploadedReceiptUrl = await getDownloadURL(storageRef);

            await updateDoc(paymentRef, {
                status: 'For Verification',
                uploadedOrNumber: orNumber,
                uploadedReceiptUrl: uploadedReceiptUrl
            });
            
            await createAuditLog(user.uid, userData.displayName, 'FISHERFOLK_PAYMENT_RECEIPT_UPLOADED', paymentId);

            toast({
                title: "Receipt Submitted",
                description: "Your receipt for transaction " + paymentId + " has been submitted for verification.",
            });
            setSelectedPayment(null);
            setOrNumber("");
            setReceiptPhoto(null);
            setReceiptPreview(null);
        } catch (error) {
            console.error("Receipt submission error:", error);
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: "There was an error uploading your receipt. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
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
    
    const paymentHistory = userPayments.filter(p => p.status === 'Paid');
    const selectedInspection = selectedPayment ? inspections.find(i => i.registrationId === selectedPayment.registrationId) : null;

  return (
    <>
    <div className="container mx-auto p-4 md:p-8 max-w-4xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t("Payments")}</h1>
        
      </div>

       <Card>
        <CardHeader>
          <CardTitle>{t("Pending Dues")}</CardTitle>
          <CardDescription>{t("Settle your outstanding payments at the Municipal Treasurer's Office.")}</CardDescription>
        </CardHeader>
        <CardContent>
             <p className="text-sm text-muted-foreground mb-4">
                {t("The Municipal Agriculture Office will verify your registration, inspect your fishing gears and vessels, and then send you the summary of your payment. Please wait patiently for the official notification.  Once you receive it, you may settle your payment at the Municipal Treasurer’s Office.")}
            </p>
            {userPayments.filter(p => p.status !== 'Paid').length > 0 ? (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("Transaction ID")}</TableHead>
                                <TableHead>{t("Details")}</TableHead>
                                <TableHead>{t("Amount")}</TableHead>
                                <TableHead>{t("Status")}</TableHead>
                                <TableHead className="text-right">{t("Action")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userPayments.filter(p => p.status !== 'Paid').map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-mono text-xs">{payment.transactionId}</TableCell>
                                     <TableCell>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="link" className="p-0 h-auto" onClick={() => setSelectedPayment(payment)}>
                                                    {payment.registrationId}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                            {selectedPayment && selectedInspection?.feeSummary && (
                                                <>
                                                    <DialogHeader>
                                                        <DialogTitle>Fee Details</DialogTitle>
                                                        <DialogDescription>For Registration: {selectedPayment.registrationId}</DialogDescription>
                                                    </DialogHeader>
                                                    <ScrollArea className="max-h-[60vh]">
                                                        <div className="p-4 border rounded-lg my-4 space-y-2 bg-muted/30">
                                                            {selectedInspection.feeSummary.items.map(item => (
                                                                <div key={item.item} className="flex justify-between items-center text-sm">
                                                                    <span>
                                                                        {item.item}
                                                                        {item.hasQuantity && item.quantity > 1 && (
                                                                            <span className="text-muted-foreground text-xs ml-2"> (x{item.quantity})</span>
                                                                        )}
                                                                    </span>
                                                                    <span>Php {(item.fee * item.quantity).toFixed(2)}</span>
                                                                </div>
                                                            ))}
                                                            <Separator className="my-2" />
                                                            <div className="flex justify-between items-center font-bold">
                                                                <span>TOTAL</span>
                                                                <span>Php {selectedInspection.feeSummary.total.toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    </ScrollArea>
                                                </>
                                            )}
                                            </DialogContent>
                                        </Dialog>
                                     </TableCell>
                                    <TableCell>₱{payment.amount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(payment.status)}>{t(payment.status)}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                         {payment.status === 'Failed' ? (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleRetryVerification(payment.id)}
                                            >
                                                Retry Verification
                                            </Button>
                                        ) : (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button 
                                                        variant="default"
                                                        size="sm"
                                                        disabled={!!payment.uploadedReceiptUrl}
                                                        onClick={() => setSelectedPayment(payment)}
                                                    >
                                                        {t("Upload Receipt")}
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                     {selectedPayment && (
                                                        <>
                                                            <DialogHeader>
                                                                <DialogTitle>{t("Upload Official Receipt")}</DialogTitle>
                                                                <DialogDescription>
                                                                    {t("For transaction")} {selectedPayment.transactionId}
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <ScrollArea className="max-h-[70vh] p-1">
                                                                <div className="space-y-4 py-4 pr-4">
                                                                    <div className="space-y-2">
                                                                        <Label htmlFor="or-number">{t("OR Number")}</Label>
                                                                        <Input id="or-number" placeholder="Enter the OR Number from your receipt" value={orNumber} onChange={e => setOrNumber(e.target.value)} disabled={isSubmitting} />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label htmlFor="receipt-photo">{t("Receipt Photo")}</Label>
                                                                        <input type="file" ref={receiptFileRef} className="hidden" onChange={handleFileChange} accept="image/*" disabled={isSubmitting} />
                                                                        <Button variant="outline" className="w-full" onClick={() => receiptFileRef.current?.click()} disabled={isSubmitting}>
                                                                            <Upload className="mr-2 h-4 w-4"/> {t("Upload Photo")}
                                                                        </Button>
                                                                    </div>
                                                                    {receiptPreview && (
                                                                        <div className="border rounded-md p-2">
                                                                            <p className="text-xs text-muted-foreground truncate mb-2">{receiptPhoto?.name}</p>
                                                                            <Image src={receiptPreview} alt="Receipt preview" width={400} height={400} className="w-full h-auto rounded-md object-contain" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </ScrollArea>
                                                            <Button className="w-full mt-4" onClick={() => handleSubmitReceipt(selectedPayment.id)} disabled={isSubmitting || !orNumber || !receiptPhoto}>
                                                                {isSubmitting ? (
                                                                    <>
                                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                        {t("Submitting...")}
                                                                    </>
                                                                ) : (
                                                                    t("Submit Receipt")
                                                                )}
                                                            </Button>
                                                        </>
                                                     )}
                                                </DialogContent>
                                            </Dialog>
                                        )}
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
      
        <Card>
            <CardHeader>
                <CardTitle>{t("Payment History")}</CardTitle>
                <CardDescription>{t("Your past payment transactions.")}</CardDescription>
            </CardHeader>
            <CardContent>
                {paymentHistory.length > 0 ? (
                     <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t("Transaction ID")}</TableHead>
                                    <TableHead>{t("Date")}</TableHead>
                                    <TableHead>{t("Amount")}</TableHead>
                                    <TableHead>{t("Status")}</TableHead>
                                    <TableHead className="text-right">{t("E-Receipt")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paymentHistory.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell className="font-mono text-xs">{payment.transactionId}</TableCell>
                                        <TableCell>{payment.date}</TableCell>
                                        <TableCell>₱{payment.amount.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(payment.status)}>{t(payment.status)}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                     <Button variant="outline" size="icon" onClick={() => setSelectedPayment(payment)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    {selectedPayment && (
                                                         <>
                                                            <DialogHeader>
                                                                <DialogTitle>{t("E-Receipt")}</DialogTitle>
                                                                <DialogDescription>Transaction ID: {selectedPayment.transactionId}</DialogDescription>
                                                            </DialogHeader>
                                                            <ScrollArea className="max-h-[60vh]">
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
                                                                     {inspections.find(i => i.registrationId === selectedPayment.registrationId)?.feeSummary && (
                                                                        <div>
                                                                            <h4 className="font-medium text-sm mb-2">{t("Fee Breakdown")}</h4>
                                                                            <div className="space-y-1">
                                                                                {inspections.find(i => i.registrationId === selectedPayment.registrationId)!.feeSummary!.items.map(item => (
                                                                                    <div key={item.item} className="flex justify-between items-center text-sm">
                                                                                        <span>
                                                                                            {item.item}
                                                                                            {item.hasQuantity && item.quantity > 1 && (
                                                                                                <span className="text-muted-foreground text-xs ml-2"> (x{item.quantity})</span>
                                                                                            )}
                                                                                        </span>
                                                                                        <span>Php {(item.fee * item.quantity).toFixed(2)}</span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                            <Separator className="my-2"/>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex justify-between items-center font-bold text-lg">
                                                                        <span>Total Amount:</span>
                                                                        <span>₱{selectedPayment.amount.toFixed(2)}</span>
                                                                    </div>
                                                                </div>
                                                            </ScrollArea>
                                                        </>
                                                    )}
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-8">{t("No payment history available.")}</p>
                )}
            </CardContent>
        </Card>
      
        <Card>
            <CardHeader>
                <CardTitle>{t("Fees Guideline")}</CardTitle>
                <CardDescription>{t("Based on Municipal Ordinance 6-2010 and Municipal Revenue Code.")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg mb-2">VESSELS REGISTRATION FEE ANNUAL FEE</h3>
                    <div className="rounded-md border">
                        <Table>
                            <TableBody>
                                {feeCategories.vessels.map(item => (
                                    <TableRow key={item.item}>
                                        <TableCell className="font-medium">{item.item}</TableCell>
                                        <TableCell className="text-right">{item.fee}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-2">CERTIFICATES</h3>
                     <div className="rounded-md border">
                        <Table>
                            <TableBody>
                                {feeCategories.certificates.map(item => (
                                    <TableRow key={item.item}>
                                        <TableCell className="font-medium">{item.item}</TableCell>
                                        <TableCell className="text-right">{item.fee}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg mb-2">LICENSE FEE ANNUAL FEE</h3>
                    <div className="space-y-4">
                        <h4 className="font-semibold">A. Fisherfolks using nets</h4>
                         <div className="rounded-md border">
                            <Table>
                                <TableBody>
                                    {feeCategories.nets.map(item => (
                                        <TableRow key={item.item}>
                                            <TableCell className="font-medium">{item.item}</TableCell>
                                            <TableCell className="text-right">{item.fee}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <h4 className="font-semibold">B. Fisherfolks Using Other Fishing Gears</h4>
                         <div className="rounded-md border">
                            <Table>
                                <TableBody>
                                    {feeCategories.otherGears.map(item => (
                                        <TableRow key={item.item}>
                                            <TableCell className="font-medium">{item.item}</TableCell>
                                            <TableCell className="text-right">{item.fee}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <h4 className="font-semibold">C. Fisherfolk using traps/gears</h4>
                         <div className="rounded-md border">
                            <Table>
                                <TableBody>
                                    {feeCategories.traps.map(item => (
                                        <TableRow key={item.item}>
                                            <TableCell className="font-medium">{item.item}</TableCell>
                                            <TableCell className="text-right">{item.fee}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <h4 className="font-semibold">D. Fisherfolks Using Hook and Line</h4>
                         <div className="rounded-md border">
                            <Table>
                                <TableBody>
                                    {feeCategories.hookAndLine.map(item => (
                                        <TableRow key={item.item}>
                                            <TableCell className="font-medium">{item.item}</TableCell>
                                            <TableCell className="text-right">{item.fee}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
    </>
  );
}
