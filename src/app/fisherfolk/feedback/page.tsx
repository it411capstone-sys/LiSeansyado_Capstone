import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function FisherfolkFeedbackPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Submit Feedback</h1>
        <p className="text-muted-foreground">
          Have a complaint or suggestion? Let us know.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Feedback Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <Label htmlFor="feedback-type">Feedback Type</Label>
                <Select>
                    <SelectTrigger id="feedback-type">
                        <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="suggestion">Suggestion</SelectItem>
                        <SelectItem value="complaint">Complaint</SelectItem>
                        <SelectItem value="bug">Report a Bug</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="e.g., Difficulty uploading photos"/>
            </div>
            <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Describe your feedback in detail..." rows={5}/>
            </div>
            <div className="flex justify-end">
                <Button>Submit Feedback</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
