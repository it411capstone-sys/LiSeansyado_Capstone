
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type Checklist, type Inspection } from "@/lib/types";
import { registrations } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Upload, X, QrCode, Bell } from "lucide-react";
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogTrigger, AlertDialogContent as AlertDialogContentComponent } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useInspections } from "@/contexts/inspections-context";

export default function AdminInspectionsPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { inspections, setInspections, updateInspection } = useInspections();
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


    const scheduledInspections = useMemo(() => 
        inspections.filter(i => i.status === 'Scheduled'), 
    [inspections]);


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
            setPhotos([]); // Reset photos for new inspection form
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

    const handleDeleteInspection = (inspectionId: string) => {
        setInspections(prev => prev.filter(inspection => inspection.id !== inspectionId));
    };


    const handleSubmitInspection = () => {
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
        const updatedData = {
            inspector: inspectorName,
            status: isCompliant ? 'Completed' : 'Flagged',
            checklist,
            inspectorNotes,
            photos: photos.map(p => ({ name: p.name, url: URL.createObjectURL(p) })),
        };
        
        updateInspection(selectedInspectionToConduct.id, updatedData);

        // This is the key part for auto-updating the details view
        const fullyUpdatedInspection = { ...selectedInspectionToConduct, ...updatedData };
        setSelectedInspectionForDetails(fullyUpdatedInspection);

        toast({
            title: t("Inspection Submitted"),
            description: t("The inspection for {vesselName} has been recorded.").replace('{vesselName}', selectedInspectionToConduct.vesselName),
        });

        // Reset form
        setSelectedInspectionToConduct(null);
        setChecklist({
            vesselMatch: false,
            gearMatch: false,
            profileUpToDate: false,
            safetyAdequate: false,
            noIllegalMods: false,
        });
        setInspectorNotes("");
        setPhotos([]);
        setInspectorName("");
    };

    
    const sortedInspections = useMemo(() => 
        [...inspections].sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime()),
    [inspections]);

    const handleOpenNotificationDialog = (inspection: Inspection) => {
        setNotificationInspection(inspection);
        const owner = registrations.find(r => r.id === inspection.registrationId);
        const salutation = `Dear ${owner?.ownerName || 'User'},\n\n`;
        const signature = `\n\nThank you,\nLiSEAnsyado Admin`;
        let bodyMessage = "";
        if (inspection.status === 'Completed') {
            bodyMessage = `Good news! Your inspection for vessel/gear "${inspection.vesselName}" (${inspection.registrationId}) conducted on ${format(inspection.scheduledDate, 'PPp')} was successful and marked as complete.`;
        } else if (inspection.status === 'Flagged') {
            bodyMessage = `This is to inform you that your inspection for vessel/gear "${inspection.vesselName}" (${inspection.registrationId}) conducted on ${format(inspection.scheduledDate, 'PPp')} has been flagged for the following reason: ${inspection.inspectorNotes || 'Please contact the office for details.'}. Please address the issue and schedule a re-inspection.`;
        }
        setNotificationMessage(`${salutation}${bodyMessage}${signature}`);
    }

    const handleSendNotification = () => {
        if (!notificationInspection) return;
        toast({
            title: t("Notification Sent"),
            description: `Notification for ${notificationInspection.vesselName} has been sent.`,
        });
        setNotificationInspection(null);
    }

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
                                <DropdownMenuItem onSelect={() => updateInspection(inspection.id, {status: 'Completed'})}>{t("Mark as Complete")}</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => updateInspection(inspection.id, {status: 'Flagged'})}>{t("Flag Issue")}</DropdownMenuItem>
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
                            </div>
                        </>
                    )}


                    <Button className="w-full" disabled={!selectedInspectionToConduct} onClick={handleSubmitInspection}>
                        {t("Submit Inspection")}
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
        {selectedInspectionForDetails && (
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('Inspection Details')}</DialogTitle>
                    <DialogDescription>{t("Review the submitted inspection form.")}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium text-sm mb-1">{t("Inspection Date")}</h4>
                            <p className="text-sm text-muted-foreground">{format(selectedInspectionForDetails.scheduledDate, 'PPp')}</p>
                        </div>
                         <div>
                            <h4 className="font-medium text-sm mb-1">{t("Inspector Name")}</h4>
                            <p className="text-sm text-muted-foreground">{selectedInspectionForDetails.inspector}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium text-sm mb-2">{t("Compliance Checklist")}</h4>
                        <div className="space-y-2">
                             {selectedInspectionForDetails.checklist && checklistItems.map(item => (
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
                        {selectedInspectionForDetails.inspectorNotes ? (
                            <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">{selectedInspectionForDetails.inspectorNotes}</p>
                        ) : (
                            <p className="text-sm text-muted-foreground">{t("No notes were provided for this inspection.")}</p>
                        )}
                    </div>
                     <div>
                        <h4 className="font-medium text-sm mb-2">{t("Inspection Photos")}</h4>
                        {selectedInspectionForDetails.photos && selectedInspectionForDetails.photos.length > 0 ? (
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
                    <div>
                        <h4 className="font-medium text-sm mb-2">{t("Registration QR Code")}</h4>
                        <div className="flex justify-center p-2 border rounded-md">
                            <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedInspectionForDetails.registrationId}`} width={150} height={150} alt={`QR Code for ${selectedInspectionForDetails.registrationId}`} />
                        </div>
                    </div>
                    <AlertDialogTrigger asChild>
                         <Button variant="outline" className="w-full" onClick={() => handleOpenNotificationDialog(selectedInspectionForDetails)}>
                            <Bell className="mr-2 h-4 w-4"/> {t("Notify User")}
                        </Button>
                    </AlertDialogTrigger>
                </div>
            </DialogContent>
        )}
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
