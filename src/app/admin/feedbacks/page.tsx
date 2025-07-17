'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ListFilter, Search } from "lucide-react";
import { useState } from "react";

type Feedback = {
  id: string;
  date: string;
  submittedBy: string;
  type: 'Complaint' | 'Suggestion' | 'Inquiry';
  status: 'New' | 'In Progress' | 'Resolved';
  subject: string;
};

const feedbacks: Feedback[] = [
    { id: 'FB-001', date: '2024-07-20', submittedBy: 'Juan Dela Cruz', type: 'Suggestion', status: 'New', subject: 'Improve mobile responsiveness' },
    { id: 'FB-002', date: '2024-07-19', submittedBy: 'Anonymous', type: 'Complaint', status: 'In Progress', subject: 'Slow loading times on registration page' },
    { id: 'FB-003', date: '2024-07-18', submittedBy: 'Maria Clara', type: 'Inquiry', status: 'Resolved', subject: 'Question about renewal process' },
];


export default function AdminFeedbacksPage() {
    const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      
       <Card>
        <CardHeader>
          <CardTitle>Feedback Inbox</CardTitle>
          <CardDescription>Review feedback, suggestions, and complaints from fisherfolk.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-2 pb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                    placeholder="Search by subject or submitter..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                    />
                </div>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem checked>New</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>In Progress</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Resolved</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date Submitted</TableHead>
                            <TableHead>Submitted By</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Subject</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {feedbacks.map(feedback => (
                            <TableRow key={feedback.id} className="cursor-pointer">
                                <TableCell>{feedback.date}</TableCell>
                                <TableCell>{feedback.submittedBy}</TableCell>
                                <TableCell>{feedback.type}</TableCell>
                                <TableCell>
                                    <Badge variant={feedback.status === 'New' ? 'default' : feedback.status === 'In Progress' ? 'secondary' : 'outline'}>
                                        {feedback.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-medium">{feedback.subject}</TableCell>
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
