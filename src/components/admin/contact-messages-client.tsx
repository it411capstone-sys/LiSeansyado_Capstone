

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { ListFilter, Search, MessageSquare, Mail, User, Send, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "@/contexts/language-context";
import { ContactMessage } from "@/lib/types";
import { collection, doc, onSnapshot, updateDoc, query, orderBy, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export function ContactMessagesClient() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilters, setStatusFilters] = useState<string[]>([]);
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
    const [replySubject, setReplySubject] = useState('');
    const [replyBody, setReplyBody] = useState('');
    const [isSending, setIsSending] = useState(false);
    
    useEffect(() => {
        const q = query(collection(db, "contactMessages"), orderBy("submittedAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messagesData: ContactMessage[] = [];
            snapshot.forEach(doc => {
                messagesData.push({ id: doc.id, ...doc.data() } as ContactMessage);
            });
            setMessages(messagesData);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!selectedMessage && messages.length > 0) {
            setSelectedMessage(messages[0]);
        } else if (selectedMessage) {
            const updatedSelection = messages.find(m => m.id === selectedMessage.id);
            setSelectedMessage(updatedSelection || null);
        }
    }, [messages, selectedMessage]);

    useEffect(() => {
        if (selectedMessage) {
            setReplySubject(`Re: ${selectedMessage.subject}`);
            const template = `Dear ${selectedMessage.name},\n\nThank you for reaching out to us. \n\n[Your response here]\n\nBest regards,\nThe LiSEAnsyado Team`;
            setReplyBody(template);
        }
    }, [selectedMessage]);

    const handleStatusChange = async (messageId: string, newStatus: ContactMessage['status']) => {
        const messageRef = doc(db, "contactMessages", messageId);
        try {
            await updateDoc(messageRef, { status: newStatus });
            toast({
                title: "Status Updated",
                description: `Message status changed to ${newStatus}.`,
            });
        } catch (error) {
            console.error("Error updating message status: ", error);
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: "Could not update message status.",
            });
        }
    };

    const handleSendReply = async () => {
        if (!selectedMessage || !replySubject || !replyBody) {
            toast({ variant: "destructive", title: "Missing fields", description: "Please fill in all fields."});
            return;
        }

        setIsSending(true);
        try {
            // This will create a new document in the `mail` collection.
            // The "Trigger Email" extension will then pick it up and send the email.
            await addDoc(collection(db, "mail"), {
                to: selectedMessage.email,
                message: {
                  subject: replySubject,
                  html: replyBody.replace(/\n/g, '<br>'), // Convert newlines to HTML breaks
                },
            });
            
            await handleStatusChange(selectedMessage.id, 'Archived');

            toast({
                title: "Email Sent!",
                description: `Your reply to ${selectedMessage.name} has been sent successfully.`,
            });
            setIsReplyDialogOpen(false);
        } catch(error) {
            console.error("Error sending email:", error);
            toast({ variant: "destructive", title: "Send Failed", description: "Could not send the email. Please check your Firestore security rules and extension configuration." });
        } finally {
            setIsSending(false);
        }
    };
    
    const getStatusVariant = (status: ContactMessage['status']): BadgeProps['variant'] => {
        switch(status) {
            case 'New': return 'default';
            case 'Read': return 'secondary';
            case 'Archived': return 'outline';
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

    const filteredMessages = useMemo(() => messages.filter(message => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
            message.name.toLowerCase().includes(searchLower) ||
            message.email.toLowerCase().includes(searchLower) ||
            message.subject.toLowerCase().includes(searchLower);
        const matchesStatus = statusFilters.length === 0 || statusFilters.includes(message.status);
        return matchesSearch && matchesStatus;
    }), [messages, searchTerm, statusFilters]);

    const handleRowClick = (message: ContactMessage) => {
        setSelectedMessage(message);
        if (message.status === 'New') {
            handleStatusChange(message.id, 'Read');
        }
    }


  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
       <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{t("Contact Form Queries")}</CardTitle>
          <CardDescription>{t("View and manage messages submitted through the website's contact form.")}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-2 pb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                    placeholder={t("Search by name, email, or subject...")}
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
                    {(['New', 'Read', 'Archived'] as const).map(status => (
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
                            <TableHead>{t("From")}</TableHead>
                            <TableHead>{t("Status")}</TableHead>
                            <TableHead>{t("Subject")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredMessages.map(message => (
                            <TableRow 
                                key={message.id}
                                onClick={() => handleRowClick(message)}
                                className="cursor-pointer"
                                data-state={selectedMessage?.id === message.id ? 'selected' : ''}
                            >
                                <TableCell>
                                    <div className="font-medium">{message.name}</div>
                                    <div className="text-xs text-muted-foreground">{message.email}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(message.status)}>
                                        {t(message.status)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-medium">{t(message.subject)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
        <div className="lg:col-span-1">
        {selectedMessage ? (
          <Card>
            <CardHeader>
              <CardTitle>{t("Message Details")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Subject</p>
                <p className="font-semibold">{t(selectedMessage.subject)}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">From</p>
                    <p>{selectedMessage.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedMessage.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date Submitted</p>
                    <p>{formatDistanceToNow(new Date(selectedMessage.submittedAt), { addSuffix: true })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                             <Badge variant={getStatusVariant(selectedMessage.status)} className="cursor-pointer">
                                {t(selectedMessage.status)}
                            </Badge>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>{t("Change Status")}</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => handleStatusChange(selectedMessage.id, 'New')}>{t("New")}</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleStatusChange(selectedMessage.id, 'Read')}>{t("Read")}</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleStatusChange(selectedMessage.id, 'Archived')}>{t("Archived")}</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Message</p>
                <p className="whitespace-pre-wrap">{t(selectedMessage.message)}</p>
              </div>
              <Separator />
              <div className="flex gap-2">
                <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Mail className="mr-2 h-4 w-4" /> Reply via Email
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                            <DialogTitle>Reply to {selectedMessage.name}</DialogTitle>
                            <DialogDescription>
                                Your email will be sent from liseansyado.helpdesk@gmail.com
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="reply-subject">Subject</Label>
                                <Input id="reply-subject" value={replySubject} onChange={e => setReplySubject(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="reply-body">Message</Label>
                                <Textarea id="reply-body" value={replyBody} onChange={e => setReplyBody(e.target.value)} rows={10} />
                            </div>
                        </div>
                        <Button onClick={handleSendReply} disabled={isSending}>
                            {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Send className="mr-2 h-4 w-4"/> Send Email
                        </Button>
                    </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex h-full items-center justify-center">
            <CardContent className="text-center p-6">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="mt-4 text-lg font-semibold">{t("No Message Selected")}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    {t("Select a message from the list to view its details.")}
                </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
