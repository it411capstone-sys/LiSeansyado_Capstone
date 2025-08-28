
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useTranslation } from "@/contexts/language-context";
import { useEffect, useState } from "react";
import { verificationSubmissions as initialSubmissions, registrations, notifications } from "@/lib/data";
import { VerificationStatus, VerificationSubmission } from "@/lib/types";
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


export default function AdminVerificationPage() {
    const { t } = useTranslation();
    const [submissions, setSubmissions] = useState<VerificationSubmission[]>(initialSubmissions);
    const [selectedSubmission, setSelectedSubmission] = useState<VerificationSubmission | null>(initialSubmissions[0] || null);
    const { toast } = useToast();
    const [currentDocUrl, setCurrentDocUrl] useState<string | null>(null);
    const [notificationSubmission, setNotificationSubmission] = useState<VerificationSubmission | null>(null);
    const [notificationMessage, setNotificationMessage] = useState('');

    useEffect(() => {
        if (selectedSubmission) {
            const { fishRStatus, boatRStatus, barangayCertStatus, cedulaStatus, fisherfolkName, id } = selectedSubmission;
            const isFullyApproved = fishRStatus === 'Approved' && boatRStatus === 'Approved' && barangayCertStatus === 'Approved' && cedulaStatus === 'Approved';

            if (isFullyApproved) {
                const alreadyNotified = sessionStorage.getItem(`notified-${id}`);
                if (!alreadyNotified) {
                    const newNotification = {
                      id: `NOTIF-${notifications.length + 1}`,
                      userId: registrations.find(r => r.ownerName === fisherfolkName)?.email || '',
                      date: new Date().toISOString().split('T')[0],
                      title: 'Account Verified!',
                      message: `Congratulations! Your account verification is complete. You can now access all features of the portal.`,
                      type: 'Success' as const,
                      isRead: false
                    };
                    notifications.unshift(newNotification);
                    toast({
                        title: "Verification Complete",
                        description: `All documents for ${fisherfolkName} have been approved. The user has been notified.`,
                    });
                    sessionStorage.setItem(`notified-${id}`, 'true');
                }
            }
        }
    }, [selectedSubmission, toast]);

    const handleOpenNotificationDialog = (submission: VerificationSubmission) => {
        setNotificationSubmission(submission);
        
        const salutation = `Dear ${submission.fisherfolkName},\n\n`;
        const signature = `\n\nThank you,\nLiSEAnsyado Admin`;
        let bodyMessage = "";

        const rejectedItems: string[] = [];
        if (submission.fishRStatus === 'Rejected') rejectedItems.push("FishR ID");
        if (submission.boatRStatus === 'Rejected') rejectedItems.push("BoatR ID");
        if (submission.barangayCertStatus === 'Rejected') rejectedItems.push("Barangay Certificate");
        if (submission.cedulaStatus === 'Rejected') rejectedItems.push("Cedula");
        
        const approvedItems: string[] = [];
        if (submission.fishRStatus === 'Approved') approvedItems.push("FishR ID");
        if (submission.boatRStatus === 'Approved') approvedItems.push("BoatR ID");
        if (submission.barangayCertStatus === 'Approved') approvedItems.push("Barangay Certificate");
        if (submission.cedulaStatus === 'Approved') approvedItems.push("Cedula");

        const isFullyApproved = approvedItems.length === 4;
        
        if (isFullyApproved) {
            bodyMessage = "Congratulations! Your account verification is now complete. You can now access all features of the portal.";
        } else if (rejectedItems.length > 0) {
            bodyMessage = `There was an issue with your account verification. The following items were rejected:\n\n` +
                          rejectedItems.map(item => `- ${item}`).join('\n') +
                          `\n\nPlease review the requirements, correct the necessary information or documents, and submit your verification again.`;
        } else {
            bodyMessage = `This is an update regarding your account verification. It is still under review. We will notify you once the process is complete.`;
        }
        
        setNotificationMessage(`${salutation}${bodyMessage}${signature}`);
    };

    const handleSendNotification = () => {
        if (!notificationSubmission) return;
        
        const newNotification = {
            id: `NOTIF-${notifications.length + 1}`,
            userId: registrations.find(r => r.ownerName === notificationSubmission.fisherfolkName)?.email || '',
            date: new Date().toISOString().split('T')[0],
            title: 'Verification Update',
            message: notificationMessage,
            type: 'Info' as const,
            isRead: false
        };
        notifications.unshift(newNotification);

        toast({
            title: t("Notification Sent"),
            description: `Notification for ${notificationSubmission.fisherfolkName} has been sent.`,
        });
        setNotificationSubmission(null);
    };

    const handleStatusChange = (id: string, type: 'fishR' | 'boatR' | 'barangayCert' | 'cedula', status: VerificationStatus) => {
        const submission = submissions.find(sub => sub.id === id);
        if (!submission) return;

        const updatedSubmissions = submissions.map(sub => {
            if (sub.id === id) {
                const newStatus = { ...sub };
                if (type === 'fishR') newStatus.fishRStatus = status;
                else if (type === 'boatR') newStatus.boatRStatus = status;
                else if (type === 'barangayCert') newStatus.barangayCertStatus = status;
                else if (type === 'cedula') newStatus.cedulaStatus = status;
                return newStatus;
            }
            return sub;
        });
        setSubmissions(updatedSubmissions);
        
        const updatedSelection = updatedSubmissions.find(sub => sub.id === id);
        if (updatedSelection) {
            setSelectedSubmission(updatedSelection);
        }
        
        const index = initialSubmissions.findIndex(sub => sub.id === id);
        if(index > -1) {
            const newStatus = { ...initialSubmissions[index] };
            if (type === 'fishR') newStatus.fishRStatus = status;
            else if (type === 'boatR') newStatus.boatRStatus = status;
            else if (type === 'barangayCert') newStatus.barangayCertStatus = status;
            else if (type === 'cedula') newStatus.cedulaStatus = status;
            initialSubmissions[index] = newStatus;
        }

        if (type === 'fishR' || type === 'boatR') {
            const isVerified = status === 'Approved';
            registrations.forEach(reg => {
                if (reg.ownerName === submission.fisherfolkName) {
                    if (type === 'fishR') reg.fishrVerified = isVerified;
                    else reg.boatrVerified = isVerified;
                }
            });
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
        
        const allApproved = statuses.every(s => s === 'Approved');
        if (allApproved) {
            return <Badge variant="default">{t('Approved')}</Badge>;
        }

        const anyRejected = statuses.some(s => s === 'Rejected');
        const allRejected = statuses.every(s => s === 'Rejected');

        if(allRejected) {
            return <Badge variant="destructive">{t('Rejected')}</Badge>;
        }
        
        return <Badge variant="secondary">{t('Pending')}</Badge>;
    };

    const handleViewDocument = (url: string) => {
        setCurrentDocUrl(url);
    };

  return (
    <Dialog>
    <AlertDialog open={!!notificationSubmission} onOpenChange={(open) => !open && setNotificationSubmission(null)}>
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
                                <TableHead>{t("Actions")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                           {submissions.map(sub => (
                             <TableRow 
                                key={sub.id} 
                                onClick={() => setSelectedSubmission(sub)} 
                                className="cursor-pointer"
                                data-state={selectedSubmission?.id === sub.id ? 'selected' : 'unselected'}
                            >
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={sub.fisherfolkAvatar} />
                                            <AvatarFallback>{sub.fisherfolkName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {sub.fisherfolkName}
                                    </div>
                                </TableCell>
                                <TableCell>{sub.dateSubmitted}</TableCell>
                                <TableCell>
                                    <StatusBadge sub={sub} />
                                </TableCell>
                                <TableCell>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleOpenNotificationDialog(sub); }}>
                                            <Bell className="h-4 w-4"/>
                                        </Button>
                                    </AlertDialogTrigger>
                                </TableCell>
                             </TableRow>
                           ))}
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
                                        <Button size="icon" variant="destructive" onClick={() => handleStatusChange(selectedSubmission.id, 'fishR', 'Rejected')}>
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
                                        <Button size="icon" variant="destructive" onClick={() => handleStatusChange(selectedSubmission.id, 'boatR', 'Rejected')}>
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
                                        <Button size="icon" variant="destructive" onClick={() => handleStatusChange(selectedSubmission.id, 'barangayCert', 'Rejected')}>
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
                                        <Button size="icon" variant="destructive" onClick={() => handleStatusChange(selectedSubmission.id, 'cedula', 'Rejected')}>
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
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>{t("Send Notification")}</AlertDialogTitle>
            <AlertDialogDescription>
                {t("Customize and send a notification to the user.")}
            </AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            rows={8}
        />
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendNotification}>Send</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>
    </Dialog>
  );
}
