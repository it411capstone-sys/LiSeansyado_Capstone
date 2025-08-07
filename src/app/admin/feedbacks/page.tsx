
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
import { feedbacks } from "@/lib/data";
import { Feedback } from "@/lib/types";


export default function AdminFeedbacksPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const { t } = useTranslation();

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
                    <DropdownMenuCheckboxItem checked>{t("New")}</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>{t("In Progress")}</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>{t("Resolved")}</DropdownMenuCheckboxItem>
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
                        {feedbacks.map(feedback => (
                            <TableRow key={feedback.id} className="cursor-pointer">
                                <TableCell>{feedback.date}</TableCell>
                                <TableCell>{feedback.submittedBy}</TableCell>
                                <TableCell>{t(feedback.type)}</TableCell>
                                <TableCell>
                                    <Badge variant={feedback.status === 'New' ? 'default' : feedback.status === 'In Progress' ? 'secondary' : 'outline'}>
                                        {t(feedback.status)}
                                    </Badge>
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
