
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
import { Feedback } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function FisherfolkFeedbackPage() {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { user, userData } = useAuth();

    const [feedbackType, setFeedbackType] = useState<Feedback['type'] | ''>('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setFeedbackType('');
        setSubject('');
        setMessage('');
    };

    const handleSubmit = async () => {
        if (!feedbackType || !subject || !message) {
            toast({
                variant: 'destructive',
                title: t('Incomplete Form'),
                description: t('Please fill out all fields before submitting.'),
            });
            return;
        }

        if (!userData) {
            toast({
                variant: 'destructive',
                title: 'Not Logged In',
                description: 'You must be logged in to submit feedback.',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const feedbackDoc = {
                date: new Date().toISOString().split('T')[0],
                submittedBy: userData.displayName,
                type: feedbackType as Feedback['type'],
                status: 'New' as Feedback['status'],
                subject: subject,
                message: message,
            };
            
            const docRef = await addDoc(collection(db, "feedbacks"), feedbackDoc);

            await addDoc(collection(db, "adminNotifications"), {
                date: new Date().toISOString(),
                title: "New Feedback",
                message: `${userData.displayName} submitted new feedback: "${subject}"`,
                category: 'Feedback',
                isRead: false,
                link: `/admin/feedbacks?id=${docRef.id}`
            });

            toast({
                title: t('Feedback Submitted'),
                description: t('Thank you! Your feedback has been sent to the administrators.'),
            });

            resetForm();
        } catch (error) {
            console.error("Error submitting feedback: ", error);
            toast({
                variant: 'destructive',
                title: t('Submission Failed'),
                description: t('There was an error submitting your feedback. Please try again.'),
            });
        } finally {
            setIsSubmitting(false);
        }
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
                <Button onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? t("Submitting...") : t("Submit Feedback")}</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
