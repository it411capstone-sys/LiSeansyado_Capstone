
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Download, Printer, Search, ListFilter, ArrowUpDown, Eye, Award } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useMemo, useRef } from "react";
import { collection, onSnapshot, doc, setDoc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { License, Registration } from "@/lib/types";
import { LicenseTemplate } from "@/components/admin/license-template";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuCheckboxItem, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useReactToPrint } from 'react-to-print';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function AdminLicensesPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [licenses, setLicenses] = useState<License[]>([]);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [selectedLicenseForView, setSelectedLicenseForView] = useState<License | null>(null);
    const [selectedLicenseForPrint, setSelectedLicenseForPrint] = useState<License | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilters, setStatusFilters] = useState<string[]>([]);
    const [sortOption, setSortOption] = useState<string>("issue-desc");
    
    const [isIssuing, setIsIssuing] = useState(false);
    const [issueRegId, setIssueRegId] = useState('');

    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsubLicenses = onSnapshot(collection(db, "licenses"), (snapshot) => {
            const licensesData: License[] = [];
            snapshot.forEach((doc) => {
                licensesData.push({ id: doc.id, ...doc.data() } as License);
            });
            setLicenses(licensesData);
        });

        const unsubRegistrations = onSnapshot(collection(db, "registrations"), (snapshot) => {
            const regsData: Registration[] = [];
            snapshot.forEach((doc) => {
                if(doc.data().status === 'Approved') {
                    regsData.push({ id: doc.id, ...doc.data() } as Registration);
                }
            });
            setRegistrations(regsData);
        });

        return () => {
            unsubLicenses();
            unsubRegistrations();
        };
    }, []);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        onAfterPrint: () => setSelectedLicenseForPrint(null),
    });

    useEffect(() => {
        if (selectedLicenseForPrint) {
            handlePrint();
        }
    }, [selectedLicenseForPrint, handlePrint]);
    
    const filteredLicenses = useMemo(() => {
        let filtered = licenses.filter(license => {
            const matchesSearch = license.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  license.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilters.length === 0 || statusFilters.includes(license.status);
            return matchesSearch && matchesStatus;
        });
        
        return filtered.sort((a,b) => {
             switch (sortOption) {
                case 'issue-desc':
                    return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime();
                case 'issue-asc':
                    return new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime();
                case 'expiry-desc':
                    return new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime();
                case 'expiry-asc':
                    return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
                default:
                    return 0;
            }
        });
    }, [licenses, searchTerm, statusFilters, sortOption]);
    
    const handleStatusFilterChange = (status: string) => {
        setStatusFilters((prev) =>
          prev.includes(status)
            ? prev.filter((s) => s !== status)
            : [...prev, status]
        );
    };

    const getStatusBadgeVariant = (status: License['status']) => {
        switch(status) {
            case 'Active': return 'default';
            case 'Expired': return 'destructive';
            case 'Revoked': return 'destructive';
            default: return 'outline';
        }
    };
    
    const handleIssueLicense = async () => {
        if (!issueRegId) {
            toast({ variant: "destructive", title: "No Registration Selected", description: "Please select a registration to issue a license for." });
            return;
        }
        
        setIsIssuing(true);
        const registration = registrations.find(r => r.id === issueRegId);
        if (!registration) {
            toast({ variant: "destructive", title: "Registration Not Found", description: "Could not find the selected registration." });
            setIsIssuing(false);
            return;
        }

        const transactionId = `MANUAL-${Date.now()}`;
        const licenseId = `LIC-${registration.type.toUpperCase()}-${transactionId}`;
        const newLicense: License = {
            id: licenseId,
            registrationId: registration.id,
            name: registration.ownerName,
            type: registration.type,
            issueDate: format(new Date(), "yyyy-MM-dd"),
            expiryDate: format(new Date(new Date().getFullYear(), 11, 31), "yyyy-MM-dd"),
            status: 'Active',
            ownerEmail: registration.email,
            contact: registration.contact
        };

        try {
            await setDoc(doc(db, "licenses", licenseId), newLicense);
            toast({ title: "License Issued", description: `Successfully issued license ${licenseId} for ${registration.ownerName}.` });
            setIssueRegId('');
        } catch (error) {
            console.error("Error issuing license:", error);
            toast({ variant: "destructive", title: "Issuing Failed", description: "Could not create the license document." });
        } finally {
            setIsIssuing(false);
        }
    };


  return (
    <Dialog>
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t("Issue New License")}</CardTitle>
                    <CardDescription>{t("Manually issue a license for an approved registration.")}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="grid gap-2 flex-1 w-full">
                        <Label htmlFor="registration-select">{t("Select Approved Registration")}</Label>
                        <Select value={issueRegId} onValueChange={setIssueRegId}>
                            <SelectTrigger id="registration-select">
                                <SelectValue placeholder={t("Select a registration...")} />
                            </SelectTrigger>
                            <SelectContent>
                                {registrations.map(reg => (
                                    <SelectItem key={reg.id} value={reg.id}>
                                        {reg.id} - {reg.ownerName} ({reg.vesselName || reg.gearType})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleIssueLicense} disabled={isIssuing || !issueRegId}>
                        <Award className="mr-2 h-4 w-4" />
                        {isIssuing ? t("Issuing...") : t("Issue License")}
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t("Issued Licenses")}</CardTitle>
                    <CardDescription>{t("View and manage all official fishing licenses.")}</CardDescription>
                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-4">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                            placeholder={t("Search by name or license ID...")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                            />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="gap-1 flex-1">
                                        <ListFilter className="h-4 w-4" />
                                        <span>{t("Filter by Status")}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>{t("Filter by Status")}</DropdownMenuLabel>
                                    {(['Active', 'Expired', 'Revoked'] as const).map(status => (
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
                                    <Button variant="outline" className="gap-1 flex-1">
                                        <ArrowUpDown className="h-4 w-4" />
                                        <span>{t("Sort by")}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>{t("Sort by")}</DropdownMenuLabel>
                                    <DropdownMenuItem onSelect={() => setSortOption('issue-desc')}>{t("Issue Date: Newest")}</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setSortOption('issue-asc')}>{t("Issue Date: Oldest")}</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setSortOption('expiry-desc')}>{t("Expiry Date: Newest")}</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setSortOption('expiry-asc')}>{t("Expiry Date: Oldest")}</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t("License ID")}</TableHead>
                                    <TableHead>{t("Owner")}</TableHead>
                                    <TableHead>{t("Type")}</TableHead>
                                    <TableHead>{t("Status")}</TableHead>
                                    <TableHead className="text-right">{t("Actions")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLicenses.map(license => (
                                    <TableRow key={license.id}>
                                        <TableCell className="font-mono text-xs">{license.id}</TableCell>
                                        <TableCell className="font-medium">{license.name}</TableCell>
                                        <TableCell>{t(license.type)}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(license.status)}>{t(license.status)}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="icon" onClick={() => setSelectedLicenseForView(license)}>
                                                        <Eye className="h-4 w-4"/>
                                                        <span className="sr-only">View</span>
                                                    </Button>
                                                </DialogTrigger>
                                                <Button variant="outline" size="icon" onClick={() => setSelectedLicenseForPrint(license)}>
                                                    <Printer className="h-4 w-4"/>
                                                    <span className="sr-only">Print</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            
            <div style={{ display: 'none' }}>
                {selectedLicenseForPrint && <LicenseTemplate ref={printRef} license={selectedLicenseForPrint} />}
            </div>
        </div>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t("License Details")}</DialogTitle>
            </DialogHeader>
            {selectedLicenseForView && <LicenseTemplate license={selectedLicenseForView}/>}
        </DialogContent>
    </Dialog>
  );
}

    