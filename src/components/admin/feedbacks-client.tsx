
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { ListFilter, Search, MessageSquare } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "@/contexts/language-context";
import { Feedback } from "@/lib/types";
import { collection, doc, onSnapshot, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";


export function FeedbacksClient() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilters, setStatusFilters] = useState<string[]>([]);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    
    useEffect(() => {
        const q = query(collection(db, "feedbacks"), orderBy("date", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const feedbacksData: Feedback[] = [];
            snapshot.forEach(doc => {
                feedbacksData.push({ id: doc.id, ...doc.data() } as Feedback);
            });
            setFeedbacks(feedbacksData);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!selectedFeedback && feedbacks.length > 0) {
            setSelectedFeedback(feedbacks[0]);
        }
    }, [feedbacks, selectedFeedback]);

    const handleStatusChange = async (feedbackId: string, newStatus: Feedback['status']) => {
        const feedbackRef = doc(db, "feedbacks", feedbackId);
        try {
            await updateDoc(feedbackRef, { status: newStatus });
            toast({
                title: "Status Updated",
                description: `Feedback status changed to ${newStatus}.`,
            });
        } catch (error) {
            console.error("Error updating feedback status: ", error);
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: "Could not update feedback status.",
            });
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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusFilterChange = (status: string) => {
        setStatusFilters((prev) =>
          prev.includes(status)
            ? prev.filter((s) => s !== status)
            : [...prev, status]
        );
    };

     const filteredFeedbacks = useMemo(() => feedbacks.filter(feedback => {
        const matchesSearch = feedback.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              feedback.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilters.length === 0 || statusFilters.includes(feedback.status);
        return matchesSearch && matchesStatus;
    }), [feedbacks, searchTerm, statusFilters]);


  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
       <Card className="lg:col-span-2">
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
                    onChange={handleSearchChange}
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
                            <TableHead>{t("Submitted By")}</TableHead>
                            <TableHead>{t("Status")}</TableHead>
                            <TableHead>{t("Subject")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredFeedbacks.map(feedback => (
                            <TableRow 
                                key={feedback.id}
                                onClick={() => setSelectedFeedback(feedback)}
                                className="cursor-pointer"
                                data-state={selectedFeedback?.id === feedback.id ? 'selected' : ''}
                            >
                                <TableCell>{feedback.submittedBy}</TableCell>
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
        <div className="lg:col-span-1">
        {selectedFeedback ? (
          <Card>
            <CardHeader>
              <CardTitle>{t("Feedback Details")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Subject</p>
                <p className="font-semibold">{t(selectedFeedback.subject)}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted By</p>
                    <p>{selectedFeedback.submittedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date Submitted</p>
                    <p>{selectedFeedback.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p>{t(selectedFeedback.type)}</p>
                  </div>
                   <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={getStatusVariant(selectedFeedback.status)}>
                      {t(selectedFeedback.status)}
                    </Badge>
                  </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Message</p>
                <p className="whitespace-pre-wrap">{t(selectedFeedback.message)}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex h-full items-center justify-center">
            <CardContent className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="mt-4 text-lg font-semibold">{t("No Feedback Selected")}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    {t("Select a feedback from the list to view its details.")}
                </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
