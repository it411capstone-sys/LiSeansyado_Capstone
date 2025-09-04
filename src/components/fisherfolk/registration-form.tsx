
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect, useRef } from "react";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { useTranslation } from "@/contexts/language-context";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/hooks/use-auth";

const cantilanBarangays = [
  "Bugsukan",
  "Buntalid",
  "Cabangahan",
  "Cabas-an",
  "Calagdaan",
  "Consuelo",
  "General Island",
  "Linintian",
  "Lobo",
  "Magasang",
  "Magosilom",
  "Pag-ao",
  "Palasao",
  "Parang",
  "Poblacion",
  "San Pedro",
  "Tigabong",
];


const formSchema = z.object({
  controlNo: z.string().optional(),
  fishrNo: z.string().optional(),
  rsbsaNo: z.string().optional(),
  date: z.string().optional(),
  ownerName: z.string().min(2, { message: "Owner name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  contact: z.string().min(10, { message: "Please enter a valid contact number." }),
  address: z.string().optional(),
  outsiderAddress: z.string().optional(),
  isOutsider: z.boolean().default(false).optional(),
}).superRefine((data, ctx) => {
    if (data.isOutsider && !data.outsiderAddress) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Address is required for outsiders.",
            path: ["outsiderAddress"],
        });
    }
    if (!data.isOutsider && !data.address) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select a barangay.",
            path: ["address"],
        });
    }
});

interface RegistrationFormProps {
    onNext: (values: z.infer<typeof formSchema>) => void;
}


export function RegistrationForm({ onNext }: RegistrationFormProps) {
    const { t } = useTranslation();
    const { user, userData } = useAuth();
    const [isOutsider, setIsOutsider] = useState<boolean>(false);
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ownerName: "",
      email: "",
      contact: "",
      isOutsider: false,
      address: "",
      outsiderAddress: "",
      fishrNo: "",
      rsbsaNo: "",
      controlNo: "",
      date: "",
    },
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    form.setValue("date", today);
    form.setValue("controlNo", "LSA-2024-XXXX");
    if(userData) {
        form.setValue("ownerName", userData.displayName);
        form.setValue("email", userData.email);
    }
  }, [form, userData]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    const finalValues = {
        ...values,
        address: values.isOutsider 
            ? values.outsiderAddress || '' 
            : `${values.address}, Cantilan, Surigao del Sur`
    };
    onNext(finalValues);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setProfilePic(file);
        setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("Registration Details")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="controlNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Control No.")}</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-muted"/>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Date")}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="fishrNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("FishR No.")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="rsbsaNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("RSBSA No.")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("Owner Information")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4 py-4">
              <Avatar className="h-24 w-24">
                  <AvatarImage src={previewUrl || ''} alt="Profile Picture" />
                  <AvatarFallback>{userData?.displayName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" /> Upload Profile Picture
              </Button>
            </div>
            <FormField
              control={form.control}
              name="ownerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Full Name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Enter owner's full name")} {...field} />
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
                    <FormLabel>{t("Email Address")}</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder={t("e.g., juan@email.com")} {...field} />
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
                    <FormLabel>{t("Contact Number")}</FormLabel>
                    <FormControl>
                        <Input placeholder={t("e.g., 09123456789")} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t("Address (Barangay in Cantilan)")}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} disabled={isOutsider}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={t("Select a barangay")} />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {cantilanBarangays.map(barangay => (
                            <SelectItem key={barangay} value={barangay}>{barangay}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="isOutsider"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                        <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                            const isChecked = Boolean(checked);
                            field.onChange(isChecked);
                            setIsOutsider(isChecked);
                            if (isChecked) {
                                form.setValue("address", "");
                                form.clearErrors("address");
                            } else {
                                form.setValue("outsiderAddress", "");
                                form.clearErrors("outsiderAddress");
                            }
                        }}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>
                        {t("Check this box if you are a fisherfolk from outside the municipality of Cantilan.")}
                        </FormLabel>
                    </div>
                    </FormItem>
                )}
                />
            {isOutsider && (
               <FormField
                control={form.control}
                name="outsiderAddress"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t("Address (Outside Cantilan)")}</FormLabel>
                    <FormControl>
                        <Input placeholder={t("Enter your full address")} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
            <Button type="submit" size="lg">
                {t("Next Step")} <ArrowRight className="ml-2 h-4 w-4"/>
            </Button>
        </div>
      </form>
    </Form>
  );
}
