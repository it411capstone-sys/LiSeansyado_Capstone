
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/contexts/language-context";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { feedbacks, users } from "@/lib/data";
import { Feedback } from "@/lib/types";

export default function FisherfolkFeedbackPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [feedbackType, setFeedbackType] = useState<Feedback['type'] | ''>('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        if (!feedbackType || !subject || !message) {
            toast({
                variant: 'destructive',
                title: t('Incomplete Form'),
                description: t('Please fill out all fields before submitting.'),
            });
            return;
        }

        const newFeedback: Feedback = {
            id: `FB-${String(feedbacks.length + 1).padStart(3, '0')}`,
            date: new Date().toISOString().split('T')[0],
            submittedBy: users.fisherfolk.name,
            type: feedbackType as Feedback['type'],
            status: 'New',
            subject: subject,
            message: message,
        };

        feedbacks.unshift(newFeedback);

        toast({
            title: t('Feedback Submitted'),
            description: t('Thank you! Your feedback has been sent to the administrators.'),
        });

        // Reset form
        setFeedbackType('');
        setSubject('');
        setMessage('');
    };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t("Submit Feedback")}</h1>
        <p className="text-muted-foreground">
          {t("Have a complaint or suggestion? Let us know.")}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("Feedback Form")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <Label htmlFor="feedback-type">{t("Feedback Type")}</Label>
                <Select value={feedbackType} onValueChange={(value) => setFeedbackType(value as Feedback['type'])}>
                    <SelectTrigger id="feedback-type">
                        <SelectValue placeholder={t("Select a type")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Suggestion">{t("Suggestion")}</SelectItem>
                        <SelectItem value="Complaint">{t("Complaint")}</SelectItem>
                        <SelectItem value="Bug">{t("Report a Bug")}</SelectItem>
                        <SelectItem value="Other">{t("Other")}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="subject">{t("Subject")}</Label>
                <Input id="subject" placeholder={t("e.g., Difficulty uploading photos")} value={subject} onChange={e => setSubject(e.target.value)} />
            </div>
            <div>
                <Label htmlFor="message">{t("Message")}</Label>
                <Textarea id="message" placeholder={t("Describe your feedback in detail...")} rows={5} value={message} onChange={e => setMessage(e.target.value)} />
            </div>
            <div className="flex justify-end">
                <Button onClick={handleSubmit}>{t("Submit Feedback")}</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
