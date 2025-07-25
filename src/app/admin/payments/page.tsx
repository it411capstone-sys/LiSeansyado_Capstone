
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ListFilter, Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/contexts/language-context";

type Payment = {
  transactionId: string;
  date: string;
  payerName: string;
  registrationId: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed';
  paymentMethod: string;
};

const payments: Payment[] = [
  { transactionId: 'PAY-001', date: '2024-07-20', payerName: 'Juan Dela Cruz', registrationId: 'REG-001', amount: 150.00, status: 'Paid', paymentMethod: 'GCash' },
  { transactionId: 'PAY-002', date: '2024-07-19', payerName: 'Maria Clara', registrationId: 'REG-002', amount: 150.00, status: 'Paid', paymentMethod: 'GCash' },
  { transactionId: 'PAY-003', date: '2024-07-18', payerName: 'Crisostomo Ibarra', registrationId: 'REG-003', amount: 150.00, status: 'Pending', paymentMethod: 'GCash' },
  { transactionId: 'PAY-004', date: '2024-07-17', payerName: 'Andres Bonifacio', registrationId: 'REG-004', amount: 250.00, status: 'Failed', paymentMethod: 'GCash' },
];

const translationKeys = [
    "Payment Management",
    "View and manage all payment transactions.",
    "Search by payer or registration ID...",
    "Filter by status",
    "Paid",
    "Pending",
    "Failed",
    "Transaction ID",
    "Date",
    "Payer Name",
    "Registration ID",
    "Amount",
    "Status",
    "Method",
];

export default function AdminPaymentsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const { t } = useTranslation(translationKeys);

    const getStatusVariant = (status: Payment['status']) => {
        switch (status) {
            case 'Paid': return 'default';
            case 'Pending': return 'secondary';
            case 'Failed': return 'destructive';
            default: return 'outline';
        }
    };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      
       <Card>
        <CardHeader>
          <CardTitle>{t("Payment Management")}</CardTitle>
          <CardDescription>{t("View and manage all payment transactions.")}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-2 pb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                    placeholder={t("Search by payer or registration ID...")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                    />
                </div>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{t("Filter by status")}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem checked>{t("Paid")}</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>{t("Pending")}</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>{t("Failed")}</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t("Transaction ID")}</TableHead>
                            <TableHead>{t("Date")}</TableHead>
                            <TableHead>{t("Payer Name")}</TableHead>
                            <TableHead>{t("Registration ID")}</TableHead>
                            <TableHead>{t("Amount")}</TableHead>
                            <TableHead>{t("Status")}</TableHead>
                            <TableHead>{t("Method")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.map(payment => (
                            <TableRow key={payment.transactionId} className="cursor-pointer">
                                <TableCell className="font-medium">{payment.transactionId}</TableCell>
                                <TableCell>{payment.date}</TableCell>
                                <TableCell>{payment.payerName}</TableCell>
                                <TableCell>{payment.registrationId}</TableCell>
                                <TableCell>₱{payment.amount.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(payment.status)}>
                                        {t(payment.status)}
                                    </Badge>
                                </TableCell>
                                <TableCell>{payment.paymentMethod}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

