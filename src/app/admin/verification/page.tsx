
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useTranslation } from "@/contexts/language-context";
import { useState } from "react";
import { verificationSubmissions as initialSubmissions, registrations as allRegistrations } from "@/lib/data";
import { VerificationStatus, VerificationSubmission } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Hash, Sheet, X, ShieldCheck, ShieldX } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export default function AdminVerificationPage() {
    const { t } = useTranslation();
    const [submissions, setSubmissions] = useState<VerificationSubmission[]>(initialSubmissions);
    const [selectedSubmission, setSelectedSubmission] = useState<VerificationSubmission | null>(submissions[0] || null);

    const handleStatusChange = (id: string, type: 'fishR' | 'boatR', status: VerificationStatus) => {
        const submission = submissions.find(sub => sub.id === id);
        if (!submission) return;

        const updatedSubmissions = submissions.map(sub => {
            if (sub.id === id) {
                if (type === 'fishR') {
                    return { ...sub, fishRStatus: status };
                } else {
                    return { ...sub, boatRStatus: status };
                }
            }
            return sub;
        });
        setSubmissions(updatedSubmissions);
        
        const updatedSelection = updatedSubmissions.find(sub => sub.id === id);
        if (updatedSelection) {
            setSelectedSubmission(updatedSelection);
        }
        
        // Also update the "database"
        const index = initialSubmissions.findIndex(sub => sub.id === id);
        if(index > -1) {
            if (type === 'fishR') {
                initialSubmissions[index].fishRStatus = status;
            } else {
                initialSubmissions[index].boatRStatus = status;
            }
        }

        // Sync with registrations data
        const isVerified = status === 'Approved';
        allRegistrations.forEach(reg => {
            if (reg.ownerName === submission.fisherfolkName) {
                if (type === 'fishR') {
                    reg.fishrVerified = isVerified;
                } else {
                    reg.boatrVerified = isVerified;
                }
            }
        });
    };

    const getStatusBadgeVariant = (status: VerificationStatus) => {
        switch (status) {
            case 'Approved': return 'default';
            case 'Pending': return 'secondary';
            case 'Rejected': return 'destructive';
            default: return 'outline';
        }
    };
    
    const OverallStatus = ({ sub }: { sub: VerificationSubmission }) => {
        if (sub.fishRStatus === 'Rejected' || sub.boatRStatus === 'Rejected') {
            return <Badge variant="destructive">{t('Rejected')}</Badge>;
        }
        if (sub.fishRStatus === 'Approved' && sub.boatRStatus === 'Approved') {
            return <Badge variant="default">{t('Approved')}</Badge>;
        }
        return <Badge variant="secondary">{t('Pending')}</Badge>;
    };

  return (
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
                                <TableHead>{t("Overall Status")}</TableHead>
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
                                    <OverallStatus sub={sub} />
                                </TableCell>
                             </TableRow>
                           ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="lg:col-span-2">
                {selectedSubmission ? (
                <Dialog>
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

                            <Separator />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium leading-none">{t("Barangay Certificate")}</p>
                                     <DialogTrigger asChild>
                                        <Image src={selectedSubmission.barangayCertUrl} alt="Barangay Certificate" width={200} height={250} className="rounded-md border cursor-pointer hover:opacity-80 object-cover w-full aspect-[3/4]" data-ai-hint="certificate document" />
                                    </DialogTrigger>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium leading-none">{t("Cedula")}</p>
                                     <DialogTrigger asChild>
                                        <Image src={selectedSubmission.cedulaUrl} alt="Cedula" width={200} height={150} className="rounded-md border cursor-pointer hover:opacity-80 object-cover w-full aspect-[4/3]" data-ai-hint="tax document" />
                                    </DialogTrigger>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t("Document Viewer")}</DialogTitle>
                        </DialogHeader>
                        <Image src={selectedSubmission.barangayCertUrl} alt="Barangay Certificate" width={600} height={800} className="rounded-md w-full h-auto" />
                    </DialogContent>
                </Dialog>
                ) : (
                <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center p-6">
                        <Sheet className="h-12 w-12 text-muted-foreground mx-auto" />
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
  );
}
