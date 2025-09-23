

'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useTranslation } from "@/contexts/language-context";
import { useEffect, useState } from "react";
import { VerificationStatus, VerificationSubmission, Fisherfolk } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Hash, FileText, X, ShieldCheck, ShieldX, File, Bell } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/firebase";
import { collection, doc, getDocs, onSnapshot, setDoc, updateDoc, query, orderBy, addDoc } from "firebase/firestore";


export default function AdminVerificationPage() {
    const { t } = useTranslation();
    const [submissions, setSubmissions] = useState<VerificationSubmission[]>([]);
    const [fisherfolk, setFisherfolk] = useState<Record<string, Fisherfolk>>({});
    const [selectedSubmission, setSelectedSubmission] = useState<VerificationSubmission | null>(null);
    const { toast } = useToast();
    const [currentDocUrl, setCurrentDocUrl] = useState<string | null>(null);
    
    useEffect(() => {
        const q = query(collection(db, "verificationSubmissions"), orderBy("dateSubmitted", "desc"));
        const unsubSubmissions = onSnapshot(q, (snapshot) => {
            const submissionsData: VerificationSubmission[] = [];
            snapshot.forEach(doc => {
                submissionsData.push({ id: doc.id, ...doc.data() } as VerificationSubmission);
            });
            setSubmissions(submissionsData);
        });
        
        const unsubFisherfolk = onSnapshot(collection(db, "fisherfolk"), (snapshot) => {
            const fisherfolkData: Record<string, Fisherfolk> = {};
            snapshot.forEach(doc => {
                fisherfolkData[doc.id] = { uid: doc.id, ...doc.data() } as Fisherfolk;
            });
            setFisherfolk(fisherfolkData);
        });
        
        return () => {
            unsubSubmissions();
            unsubFisherfolk();
        };
    }, []);


    const handleStatusChange = async (id: string, type: 'fishR' | 'boatR' | 'barangayCert' | 'cedula', status: VerificationStatus, reason?: string) => {
        const submissionRef = doc(db, "verificationSubmissions", id);
        const fieldToUpdate = `${type}Status`;
        const updates: any = { [fieldToUpdate]: status };

        const submission = submissions.find(sub => sub.id === id);
        if (!submission) return;

        let rejectionReasons = new Set(submission.rejectionReason?.split(', ').filter(Boolean) || []);

        if (status === 'Rejected') {
            const reasonText = type === 'fishR' ? 'FishR ID' : type === 'boatR' ? 'BoatR ID' : type === 'barangayCert' ? 'Barangay Certificate' : 'Cedula';
            rejectionReasons.add(reasonText);
            updates.rejectionReason = Array.from(rejectionReasons).join(', ');

            try {
                await addDoc(collection(db, "notifications"), {
                    userId: submission.fisherfolkId,
                    date: new Date().toISOString(),
                    title: "Verification Document Rejected",
                    message: `Your ${reasonText} was rejected. Please review and re-upload the correct document.`,
                    isRead: false,
                    type: 'Alert'
                });
            } catch (error) {
                console.error("Error sending rejection notification: ", error);
            }
        } else if (status === 'Approved') {
            const reasonText = type === 'fishR' ? 'FishR ID' : type === 'boatR' ? 'BoatR ID' : type === 'barangayCert' ? 'Barangay Certificate' : 'Cedula';
            rejectionReasons.delete(reasonText);
             updates.rejectionReason = Array.from(rejectionReasons).join(', ');
        }
        
        try {
            await updateDoc(submissionRef, updates);

            // This block is now just for updating the user's `isVerified` status
            // The UI will reactively update via the `StatusBadge` component
            const tempUpdatedSubmission = { ...submission, ...updates };

            const allApproved = [
                tempUpdatedSubmission.fishRStatus,
                tempUpdatedSubmission.boatRStatus,
                tempUpdatedSubmission.barangayCertStatus,
                tempUpdatedSubmission.cedulaStatus,
            ].every(s => s === 'Approved');

            const fisherfolkDocRef = doc(db, "fisherfolk", submission.fisherfolkId);
            if (allApproved) {
                 await updateDoc(fisherfolkDocRef, { isVerified: true });
                 await addDoc(collection(db, "notifications"), {
                    userId: submission.fisherfolkId,
                    date: new Date().toISOString(),
                    title: "Account Verified!",
                    message: "Congratulations! Your account is now fully verified. You can now access all features.",
                    isRead: false,
                    type: 'Success'
                });
            } else {
                 await updateDoc(fisherfolkDocRef, { isVerified: false });
            }

            toast({ title: "Status Updated", description: `Document status has been changed to ${status}.` });

        } catch (error) {
            console.error("Error updating status: ", error);
            toast({ variant: "destructive", title: "Update Failed", description: "Could not update the status in the database." });
        }
    };


    const getStatusBadgeVariant = (status: VerificationStatus) => {
        switch (status) {
            case 'Approved': return 'default';
            case 'Pending': return 'secondary';
            case 'Rejected': return 'destructive';
            default: return 'outline';
        }
    };
    
    const StatusBadge = ({ sub }: { sub: VerificationSubmission }) => {
        const statuses = [sub.fishRStatus, sub.boatRStatus, sub.barangayCertStatus, sub.cedulaStatus];
        
        const anyRejected = statuses.some(s => s === 'Rejected');
        if(anyRejected) {
            return <Badge variant="destructive">{t('Rejected')}</Badge>;
        }

        const allApproved = statuses.every(s => s === 'Approved');
        if (allApproved) {
            return <Badge variant="default">{t('Approved')}</Badge>;
        }
        
        return <Badge variant="secondary">{t('Pending')}</Badge>;
    };

    const handleViewDocument = (url: string) => {
        if (url && url !== 'uploading...') {
            setCurrentDocUrl(url);
        } else {
            toast({ variant: "destructive", title: "Document Not Ready", description: "The document is still being uploaded. Please try again in a moment."})
        }
    };

  return (
    <Dialog>
    <AlertDialog>
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>{t("Verification Queue")}</CardTitle>
                    <CardDescription>{t("Review and process fisherfolk account submissions.")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("Applicant")}</TableHead>
                                <TableHead>{t("Date Submitted")}</TableHead>
                                <TableHead>{t("Status")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                           {submissions.map(sub => {
                             const applicant = fisherfolk[sub.fisherfolkId];
                             return (
                             <TableRow 
                                key={sub.id} 
                                onClick={() => setSelectedSubmission(sub)} 
                                className="cursor-pointer"
                                data-state={selectedSubmission?.id === sub.id ? 'selected' : 'unselected'}
                            >
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={applicant?.avatarUrl} />
                                            <AvatarFallback>{applicant?.displayName ? applicant.displayName.charAt(0) : 'U'}</AvatarFallback>
                                        </Avatar>
                                        {applicant?.displayName || sub.fisherfolkId}
                                    </div>
                                </TableCell>
                                <TableCell>{sub.dateSubmitted}</TableCell>
                                <TableCell>
                                    <StatusBadge sub={sub} />
                                </TableCell>
                             </TableRow>
                           )})}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="lg:col-span-2">
                {selectedSubmission ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("Submission Details")}</CardTitle>
                            <CardDescription>ID: {selectedSubmission.id}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 border rounded-md">
                                <p className="text-sm font-medium leading-none mb-2">{t("FishR ID Verification")}</p>
                                <div className="flex items-center gap-2 p-2 rounded-md bg-muted font-mono text-sm">
                                    <Hash className="h-4 w-4"/>
                                    {selectedSubmission.fishRId}
                                </div>
                                <div className="mt-2 flex justify-between items-center">
                                    <Badge variant={getStatusBadgeVariant(selectedSubmission.fishRStatus)}>
                                        {selectedSubmission.fishRStatus === 'Approved' && <ShieldCheck className="mr-1 h-3 w-3"/>}
                                        {selectedSubmission.fishRStatus === 'Rejected' && <ShieldX className="mr-1 h-3 w-3"/>}
                                        {t(selectedSubmission.fishRStatus)}
                                    </Badge>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="destructive" onClick={() => handleStatusChange(selectedSubmission.id, 'fishR', 'Rejected', "Invalid FishR ID")}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="default" onClick={() => handleStatusChange(selectedSubmission.id, 'fishR', 'Approved')}>
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border rounded-md">
                                <p className="text-sm font-medium leading-none mb-2">{t("BoatR ID Verification")}</p>
                                <div className="flex items-center gap-2 p-2 rounded-md bg-muted font-mono text-sm">
                                    <Hash className="h-4 w-4"/>
                                    {selectedSubmission.boatRId}
                                </div>
                                 <div className="mt-2 flex justify-between items-center">
                                    <Badge variant={getStatusBadgeVariant(selectedSubmission.boatRStatus)}>
                                        {selectedSubmission.boatRStatus === 'Approved' && <ShieldCheck className="mr-1 h-3 w-3"/>}
                                        {selectedSubmission.boatRStatus === 'Rejected' && <ShieldX className="mr-1 h-3 w-3"/>}
                                        {t(selectedSubmission.boatRStatus)}
                                    </Badge>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="destructive" onClick={() => handleStatusChange(selectedSubmission.id, 'boatR', 'Rejected', "Invalid BoatR ID")}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="default" onClick={() => handleStatusChange(selectedSubmission.id, 'boatR', 'Approved')}>
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border rounded-md">
                                <p className="text-sm font-medium leading-none mb-2">{t("Barangay Certificate")}</p>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full" onClick={() => handleViewDocument(selectedSubmission.barangayCertUrl)}>
                                        <File className="mr-2 h-4 w-4" /> View Document
                                    </Button>
                                </DialogTrigger>
                                <div className="mt-2 flex justify-between items-center">
                                    <Badge variant={getStatusBadgeVariant(selectedSubmission.barangayCertStatus)}>
                                        {selectedSubmission.barangayCertStatus === 'Approved' && <ShieldCheck className="mr-1 h-3 w-3"/>}
                                        {selectedSubmission.barangayCertStatus === 'Rejected' && <ShieldX className="mr-1 h-3 w-3"/>}
                                        {t(selectedSubmission.barangayCertStatus)}
                                    </Badge>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="destructive" onClick={() => handleStatusChange(selectedSubmission.id, 'barangayCert', 'Rejected', "Invalid Barangay Certificate")}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="default" onClick={() => handleStatusChange(selectedSubmission.id, 'barangayCert', 'Approved')}>
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border rounded-md">
                                <p className="text-sm font-medium leading-none mb-2">{t("Cedula")}</p>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full" onClick={() => handleViewDocument(selectedSubmission.cedulaUrl)}>
                                        <File className="mr-2 h-4 w-4" /> View Document
                                    </Button>
                                </DialogTrigger>
                                 <div className="mt-2 flex justify-between items-center">
                                    <Badge variant={getStatusBadgeVariant(selectedSubmission.cedulaStatus)}>
                                        {selectedSubmission.cedulaStatus === 'Approved' && <ShieldCheck className="mr-1 h-3 w-3"/>}
                                        {selectedSubmission.cedulaStatus === 'Rejected' && <ShieldX className="mr-1 h-3 w-3"/>}
                                        {t(selectedSubmission.cedulaStatus)}
                                    </Badge>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="destructive" onClick={() => handleStatusChange(selectedSubmission.id, 'cedula', 'Rejected', "Invalid Cedula")}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="default" onClick={() => handleStatusChange(selectedSubmission.id, 'cedula', 'Approved')}>
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center p-6">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                        <h3 className="mt-4 text-lg font-semibold">{t("No Submission Selected")}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t("Select a submission from the list to view details.")}
                        </p>
                    </CardContent>
                </Card>
                )}
            </div>
        </div>
    </div>
     <DialogContent>
        <DialogHeader>
            <DialogTitle>{t("Document Viewer")}</DialogTitle>
        </DialogHeader>
        {currentDocUrl && (
            <Image src={currentDocUrl} alt="Document" width={600} height={800} className="rounded-md w-full h-auto" />
        )}
    </DialogContent>
    </AlertDialog>
    </Dialog>
  );
}
