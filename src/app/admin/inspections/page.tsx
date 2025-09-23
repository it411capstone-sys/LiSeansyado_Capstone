
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type Checklist, type Inspection, type FeeSummary, Payment, Registration } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Upload, X, QrCode, Bell, Receipt, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/contexts/language-context";
import React, { useMemo, useRef, useState, Suspense, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import Image from "next/image";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogContent as AlertDialogContentComponent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { db, storage } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc, deleteDoc, addDoc, query, orderBy, where, getDocs } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { compressImage } from "@/lib/image-compression";

const feeCategories = {
    vessels: [
        { item: "Pump boat less than 10 HP", fee: 330.00 },
        { item: "Pump boat 10 HP to 16 HP", fee: 360.00 },
        { item: "Pump boat 16 HP and above but less than 3 G.T", fee: 500.00 },
        { item: "Non-motorized fishing boat", fee: 50.00 },
        { item: "Banca with sail (layag)", fee: 50.00 },
        { item: "Municipal fisherfolk", fee: 50.00 },
    ],
    certificates: [
        { item: "CERTIFICATE OF NUMBER", fee: 120.00 },
        { item: "PERMIT TO OPERATE", fee: 120.00 },
        { item: "MOTORBOAT OPERATORS PERMIT", fee: 120.00 },
    ],
    nets: [
        { item: "For each pocot 5 bundles below (length)", fee: 200.00 },
        { item: "For each pocot 5-10 bundles (length)", fee: 300.00 },
        { item: "For each additional 1 bundle in length", fee: 50.00, hasQuantity: true, unit: "bundle" },
        { item: "Anod", fee: 20.00 },
        { item: "Pamarongoy with motorboat", fee: 100.00 },
        { item: "Pamarongoy without motorboat", fee: 50.00 },
        { item: "Palaran or drift gill net (panglaklak) - 1-10m", fee: 100.00 },
        { item: "Palaran or drift gill net (panglaklak) - 10-25m", fee: 120.00 },
        { item: "Palaran or drift gill net (panglaklak) - 25m+", fee: 150.00 },
        { item: "Panganduhaw or Panulid - 20-50m", fee: 200.00 },
        { item: "Panganduhaw or Panulid - additional 50m", fee: 20.00, hasQuantity: true, unit: "50m" },
        { item: "Sapyao / sarap", fee: 200.00 },
        { item: "Pamo / Pamangsi", fee: 600.00 },
        { item: "Basnig / baling", fee: 800.00 },
        { item: "Baling (special permit)", fee: 350.00 },
    ],
    otherGears: [
        { item: "Lamp and spear", fee: 50.00 },
        { item: "Bow and Arrow with light", fee: 100.00 },
        { item: "Scoop net with light (sarap)", fee: 100.00 },
        { item: "Jigs (squid – kayongkong. Ect)", fee: 50.00 },
    ],
    traps: [
        { item: "Crab lift net (pintol)", fee: 50.00 },
        { item: "Crab lift net - In excess to 100 sq.m", fee: 2.00, hasQuantity: true, unit: "sq.m." },
        { item: "Crab pot (panggal/anglambay/bantak)", fee: 50.00 },
        { item: "Crab pot - In excess of 100 sq.m.", fee: 2.00, hasQuantity: true, unit: "sq.m." },
        { item: "Lobster pot (bubo pagbanagan)", fee: 110.00 },
        { item: "Lobster pot - In excess of 100 sq.m.", fee: 3.00, hasQuantity: true, unit: "sq.m." },
        { item: "Fish Pot-large (bubo-hampas, pangal, timing)", fee: 110.00 },
        { item: "Fish Pot-large - In excess of 100 sq.m.", fee: 3.00, hasQuantity: true, unit: "sq.m." },
        { item: "Squid Pot (bubo pangnokus) Bungsod", fee: 110.00 },
        { item: "Squid Pot - In excess of 100 sq.m.", fee: 3.00, hasQuantity: true, unit: "sq.m" },
        { item: "Bungsod", fee: 150.00 },
    ],
    hookAndLine: [
        { item: "Simple Hook and lines (bira-bira; pamingwit; ton-ton)", fee: 100.00 },
        { item: "Hook and lines with float (pamataw)", fee: 100.00 },
        { item: "Multiple handline (undak-undak; birabira; tuwang-tuwang)", fee: 100.00 },
        { item: "Drag handlines (Margati/bahan)", fee: 300.00 },
        { item: "Troll line (lambu; palangre – lutaw)", fee: 170.00 },
    ],
};


function AdminInspectionsPageContent() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [inspections, setInspections] = useState<Inspection[]>([]);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [selectedInspectionToConduct, setSelectedInspectionToConduct] = useState<Inspection | null>(null);
    const [checklist, setChecklist] = useState<Checklist>({
        vesselMatch: false,
        gearMatch: false,
        profileUpToDate: false,
        safetyAdequate: false,
        noIllegalMods: false,
    });
    const [inspectorNotes, setInspectorNotes] = useState("");
    const [photos, setPhotos] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedInspectionForDetails, setSelectedInspectionForDetails] = useState<Inspection | null>(null);
    const [inspectorName, setInspectorName] = useState("");
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationInspection, setNotificationInspection] = useState<Inspection | null>(null);
    
    const [isFeeDialogOpen, setIsFeeDialogOpen] = useState(false);
    const [submittedFeeSummary, setSubmittedFeeSummary] = useState<FeeSummary | null>(null);
    const [selectedFees, setSelectedFees] = useState<Record<string, boolean>>({});
    const [feeQuantities, setFeeQuantities] = useState<Record<string, number>>({});
    const [totalFee, setTotalFee] = useState(0);
    const [feeView, setFeeView] = useState<'selection' | 'summary'>('selection');

    useEffect(() => {
        const q = query(collection(db, "inspections"), orderBy("scheduledDate", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const inspectionsData: Inspection[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                inspectionsData.push({ 
                    id: doc.id, 
                    ...data,
                    scheduledDate: data.scheduledDate.toDate() // Convert Timestamp to Date
                } as Inspection);
            });
            setInspections(inspectionsData);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const q = query(collection(db, "registrations"), where("status", "==", "Pending"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const regs: Registration[] = [];
            querySnapshot.forEach((doc) => {
                regs.push({ id: doc.id, ...doc.data() } as Registration);
            });
            setRegistrations(regs);
        });
        return () => unsubscribe();
    }, []);

    const scheduledInspections = useMemo(() => 
        inspections.filter(i => i.status === 'Scheduled'), 
    [inspections]);

    const calculateTotalFee = (
        currentSelectedFees: Record<string, boolean>,
        currentQuantities: Record<string, number>
    ) => {
        let total = 0;
        const allFees = Object.values(feeCategories).flat();
        for (const key in currentSelectedFees) {
            if (currentSelectedFees[key]) {
                const feeItem = allFees.find(item => item.item === key);
                if (feeItem) {
                    if (feeItem.hasQuantity) {
                        total += feeItem.fee * (currentQuantities[key] || 1);
                    } else {
                        total += feeItem.fee;
                    }
                }
            }
        }
        setTotalFee(total);
    };

    const handleFeeSelection = (item: string, isSelected: boolean) => {
        const newSelected = { ...selectedFees, [item]: isSelected };
        setSelectedFees(newSelected);
        calculateTotalFee(newSelected, feeQuantities);
    };

    const handleQuantityChange = (item: string, quantity: string) => {
        const numQuantity = Number(quantity) || 1;
        const newQuantities = { ...feeQuantities, [item]: numQuantity };
        setFeeQuantities(newQuantities);
        calculateTotalFee(selectedFees, newQuantities);
    };
    
    const handleSubmitFees = async () => {
        if (!selectedInspectionToConduct) return;
    
        const allFeeItems = Object.values(feeCategories).flat();
        const summary: FeeSummary = {
            items: allFeeItems
                .filter(item => selectedFees[item.item])
                .map(item => ({
                    ...item,
                    quantity: feeQuantities[item.item] || 1,
                })),
            total: totalFee,
        };
        setSubmittedFeeSummary(summary);
        setIsFeeDialogOpen(false);
        setFeeView('selection');
    
        const registration = registrations.find(r => r.id === selectedInspectionToConduct.registrationId);
        if (registration) {
            try {
                await addDoc(collection(db, "payments"), {
                    transactionId: `PAY-${Date.now()}`,
                    referenceNumber: 'N/A',
                    date: new Date().toISOString().split('T')[0],
                    payerId: registration.ownerId,
                    payerName: registration.ownerName,
                    registrationId: registration.id,
                    amount: summary.total,
                    status: 'Pending',
                    paymentMethod: 'Over-the-Counter'
                });
                toast({
                    title: "Fees Submitted",
                    description: `A new pending payment for ${registration.ownerName} has been created.`,
                });
            } catch (error) {
                console.error("Error creating payment record: ", error);
                toast({ variant: "destructive", title: "Error", description: "Could not create payment record." });
            }
        }
    };

    const handleChecklistChange = (key: keyof typeof checklist) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };
    
    const handleSelectInspectionToConduct = (inspectionId: string) => {
        const inspection = inspections.find(i => i.id === inspectionId);
        if (inspection) {
            setSelectedInspectionToConduct(inspection);
            setInspectorName(inspection.inspector === "Not Assigned" ? "" : inspection.inspector);
            setChecklist(inspection.checklist || { vesselMatch: false, gearMatch: false, profileUpToDate: false, safetyAdequate: false, noIllegalMods: false });
            setInspectorNotes(inspection.inspectorNotes || "");
            setPhotos([]);
            setSubmittedFeeSummary(null);
        }
    };

    const checklistItems = [
        { id: 'vesselMatch', label: "Vessel details match records" },
        { id: 'gearMatch', label: "Gear details match records" },
        { id: 'profileUpToDate', label: "Fisherman profile is up-to-date" },
        { id: 'safetyAdequate', label: "Safety equipment is adequate" },
        { id: 'noIllegalMods', label: "No illegal modifications found" }
    ] as const;

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setPhotos(prev => [...prev, ...Array.from(event.target.files!)]);
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const handleDeleteInspection = async (inspectionId: string) => {
        try {
            await deleteDoc(doc(db, "inspections", inspectionId));
            toast({ title: "Inspection Deleted" });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not delete inspection." });
        }
    };


    const handleSubmitInspection = async () => {
        if (!selectedInspectionToConduct) {
            toast({
                variant: "destructive",
                title: t("No Inspection Selected"),
                description: t("Please select an inspection to conduct."),
            });
            return;
        }

        if (!inspectorName.trim()) {
            toast({
                variant: "destructive",
                title: "Inspector Name Required",
                description: "Please enter the inspector's name before submitting.",
            });
            return;
        }

        const isCompliant = Object.values(checklist).every(item => item === true);

        // Upload photos to Firebase Storage
        const photoUploads = photos.map(async (photo) => {
            const compressedPhoto = await compressImage(photo);
            const photoRef = ref(storage, `inspections/${selectedInspectionToConduct.id}/${compressedPhoto.name}`);
            await uploadBytes(photoRef, compressedPhoto);
            const url = await getDownloadURL(photoRef);
            return { name: compressedPhoto.name, url };
        });

        try {
            const uploadedPhotos = await Promise.all(photoUploads);

            const updatedData: Partial<Inspection> = {
                inspector: inspectorName,
                status: isCompliant ? 'Completed' : 'Flagged',
                checklist,
                inspectorNotes,
                photos: uploadedPhotos,
                feeSummary: submittedFeeSummary,
            };
        
            const inspectionRef = doc(db, "inspections", selectedInspectionToConduct.id);
            await updateDoc(inspectionRef, updatedData);

            const fullyUpdatedInspection = { ...selectedInspectionToConduct, ...updatedData };
            setSelectedInspectionForDetails(fullyUpdatedInspection);

            toast({
                title: t("Inspection Submitted"),
                description: t("The inspection for {vesselName} has been recorded.").replace('{vesselName}', selectedInspectionToConduct.vesselName),
            });

            setSelectedInspectionToConduct(null);
            setInspectorName("");
            setInspectorNotes("");
            setPhotos([]);
            setSubmittedFeeSummary(null);
            setChecklist({ vesselMatch: false, gearMatch: false, profileUpToDate: false, safetyAdequate: false, noIllegalMods: false });

        } catch (error) {
            console.error("Error submitting inspection: ", error);
            toast({ variant: "destructive", title: "Error", description: "Could not submit inspection." });
        }
    };

    const updateInspectionStatus = async (id: string, status: Inspection['status']) => {
        try {
            await updateDoc(doc(db, "inspections", id), { status });
            toast({ title: "Status Updated", description: `Inspection marked as ${status}.` });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not update status." });
        }
    };
    
    const sortedInspections = useMemo(() => inspections, [inspections]);

    const handleOpenNotificationDialog = async (inspection: Inspection) => {
        setNotificationInspection(inspection);
        const regSnapshot = await getDocs(query(collection(db, "registrations"), where("id", "==", inspection.registrationId)));
        const owner = regSnapshot.docs.length > 0 ? regSnapshot.docs[0].data() as Registration : null;

        const salutation = `Dear ${owner?.ownerName || 'User'},\n\n`;
        const signature = `\n\nThank you,\nLiSEAnsyado Admin`;
        let bodyMessage = "";
        
        if (inspection.status === 'Completed' && inspection.feeSummary) {
            bodyMessage = `Good news! Your inspection for "${inspection.vesselName}" (${inspection.registrationId}) was successful. Your payment due is Php ${inspection.feeSummary.total.toFixed(2)}. Please proceed to the Municipal Treasurer's Office to settle your payment.`;
        } else if (inspection.status === 'Completed') {
            bodyMessage = `Good news! Your inspection for vessel/gear "${inspection.vesselName}" (${inspection.registrationId}) conducted on ${format(inspection.scheduledDate, 'PPp')} was successful and marked as complete.`;
        } else if (inspection.status === 'Flagged') {
            bodyMessage = `This is to inform you that your inspection for vessel/gear "${inspection.vesselName}" (${inspection.registrationId}) conducted on ${format(inspection.scheduledDate, 'PPp')} has been flagged for the following reason: ${inspection.inspectorNotes || 'Please contact the office for details.'}. Please address the issue and schedule a re-inspection.`;
        }
        setNotificationMessage(`${salutation}${bodyMessage}${signature}`);
    }

    const handleSendNotification = async () => {
        if (!notificationInspection) return;

        const regSnapshot = await getDocs(query(collection(db, "registrations"), where("id", "==", notificationInspection.registrationId)));
        const registration = regSnapshot.docs.length > 0 ? { id: regSnapshot.docs[0].id, ...regSnapshot.docs[0].data() } as Registration : null;
        
        if (registration) {
             try {
                await addDoc(collection(db, "notifications"), {
                    userId: registration.email,
                    date: new Date().toISOString(),
                    title: "Inspection Update",
                    message: notificationMessage,
                    isRead: false,
                    type: notificationInspection.status === 'Completed' ? 'Success' : 'Alert'
                });
                toast({
                    title: t("Notification Sent"),
                    description: `Notification for ${notificationInspection.vesselName} has been sent.`,
                });
            } catch (error) {
                toast({ variant: "destructive", title: "Error", description: "Failed to send notification." });
            }
        }
        setNotificationInspection(null);
    }
    
    const allFeeItems = Object.values(feeCategories).flat();
    const selectedFeeItems = allFeeItems.filter(item => selectedFees[item.item]);
    const isChecklistComplete = Object.values(checklist).every(item => item === true);

  return (
    <Dialog>
    <AlertDialog>
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>{t("Inspection Schedule")}</CardTitle>
                <CardDescription>{t("Manage upcoming and past inspections.")}</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>{t("Vessel/Gear")}</TableHead>
                        <TableHead>{t("Inspector")}</TableHead>
                        <TableHead>{t("Date")}</TableHead>
                        <TableHead>{t("Status")}</TableHead>
                        <TableHead>{t("Actions")}</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {sortedInspections.map((inspection) => (
                        <TableRow key={inspection.id}>
                        <TableCell className="font-medium">
                            {inspection.vesselName}
                            <div className="text-xs text-muted-foreground">{inspection.registrationId}</div>
                        </TableCell>
                        <TableCell>{inspection.inspector}</TableCell>
                        <TableCell>{format(inspection.scheduledDate, 'PPp')}</TableCell>
                        <TableCell>
                            <Badge variant={inspection.status === 'Flagged' ? 'destructive' : inspection.status === 'Completed' ? 'default' : 'outline'}>{t(inspection.status)}</Badge>
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">{t("Toggle menu")}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem onSelect={() => setSelectedInspectionForDetails(inspection)} disabled={!inspection.checklist}>
                                        {t("View Details")}
                                    </DropdownMenuItem>
                                </DialogTrigger>
                                <DropdownMenuItem onSelect={() => updateInspectionStatus(inspection.id, 'Completed')}>{t("Mark as Complete")}</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => updateInspectionStatus(inspection.id, 'Flagged')}>{t("Flag Issue")}</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onSelect={() => handleDeleteInspection(inspection.id)}>{t("Delete Inspection")}</DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t("Inspection Form")}</CardTitle>
                    <CardDescription>{t("Fill out the form to conduct an inspection.")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Select onValueChange={handleSelectInspectionToConduct} value={selectedInspectionToConduct?.id || ''}>
                        <SelectTrigger>
                            <SelectValue placeholder={t("Select an inspection to conduct")} />
                        </SelectTrigger>
                        <SelectContent>
                            {scheduledInspections.map(insp => (
                                <SelectItem key={insp.id} value={insp.id}>
                                    {insp.vesselName} ({insp.registrationId})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                    {selectedInspectionToConduct && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="inspector-name">{t("Inspector Name")}</Label>
                                <Input 
                                    id="inspector-name" 
                                    placeholder="Enter inspector's name"
                                    value={inspectorName}
                                    onChange={(e) => setInspectorName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-4 pt-4">
                                <div>
                                    <h4 className="font-medium text-sm mb-2">{t("Compliance Checklist")}</h4>
                                    <div className="space-y-2">
                                        {checklistItems.map(item => (
                                            <div key={item.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={item.id}
                                                    checked={checklist[item.id]}
                                                    onCheckedChange={() => handleChecklistChange(item.id)}
                                                />
                                                <Label htmlFor={item.id} className="text-sm font-normal">
                                                    {t(item.label)}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="inspector-notes">{t("Inspector Notes")}</Label>
                                    <Textarea id="inspector-notes" placeholder={t("Type your notes here...")} value={inspectorNotes} onChange={(e) => setInspectorNotes(e.target.value)} />
                                </div>

                                <div>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                    />
                                    <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                                        <Upload className="mr-2 h-4 w-4" /> {t("Upload Photos")}
                                    </Button>
                                    {photos.length > 0 && (
                                        <div className="mt-4 grid grid-cols-2 gap-2">
                                            {photos.map((photo, index) => (
                                                <div key={index} className="relative group">
                                                    <Image
                                                        src={URL.createObjectURL(photo)}
                                                        alt={`preview ${index}`}
                                                        width={100}
                                                        height={100}
                                                        className="w-full h-auto rounded-md object-cover"
                                                    />
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                                                        onClick={() => removePhoto(index)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                    <p className="text-xs text-muted-foreground truncate mt-1">{photo.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {submittedFeeSummary && (
                                    <div>
                                        <Separator className="my-4"/>
                                        <h4 className="font-medium text-sm mb-2">{t("Submitted Fee Summary")}</h4>
                                        <Card className="bg-muted/50">
                                            <CardContent className="p-4 space-y-2">
                                                {submittedFeeSummary.items.map(item => (
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
                                                <Separator/>
                                                <div className="flex justify-between items-center font-bold">
                                                    <span>TOTAL</span>
                                                    <span>Php {submittedFeeSummary.total.toFixed(2)}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </div>
                            
                            {isChecklistComplete && (
                                <Dialog open={isFeeDialogOpen} onOpenChange={(open) => {
                                    setIsFeeDialogOpen(open);
                                    if (!open) setFeeView('selection');
                                }}>
                                    <DialogTrigger asChild>
                                        <Button variant="secondary" className="w-full" disabled={!selectedInspectionToConduct}>
                                            <Receipt className="mr-2 h-4 w-4" /> Fees guideline
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Fees Guideline</DialogTitle>
                                            <DialogDescription>Select applicable fees to calculate the total amount.</DialogDescription>
                                        </DialogHeader>
                                        {feeView === 'selection' ? (
                                        <>
                                        <ScrollArea className="max-h-[60vh] p-1">
                                        <div className="space-y-6 p-1">
                                            {Object.entries({
                                                "VESSELS REGISTRATION FEE": feeCategories.vessels,
                                                "CERTIFICates": feeCategories.certificates,
                                                "LICENSE FEE: Fishefolks using nets": feeCategories.nets,
                                                "LICENSE FEE: Fisherfolks Using Other Fishing Gears": feeCategories.otherGears,
                                                "LICENSE FEE: Fisherfolk using traps/gears": feeCategories.traps,
                                                "LICENSE FEE: Fisherfolks Using Hook and Line": feeCategories.hookAndLine,
                                            }).map(([category, items]) => (
                                                <div key={category}>
                                                    <h4 className="font-bold mb-2">{category}</h4>
                                                    <Table>
                                                        <TableBody>
                                                            {items.map(item => (
                                                                <TableRow key={item.item}>
                                                                    <TableCell className="w-10">
                                                                        <Checkbox
                                                                            id={item.item}
                                                                            checked={selectedFees[item.item]}
                                                                            onCheckedChange={(checked) => handleFeeSelection(item.item, !!checked)}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Label htmlFor={item.item}>{item.item}</Label>
                                                                    </TableCell>
                                                                    <TableCell className="w-40">
                                                                        {item.hasQuantity && (
                                                                            <div className="flex items-center gap-2">
                                                                                <Input 
                                                                                    type="number" 
                                                                                    className="w-20 h-8" 
                                                                                    placeholder="Qty"
                                                                                    value={feeQuantities[item.item] || ''}
                                                                                    onChange={(e) => handleQuantityChange(item.item, e.target.value)}
                                                                                    disabled={!selectedFees[item.item]}
                                                                                />
                                                                                <span className="text-xs text-muted-foreground">{item.unit}</span>
                                                                            </div>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        Php {item.fee.toFixed(2)}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            ))}
                                        </div>
                                        </ScrollArea>
                                        <Separator />
                                        <div className="flex justify-between items-center p-4">
                                            <div className="font-bold text-lg">
                                                <span>TOTAL: </span>
                                                <span>Php {totalFee.toFixed(2)}</span>
                                            </div>
                                            <Button onClick={() => setFeeView('summary')}>Proceed</Button>
                                        </div>
                                        </>
                                        ) : (
                                        <div className="p-4">
                                            <h3 className="text-lg font-bold mb-4">Fee Summary</h3>
                                            <ScrollArea className="max-h-[50vh] p-1">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Item</TableHead>
                                                            <TableHead className="text-right">Amount</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {selectedFeeItems.map(item => (
                                                            <TableRow key={item.item}>
                                                                <TableCell>
                                                                    {item.item}
                                                                    {item.hasQuantity && feeQuantities[item.item] > 1 && (
                                                                        <span className="text-muted-foreground text-xs ml-2">
                                                                            (x{feeQuantities[item.item]} {item.unit})
                                                                        </span>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    Php {(item.hasQuantity ? item.fee * (feeQuantities[item.item] || 1) : item.fee).toFixed(2)}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </ScrollArea>
                                            <Separator className="my-4"/>
                                            <div className="flex justify-between items-center font-bold text-lg">
                                                <span>TOTAL:</span>
                                                <span>Php {totalFee.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-end gap-2 mt-4">
                                                <Button variant="outline" onClick={() => setFeeView('selection')}>
                                                    <ArrowLeft className="mr-2 h-4 w-4"/> Back
                                                </Button>
                                                <Button onClick={handleSubmitFees}>Submit Fees</Button>
                                            </div>
                                        </div>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            )}
                            <Button className="w-full mt-2" disabled={!selectedInspectionToConduct} onClick={handleSubmitInspection}>
                                {t("Submit Inspection")}
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>{t('Inspection Details')}</DialogTitle>
                <DialogDescription>{t("Review the submitted inspection form.")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-medium text-sm mb-1">{t("Inspection Date")}</h4>
                        <p className="text-sm text-muted-foreground">{selectedInspectionForDetails ? format(selectedInspectionForDetails.scheduledDate, 'PPp') : 'N/A'}</p>
                    </div>
                     <div>
                        <h4 className="font-medium text-sm mb-1">{t("Inspector Name")}</h4>
                        <p className="text-sm text-muted-foreground">{selectedInspectionForDetails?.inspector || 'N/A'}</p>
                    </div>
                </div>
                <div>
                    <h4 className="font-medium text-sm mb-2">{t("Compliance Checklist")}</h4>
                    <div className="space-y-2">
                         {selectedInspectionForDetails?.checklist && checklistItems.map(item => (
                            <div key={item.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`view-${item.id}`}
                                    checked={selectedInspectionForDetails.checklist![item.id]}
                                    disabled
                                />
                                <Label htmlFor={`view-${item.id}`} className="text-sm font-normal">
                                    {t(item.label)}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="font-medium text-sm mb-2">{t("Inspector Notes")}</h4>
                    {selectedInspectionForDetails?.inspectorNotes ? (
                        <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">{selectedInspectionForDetails.inspectorNotes}</p>
                    ) : (
                        <p className="text-sm text-muted-foreground">{t("No notes were provided for this inspection.")}</p>
                    )}
                </div>
                 <div>
                    <h4 className="font-medium text-sm mb-2">{t("Inspection Photos")}</h4>
                    {selectedInspectionForDetails?.photos && selectedInspectionForDetails.photos.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                            {selectedInspectionForDetails.photos.map((photo, index) => (
                                <div key={index} className="relative">
                                    <Image
                                        src={photo.url}
                                        alt={photo.name}
                                        width={200}
                                        height={200}
                                        className="w-full h-auto rounded-md object-cover"
                                    />
                                     <p className="text-xs text-muted-foreground truncate mt-1">{photo.name}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">{t("No photos were uploaded for this inspection.")}</p>
                    )}
                </div>
                {selectedInspectionForDetails?.feeSummary && (
                    <div>
                        <h4 className="font-medium text-sm mb-2">{t("Fee Summary")}</h4>
                        <Card className="bg-muted/50">
                            <CardContent className="p-4 space-y-2">
                                {selectedInspectionForDetails.feeSummary.items.map(item => (
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
                                <Separator/>
                                <div className="flex justify-between items-center font-bold">
                                    <span>TOTAL</span>
                                    <span>Php {selectedInspectionForDetails.feeSummary.total.toFixed(2)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
                <div>
                    <h4 className="font-medium text-sm mb-2">{t("Registration QR Code")}</h4>
                    <div className="flex justify-center p-2 border rounded-md">
                        {selectedInspectionForDetails && <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedInspectionForDetails.registrationId}`} width={150} height={150} alt={`QR Code for ${selectedInspectionForDetails.registrationId}`} />}
                    </div>
                </div>
                <AlertDialogTrigger asChild>
                     <Button variant="outline" className="w-full" onClick={() => selectedInspectionForDetails && handleOpenNotificationDialog(selectedInspectionForDetails)}>
                        <Bell className="mr-2 h-4 w-4"/> {t("Notify User")}
                    </Button>
                </AlertDialogTrigger>
            </div>
        </DialogContent>
        <AlertDialogContentComponent>
            <AlertDialogHeader>
                <AlertDialogTitle>{t("Notify of Inspection Status")}</AlertDialogTitle>
                <AlertDialogDescription>{t("Customize and send a notification about the inspection status.")}</AlertDialogDescription>
            </AlertDialogHeader>
            <Textarea 
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                rows={8}
            />
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setNotificationInspection(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSendNotification}>Send Notification</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContentComponent>
    </div>
    </AlertDialog>
    </Dialog>
  );
}

export default function AdminInspectionsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminInspectionsPageContent />
        </Suspense>
    );
}
    

    



    


    
