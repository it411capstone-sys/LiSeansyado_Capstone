
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/language-context";
import { useEffect, useState, useMemo } from "react";
import { VerificationStatus, VerificationSubmission, Fisherfolk } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Hash, FileText, X, ShieldCheck, ShieldX, Eye, RefreshCw, File as FileIcon, ArrowUpDown, ListFilter } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, updateDoc, addDoc, query, orderBy } from "firebase/firestore";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


export default function AdminVerificationPage() {
    const { t } = useTranslation();
    const [submissions, setSubmissions] = useState<VerificationSubmission[]>([]);
    const [fisherfolk, setFisherfolk] = useState<Record<string, Fisherfolk>>({});
    const [selectedSubmission, setSelectedSubmission] = useState<VerificationSubmission | null>(null);
    const { toast } = useToast();
    const [currentDocUrl, setCurrentDocUrl] = useState<string | null>(null);
    const [pendingStatuses, setPendingStatuses] = useState<Partial<Pick<VerificationSubmission, 'fishRStatus' | 'boatRStatus' | 'barangayCertStatus' | 'cedulaStatus'>>>({});
    const [sortOption, setSortOption] = useState<string>("date-desc");
    const [statusFilters, setStatusFilters] = useState<string[]>([]);


    useEffect(() => {
        const q = query(collection(db, "verificationSubmissions"), orderBy("dateSubmitted", "desc"));
        const unsubSubmissions = onSnapshot(q, (snapshot) => {
            const submissionsData: VerificationSubmission[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as VerificationSubmission));
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

    useEffect(() => {
        if (selectedSubmission) {
            const updated = submissions.find(s => s.id === selectedSubmission.id);
            setSelectedSubmission(updated || null);
            if (updated) {
                 setPendingStatuses({
                    fishRStatus: updated.fishRStatus,
                    boatRStatus: updated.boatRStatus,
                    barangayCertStatus: updated.barangayCertStatus,
                    cedulaStatus: updated.cedulaStatus,
                });
            }
        } else if (submissions.length > 0) {
            const firstSubmission = sortedSubmissions[0];
            setSelectedSubmission(firstSubmission);
             if (firstSubmission) {
                setPendingStatuses({
                    fishRStatus: firstSubmission.fishRStatus,
                    boatRStatus: firstSubmission.boatRStatus,
                    barangayCertStatus: firstSubmission.barangayCertStatus,
                    cedulaStatus: firstSubmission.cedulaStatus,
                });
            }
        }
    }, [submissions, selectedSubmission]);


    const handleStatusChange = (type: 'fishR' | 'boatR' | 'barangayCert' | 'cedula', newStatus: VerificationStatus) => {
        setPendingStatuses(prev => ({
            ...prev,
            [`${type}Status`]: newStatus,
        }));
    };

    const handleFinalizeDecision = async () => {
        if (!selectedSubmission) return;

        const allApproved = Object.values(pendingStatuses).every(status => status === 'Approved');
        const anyRejected = Object.values(pendingStatuses).some(status => status === 'Rejected');

        const fisherfolkDocRef = doc(db, "fisherfolk", selectedSubmission.fisherfolkId);
        const notificationCollection = collection(db, "notifications");
        const submissionRef = doc(db, "verificationSubmissions", selectedSubmission.id);

        let title = "";
        let message = "";
        let type: 'Success' | 'Alert' = 'Success';
        
        try {
            if (allApproved) {
                await updateDoc(fisherfolkDocRef, { isVerified: true });
                await updateDoc(submissionRef, { ...pendingStatuses, overallStatus: 'Approved' });
                title = "Account Verified!";
                message = "Congratulations! Your account is now fully verified. You can now access all features.";
                type = 'Success';
            } else if (anyRejected) {
                const reasons = (['fishR', 'boatR', 'barangayCert', 'cedula'] as const)
                    .filter(key => pendingStatuses[`${key}Status`] === 'Rejected')
                    .map(key => key === 'fishR' ? 'FishR ID' : key === 'boatR' ? 'BoatR ID' : key === 'barangayCert' ? 'Barangay Certificate' : 'Cedula')
                    .join(', ');

                await updateDoc(fisherfolkDocRef, { isVerified: false });
                await updateDoc(submissionRef, { ...pendingStatuses, overallStatus: 'Rejected', rejectionReason: reasons });
                title = "Verification Rejected";
                message = `Your verification was rejected due to issues with: ${reasons}. Please review and re-submit the correct documents.`;
                type = 'Alert';
            } else {
                 toast({ title: "Decision Pending", description: "Please approve or reject all items before finalizing." });
                 return;
            }

            await addDoc(notificationCollection, {
                userId: fisherfolk[selectedSubmission.fisherfolkId]?.email,
                date: new Date().toISOString(),
                title,
                message,
                isRead: false,
                type
            });

            toast({ title, description: "The fisherfolk has been notified." });
            
        } catch (error) {
            console.error("Error finalizing decision: ", error);
            toast({ variant: "destructive", title: "Error", description: "Could not finalize the decision." });
        }
    };


    const getStatusBadgeVariant = (status: VerificationStatus): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'Approved': return 'default';
            case 'Pending': return 'secondary';
            case 'Rejected': return 'destructive';
            default: return 'outline';
        }
    };
    
    const StatusBadge = ({ sub }: { sub: VerificationSubmission }) => {
        const hasRejected = useMemo(() => Object.values(sub).includes('Rejected'), [sub]);
        const allApproved = useMemo(() => ['fishRStatus', 'boatRStatus', 'barangayCertStatus', 'cedulaStatus'].every(key => sub[key as keyof VerificationSubmission] === 'Approved'), [sub]);

        let status: 'Pending' | 'Approved' | 'Rejected' = 'Pending';
        if (sub.overallStatus) {
            status = sub.overallStatus;
        } else {
            if (hasRejected) status = 'Rejected';
            else if (allApproved) status = 'Approved';
        }

        const variant = status === 'Approved' ? 'default' : status === 'Rejected' ? 'destructive' : 'secondary';
        return <Badge variant={variant}>{t(status)}</Badge>;
    };

    const handleViewDocument = (url: string) => {
        if (url && url !== 'uploading...') {
            setCurrentDocUrl(url);
        } else {
            toast({ variant: "destructive", title: "Document Not Ready", description: "The document is still being uploaded. Please try again in a moment."})
        }
    };

    const VerificationItem = ({ title, status, onApprove, onReject, onReset, idValue, docUrl, onDocView }: { title: string, status: VerificationStatus, onApprove: () => void, onReject: () => void, onReset: () => void, idValue?: string, docUrl?: string, onDocView?: (url: string) => void }) => (
        <Card className={cn(
            "p-3 space-y-2", 
            status === 'Approved' ? 'border-green-500 bg-green-500/5' : 
            status === 'Rejected' ? 'border-red-500 bg-red-500/5' : ''
        )}>
            <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-muted-foreground">{t(title)}</p>
                {status === 'Pending' ? (
                     <div className="flex items-center gap-2">
                         <Badge variant={getStatusBadgeVariant(status)}>{t(status)}</Badge>
                         <Button size="icon" variant="destructive" onClick={onReject} className="h-6 w-6 rounded-full">
                            <X className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="default" onClick={onApprove} className="h-6 w-6 rounded-full bg-green-600 hover:bg-green-700">
                            <Check className="h-4 w-4" />
                        </Button>
                     </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeVariant(status)}>{t(status)}</Badge>
                        <Button size="icon" variant="ghost" onClick={onReset} className="h-6 w-6 text-muted-foreground">
                           <RefreshCw className="h-4 w-4" />
                       </Button>
                    </div>
                )}
            </div>
            {idValue && <p className="text-xl font-bold">{idValue}</p>}
            {docUrl && (
                 <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => onDocView && onDocView(docUrl)}>
                        <FileIcon className="mr-2 h-4 w-4" /> {t("View Document")}
                    </Button>
                </DialogTrigger>
            )}
        </Card>
    );

    const handleStatusFilterChange = (status: string) => {
        setStatusFilters((prev) =>
          prev.includes(status)
            ? prev.filter((s) => s !== status)
            : [...prev, status]
        );
    };

    const sortedSubmissions = useMemo(() => {
        let filtered = submissions;
        if (statusFilters.length > 0) {
            filtered = filtered.filter(sub => {
                const overallStatus = sub.overallStatus || 'Pending';
                return statusFilters.includes(overallStatus);
            });
        }
        
        const applicantData: Record<string, string> = {};
        filtered.forEach(sub => {
            applicantData[sub.id] = fisherfolk[sub.fisherfolkId]?.displayName || sub.fisherfolkId;
        });

        return [...filtered].sort((a, b) => {
            switch(sortOption) {
                case 'date-asc':
                    return new Date(a.dateSubmitted).getTime() - new Date(b.dateSubmitted).getTime();
                case 'date-desc':
                    return new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime();
                case 'applicant-asc':
                    return applicantData[a.id].localeCompare(applicantData[b.id]);
                case 'applicant-desc':
                     return applicantData[b.id].localeCompare(applicantData[a.id]);
                default:
                    return 0;
            }
        })
    }, [submissions, statusFilters, sortOption, fisherfolk]);
    
    useEffect(() => {
        if (!selectedSubmission && sortedSubmissions.length > 0) {
            setSelectedSubmission(sortedSubmissions[0]);
        }
    }, [sortedSubmissions, selectedSubmission]);

  return (
    <Dialog>
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                            <CardTitle>{t("Verification Queue")}</CardTitle>
                            <CardDescription>{t("Review and process fisherfolk account submissions.")}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-1">
                                        <ListFilter className="h-4 w-4" />
                                        <span>{t("Filter by Status")}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>{t("Filter by Status")}</DropdownMenuLabel>
                                    {(['Pending', 'Approved', 'Rejected'] as const).map(status => (
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-1">
                                        <ArrowUpDown className="h-4 w-4" />
                                        <span>{t("Arrange by")}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>{t("Sort by")}</DropdownMenuLabel>
                                    <DropdownMenuItem onSelect={() => setSortOption('date-desc')}>{t("Date: Newest")}</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setSortOption('date-asc')}>{t("Date: Oldest")}</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setSortOption('applicant-asc')}>{t("Applicant: A-Z")}</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setSortOption('applicant-desc')}>{t("Applicant: Z-A")}</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
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
                           {sortedSubmissions.map(sub => {
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
                                <TableCell>{format(new Date(sub.dateSubmitted), 'PP')}</TableCell>
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
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold">{t("Submission Details")}</h3>
                            <p className="text-sm text-muted-foreground">ID: {selectedSubmission.id}</p>
                        </div>
                        <VerificationItem 
                            title="FishR ID Verification"
                            idValue={selectedSubmission.fishRId}
                            status={pendingStatuses.fishRStatus || 'Pending'}
                            onApprove={() => handleStatusChange('fishR', 'Approved')}
                            onReject={() => handleStatusChange('fishR', 'Rejected')}
                            onReset={() => handleStatusChange('fishR', 'Pending')}
                        />
                         <VerificationItem 
                            title="BoatR ID Verification"
                            idValue={selectedSubmission.boatRId}
                            status={pendingStatuses.boatRStatus || 'Pending'}
                            onApprove={() => handleStatusChange('boatR', 'Approved')}
                            onReject={() => handleStatusChange('boatR', 'Rejected')}
                            onReset={() => handleStatusChange('boatR', 'Pending')}
                        />
                         <VerificationItem 
                            title="Barangay Certificate"
                            docUrl={selectedSubmission.barangayCertUrl}
                            onDocView={handleViewDocument}
                            status={pendingStatuses.barangayCertStatus || 'Pending'}
                            onApprove={() => handleStatusChange('barangayCert', 'Approved')}
                            onReject={() => handleStatusChange('barangayCert', 'Rejected')}
                            onReset={() => handleStatusChange('barangayCert', 'Pending')}
                        />
                          <VerificationItem 
                            title="Cedula"
                            docUrl={selectedSubmission.cedulaUrl}
                            onDocView={handleViewDocument}
                            status={pendingStatuses.cedulaStatus || 'Pending'}
                            onApprove={() => handleStatusChange('cedula', 'Approved')}
                            onReject={() => handleStatusChange('cedula', 'Rejected')}
                            onReset={() => handleStatusChange('cedula', 'Pending')}
                        />
                        <Button className="w-full" size="lg" onClick={handleFinalizeDecision}>
                            <ShieldCheck className="mr-2 h-4 w-4"/> {t("Finalize Decision")}
                        </Button>
                    </div>
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
    </Dialog>
  );
}

    