
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inspections as initialInspections, Inspection as InitialInspectionType, registrations } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, QrCode, Upload, X, Calendar as CalendarIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/contexts/language-context";
import React, { useMemo, useRef, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import Image from "next/image";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type Checklist = {
    vesselMatch: boolean;
    gearMatch: boolean;
    profileUpToDate: boolean;
    safetyAdequate: boolean;
    noIllegalMods: boolean;
};

type Inspection = InitialInspectionType & {
    checklist: Checklist | null;
    inspectorNotes: string | null;
    photos: { name: string, url: string }[] | null;
};

const translationKeys = [
    "Inspection Schedule",
    "Manage upcoming and past inspections.",
    "Vessel/Gear",
    "Inspector",
    "Date",
    "Status",
    "Actions",
    "New Inspection",
    "Fill out the form to conduct an inspection.",
    "Start Inspection",
    "Generate QR Code",
    "View Details",
    "Mark as Complete",
    "Flag Issue",
    "Cancel Inspection",
    "Select a registration to inspect",
    "Compliance Checklist",
    "Vessel details match records",
    "Gear details match records",
    "Fisherman profile is up-to-date",
    "Safety equipment is adequate",
    "No illegal modifications found",
    "Inspector Notes",
    "Type your notes here...",
    "Upload Photos",
    "Submit Inspection",
    "Inspection Submitted",
    "The inspection for {vesselName} has been recorded.",
    "Please select a registration to inspect.",
    "No Registration Selected",
    "Please select a registration from the dropdown first.",
    "Generated QR Code for {id}",
    "Scan this QR code to view registration details.",
    "Inspection Details",
    "Review the submitted inspection form.",
    "Inspection Photos",
    "No photos were uploaded for this inspection.",
    "No notes were provided for this inspection.",
    "Inspection Date",
    "Inspector Name"
];

export default function AdminInspectionsPage() {
    const { t } = useTranslation(translationKeys);
    const { toast } = useToast();
    const [inspections, setInspections] = useState<Inspection[]>(
        initialInspections.map(i => ({...i, checklist: null, inspectorNotes: null, photos: null}))
    );
    const [selectedRegistrationId, setSelectedRegistrationId] = useState<string | null>(null);
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
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
    const [inspectionDate, setInspectionDate] = useState<Date | undefined>(new Date());
    const [inspectorName, setInspectorName] = useState("");


    const handleChecklistChange = (key: keyof typeof checklist) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const selectedRegistration = registrations.find(r => r.id === selectedRegistrationId);

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

    const handleUpdateInspectionStatus = (inspectionId: string, status: Inspection['status']) => {
        setInspections(prev =>
            prev.map(inspection =>
                inspection.id === inspectionId ? { ...inspection, status } : inspection
            )
        );
    };

    const handleCancelInspection = (inspectionId: string) => {
        setInspections(prev => prev.filter(inspection => inspection.id !== inspectionId));
    };


    const handleSubmitInspection = () => {
        if (!selectedRegistration) {
            toast({
                variant: "destructive",
                title: "Error",
                description: t("Please select a registration to inspect."),
            });
            return;
        }

        const isCompliant = Object.values(checklist).every(item => item === true);
        const newInspection: Inspection = {
            id: `INSP-${String(inspections.length + 1).padStart(3, '0')}`,
            registrationId: selectedRegistration.id,
            vesselName: selectedRegistration.vesselName,
            inspector: inspectorName || "Admin User",
            scheduledDate: format(inspectionDate || new Date(), 'yyyy-MM-dd'),
            status: isCompliant ? 'Completed' : 'Flagged',
            checklist,
            inspectorNotes,
            photos: photos.map(p => ({ name: p.name, url: URL.createObjectURL(p) })),
        };

        setInspections(prev => [newInspection, ...prev]);
        console.log("Submitted photos:", photos);

        toast({
            title: t("Inspection Submitted"),
            description: t("The inspection for {vesselName} has been recorded.").replace('{vesselName}', selectedRegistration.vesselName),
        });

        // Reset form
        setSelectedRegistrationId(null);
        setChecklist({
            vesselMatch: false,
            gearMatch: false,
            profileUpToDate: false,
            safetyAdequate: false,
            noIllegalMods: false,
        });
        setInspectorNotes("");
        setPhotos([]);
        setInspectionDate(new Date());
        setInspectorName("");
    };

    const handleGenerateQrCode = () => {
        if (selectedRegistration) {
            setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedRegistration.id}`);
        } else {
            toast({
                variant: "destructive",
                title: t("No Registration Selected"),
                description: t("Please select a registration from the dropdown first."),
            });
        }
    };
    
    const sortedInspections = useMemo(() => 
        [...inspections].sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()),
    [inspections]);

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
                        <TableCell>{inspection.scheduledDate}</TableCell>
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
                                    <DropdownMenuItem onSelect={() => setSelectedInspection(inspection)} disabled={!inspection.checklist}>
                                        {t("View Details")}
                                    </DropdownMenuItem>
                                </DialogTrigger>
                                <DropdownMenuItem onSelect={() => handleUpdateInspectionStatus(inspection.id, 'Completed')}>{t("Mark as Complete")}</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleUpdateInspectionStatus(inspection.id, 'Flagged')}>{t("Flag Issue")}</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onSelect={() => handleCancelInspection(inspection.id)}>{t("Cancel Inspection")}</DropdownMenuItem>
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
                    <CardTitle>{t("New Inspection")}</CardTitle>
                    <CardDescription>{t("Fill out the form to conduct an inspection.")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Select onValueChange={setSelectedRegistrationId} value={selectedRegistrationId || ''}>
                        <SelectTrigger>
                            <SelectValue placeholder={t("Select a registration to inspect")} />
                        </SelectTrigger>
                        <SelectContent>
                            {registrations.map(reg => (
                                <SelectItem key={reg.id} value={reg.id}>
                                    {reg.vesselName} ({reg.id})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="space-y-2">
                        <Label htmlFor="inspector-name">{t("Inspector Name")}</Label>
                        <Input 
                            id="inspector-name" 
                            placeholder="Enter inspector's name"
                            value={inspectorName}
                            onChange={(e) => setInspectorName(e.target.value)}
                            disabled={!selectedRegistrationId}
                        />
                    </div>
                    
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full justify-start text-left font-normal",
                                !inspectionDate && "text-muted-foreground"
                                )}
                                disabled={!selectedRegistrationId}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {inspectionDate ? format(inspectionDate, "PPP") : <span>{t("Inspection Date")}</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={inspectionDate}
                                onSelect={setInspectionDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>

                    {selectedRegistrationId && (
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
                        </div>
                    )}

                    <Button className="w-full" disabled={!selectedRegistrationId} onClick={handleSubmitInspection}>
                        {t("Submit Inspection")}
                    </Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>{t("Actions")}</CardTitle>
                </CardHeader>
                <CardContent>
                     <AlertDialogTrigger asChild>
                        <Button className="w-full" onClick={handleGenerateQrCode} disabled={!selectedRegistrationId}>
                            <QrCode className="mr-2 h-4 w-4"/>
                            {t("Generate QR Code")}
                        </Button>
                     </AlertDialogTrigger>
                </CardContent>
            </Card>
        </div>
      </div>
       {qrCodeUrl && selectedRegistration && (
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("Generated QR Code for {id}").replace('{id}', selectedRegistration.id)}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("Scan this QR code to view registration details.")}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex justify-center items-center p-4">
                    <Image src={qrCodeUrl} alt={`QR Code for ${selectedRegistration.id}`} width={250} height={250}/>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setQrCodeUrl(null)}>Close</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        )}
    </div>
    </AlertDialog>
     {selectedInspection && (
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('Inspection Details')}</DialogTitle>
                    <DialogDescription>{t("Review the submitted inspection form.")}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
                    <div>
                        <h4 className="font-medium text-sm mb-2">{t("Compliance Checklist")}</h4>
                        <div className="space-y-2">
                             {selectedInspection.checklist && checklistItems.map(item => (
                                <div key={item.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`view-${item.id}`}
                                        checked={selectedInspection.checklist![item.id]}
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
                        {selectedInspection.inspectorNotes ? (
                            <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">{selectedInspection.inspectorNotes}</p>
                        ) : (
                            <p className="text-sm text-muted-foreground">{t("No notes were provided for this inspection.")}</p>
                        )}
                    </div>
                     <div>
                        <h4 className="font-medium text-sm mb-2">{t("Inspection Photos")}</h4>
                        {selectedInspection.photos && selectedInspection.photos.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {selectedInspection.photos.map((photo, index) => (
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
                </div>
            </DialogContent>
        )}
    </Dialog>
  );
}
