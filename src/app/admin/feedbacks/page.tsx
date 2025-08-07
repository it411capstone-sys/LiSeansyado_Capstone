
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { ListFilter, Search, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/contexts/language-context";
import { feedbacks as initialFeedbacks } from "@/lib/data";
import { Feedback } from "@/lib/types";


export default function AdminFeedbacksPage() {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks);
    const [statusFilters, setStatusFilters] = useState<string[]>([]);
    
    const handleStatusChange = (feedbackId: string, newStatus: Feedback['status']) => {
        setFeedbacks(currentFeedbacks =>
            currentFeedbacks.map(fb =>
                fb.id === feedbackId ? { ...fb, status: newStatus } : fb
            )
        );
         // Also update in the 'database'
        const feedbackIndex = initialFeedbacks.findIndex(fb => fb.id === feedbackId);
        if (feedbackIndex > -1) {
            initialFeedbacks[feedbackIndex].status = newStatus;
        }
    };
    
    const getStatusVariant = (status: Feedback['status']): BadgeProps['variant'] => {
        switch(status) {
            case 'New': return 'default';
            case 'In Progress': return 'secondary';
            case 'Resolved': return 'outline';
            case 'Denied': return 'destructive';
            default: return 'default';
        }
    };

    const handleStatusFilterChange = (status: string) => {
        setStatusFilters((prev) =>
          prev.includes(status)
            ? prev.filter((s) => s !== status)
            : [...prev, status]
        );
    };

     const filteredFeedbacks = feedbacks.filter(feedback => {
        const matchesSearch = feedback.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              feedback.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilters.length === 0 || statusFilters.includes(feedback.status);
        return matchesSearch && matchesStatus;
    });


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      
       <Card>
        <CardHeader>
          <CardTitle>{t("Feedback Inbox")}</CardTitle>
          <CardDescription>{t("Review feedback, suggestions, and complaints from fisherfolk.")}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-2 pb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                    placeholder={t("Search by subject or submitter...")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                    />
                </div>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{t("Filter")}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t("Filter by Status")}</DropdownMenuLabel>
                    {(['New', 'In Progress', 'Resolved', 'Denied'] as const).map(status => (
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
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t("Date Submitted")}</TableHead>
                            <TableHead>{t("Submitted By")}</TableHead>
                            <TableHead>{t("Type")}</TableHead>
                            <TableHead>{t("Status")}</TableHead>
                            <TableHead>{t("Subject")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredFeedbacks.map(feedback => (
                            <TableRow key={feedback.id}>
                                <TableCell>{feedback.date}</TableCell>
                                <TableCell>{feedback.submittedBy}</TableCell>
                                <TableCell>{t(feedback.type)}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                             <Badge variant={getStatusVariant(feedback.status)} className="cursor-pointer">
                                                {t(feedback.status)}
                                            </Badge>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>{t("Change Status")}</DropdownMenuLabel>
                                            <DropdownMenuItem onSelect={() => handleStatusChange(feedback.id, 'New')}>{t("New")}</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => handleStatusChange(feedback.id, 'In Progress')}>{t("In Progress")}</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => handleStatusChange(feedback.id, 'Resolved')}>{t("Resolved")}</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => handleStatusChange(feedback.id, 'Denied')}>{t("Denied")}</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                <TableCell className="font-medium">{t(feedback.subject)}</TableCell>
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
