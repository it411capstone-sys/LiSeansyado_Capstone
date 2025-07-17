
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition } from "react";
import { complianceSuggestion } from "@/ai/flows/compliance-suggestion";
import type { ComplianceSuggestionOutput } from "@/ai/flows/compliance-suggestion";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bot, FileCheck2, Lightbulb, Loader2, Sparkles, Upload } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const formSchema = z.object({
  ownerName: z.string().min(2, { message: "Owner name is required." }).default("Juan Dela Cruz"),
  email: z.string().email({ message: "Please enter a valid email address." }),
  contact: z.string().min(10, { message: "Please enter a valid contact number." }),
  fishermanProfile: z.string().min(10, { message: "Please provide a brief profile." }).default("15 years experience, resident of Cantilan."),
  registrationType: z.enum(["vessel", "gear"], { required_error: "You need to select a registration type."}),
  vesselType: z.string().min(2, { message: "Vessel details are required." }),
  gearType: z.string().min(2, { message: "Gear details are required." }),
});

export function RegistrationForm() {
  const [isPending, startTransition] = useTransition();
  const [aiResult, setAiResult] = useState<ComplianceSuggestionOutput | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ownerName: "Juan Dela Cruz",
      email: "juan.delacruz@email.com",
      contact: "09123456789",
      fishermanProfile: "15 years experience, resident of Cantilan.",
      vesselType: "",
      gearType: "",
    },
  });

  const handleComplianceCheck = () => {
    const values = form.getValues();
    if (!values.vesselType || !values.gearType) {
        form.trigger(["vesselType", "gearType"]);
        return;
    }
    setAiError(null);
    setAiResult(null);
    startTransition(async () => {
        const result = await complianceSuggestion(values);
        if (result) {
            setAiResult(result);
        } else {
            setAiError("Failed to get compliance suggestions. Please try again.");
        }
    });
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Handle final form submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Owner Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="ownerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter owner's full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder="e.g., juan@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., 09123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormField
              control={form.control}
              name="fishermanProfile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fisherman Profile</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., 10 years experience, operates in local waters, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vessel & Gear Details</CardTitle>
            <CardDescription>Provide the specifics of the vessel and fishing gear you wish to register.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="registrationType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>What are you registering?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="vessel" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Vessel
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="gear" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Fishing Gear only
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vesselType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vessel Type & Details</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Small motorized banca, 5 meters, 3 GT. Write N/A if gear only." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gearType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fishing Gear Type & Details</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Gillnet, 100 meters, 2-inch mesh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="text-accent h-5 w-5" /> AI Compliance Assistant</CardTitle>
            <CardDescription>Use our AI tool to check if your registration details align with local and national regulations.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button type="button" onClick={handleComplianceCheck} disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
              Analyze for Compliance
            </Button>
            {isPending && <p className="text-sm text-muted-foreground mt-2">AI is analyzing... please wait.</p>}
            {aiError && <Alert variant="destructive" className="mt-4"><AlertDescription>{aiError}</AlertDescription></Alert>}
            {aiResult && (
                 <Alert className="mt-4 border-primary/50">
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle>Compliance Suggestions</AlertTitle>
                    <AlertDescription className="space-y-4">
                        <div>
                            <h4 className="font-semibold">Suggestions:</h4>
                            <ul className="list-disc pl-5">
                                {aiResult.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold">Relevant Regulations:</h4>
                            <ul className="list-disc pl-5">
                                {aiResult.relevantRegulations.map((r, i) => <li key={i}>{r}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold">Necessary Actions:</h4>
                            <ul className="list-disc pl-5">
                                {aiResult.necessaryActions.map((a, i) => <li key={i}>{a}</li>)}
                            </ul>
                        </div>
                    </AlertDescription>
                 </Alert>
            )}
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Supporting Documents</CardTitle>
                <CardDescription>Upload photos of your vessel, gear, and any other required documents.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" type="button">
                    <Upload className="mr-2 h-4 w-4"/> Upload Files
                </Button>
            </CardContent>
        </Card>


        <div className="flex justify-end">
            <Button type="submit" size="lg">
                <FileCheck2 className="mr-2 h-4 w-4"/> Submit Registration
            </Button>
        </div>
      </form>
    </Form>
  );
}
