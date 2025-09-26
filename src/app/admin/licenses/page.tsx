
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Download, Printer, Search, ListFilter, ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useMemo, useRef } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { License } from "@/lib/types";
import { LicenseTemplate } from "@/components/admin/license-template";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuCheckboxItem, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useReactToPrint } from 'react-to-print';

export default function AdminLicensesPage() {
    const { t } = useTranslation();
    const [licenses, setLicenses] = useState<License[]>([]);
    const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilters, setStatusFilters] = useState<string[]>([]);
    const [sortOption, setSortOption] = useState<string>("issue-desc");
    const printRef = useRef(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "licenses"), (snapshot) => {
            const licensesData: License[] = [];
            snapshot.forEach((doc) => {
                licensesData.push({ id: doc.id, ...doc.data() } as License);
            });
            setLicenses(licensesData);
            if(licensesData.length > 0 && !selectedLicense) {
                setSelectedLicense(licensesData[0]);
            }
        });
        return () => unsubscribe();
    }, [selectedLicense]);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
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
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLicenses.map(license => (
                                        <TableRow 
                                            key={license.id} 
                                            onClick={() => setSelectedLicense(license)} 
                                            className="cursor-pointer" 
                                            data-state={selectedLicense?.id === license.id ? 'selected' : ''}
                                        >
                                            <TableCell className="font-mono text-xs">{license.id}</TableCell>
                                            <TableCell className="font-medium">{license.name}</TableCell>
                                            <TableCell>{t(license.type)}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusBadgeVariant(license.status)}>{t(license.status)}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                {selectedLicense ? (
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handlePrint}>
                                <Printer className="mr-2 h-4 w-4" />
                                {t("Print License")}
                            </Button>
                        </div>
                        <div ref={printRef}>
                            <LicenseTemplate license={selectedLicense} />
                        </div>
                    </div>
                ) : (
                    <Card className="h-full flex items-center justify-center">
                        <CardContent className="p-8 text-center">
                            <h3 className="text-lg font-semibold">{t("No License Selected")}</h3>
                            <p className="text-muted-foreground mt-1">{t("Select a license from the list to view details.")}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    </div>
  );
}
