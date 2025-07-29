
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";

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
import { FileCheck2, Upload } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { useTranslation } from "@/contexts/language-context";
import { Textarea } from "../ui/textarea";

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
  registrationType: z.enum(["vessel", "gear"], { required_error: "You need to select a registration type."}),
  vesselId: z.string().optional(),
  vesselType: z.string().optional(),
  horsePower: z.string().optional(),
  engineMake: z.string().optional(),
  engineSerialNumber: z.string().optional(),
  grossTonnage: z.string().optional(),
  length: z.string().optional(),
  breadth: z.string().optional(),
  depth: z.string().optional(),
  gearId: z.string().optional(),
  gearType: z.string().optional(),
  specifications: z.string().optional(),
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

    if (data.registrationType === 'vessel') {
        if (!data.vesselId) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Vessel ID is required.", path: ["vesselId"] });
        if (!data.vesselType) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Vessel type is required.", path: ["vesselType"] });
        if (!data.horsePower) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Horse power is required.", path: ["horsePower"] });
        if (!data.engineMake) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Engine make is required.", path: ["engineMake"] });
        if (!data.engineSerialNumber) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Engine serial number is required.", path: ["engineSerialNumber"] });
        if (!data.grossTonnage) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Gross tonnage is required.", path: ["grossTonnage"] });
        if (!data.length) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Length is required.", path: ["length"] });
        if (!data.breadth) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Breadth is required.", path: ["breadth"] });
        if (!data.depth) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Depth is required.", path: ["depth"] });
    }

    if (data.registrationType === 'gear') {
        if (!data.gearId) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Gear ID is required.", path: ["gearId"] });
        if (!data.gearType) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Gear type is required.", path: ["gearType"] });
        if (!data.specifications) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Specifications are required.", path: ["specifications"] });
    }
});

export function RegistrationForm() {
    const { t } = useTranslation();
  const [isOutsider, setIsOutsider] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ownerName: "Juan Dela Cruz",
      email: "juan.delacruz@email.com",
      contact: "09123456789",
      isOutsider: false,
      address: "",
      outsiderAddress: "",
      fishrNo: "",
      rsbsaNo: "",
      controlNo: "",
      date: "",
      vesselId: "",
      vesselType: "",
      horsePower: "",
      engineMake: "",
      engineSerialNumber: "",
      grossTonnage: "",
      length: "",
      breadth: "",
      depth: "",
      gearId: "",
      gearType: "",
      specifications: "",
    },
  });

  const registrationType = form.watch("registrationType");

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    form.setValue("date", today);
    form.setValue("controlNo", "LSA-2024-XXXX");
  }, [form]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

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

        <Card>
          <CardHeader>
            <CardTitle>{t("Vessel & Gear Details")}</CardTitle>
            <CardDescription>{t("Provide the specifics of the vessel or fishing gear you wish to register.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="registrationType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{t("What are you registering?")}</FormLabel>
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
                          {t("Vessel")}
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="gear" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {t("Fishing Gear")}
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {registrationType === 'vessel' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                    <FormField control={form.control} name="vesselId" render={({ field }) => ( <FormItem> <FormLabel>Vessel ID</FormLabel> <FormControl> <Input placeholder="Enter Vessel ID" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="vesselType" render={({ field }) => ( <FormItem> <FormLabel>Vessel Type</FormLabel> <FormControl> <Input placeholder="e.g., Motorized Banca" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="horsePower" render={({ field }) => ( <FormItem> <FormLabel>Horse Power</FormLabel> <FormControl> <Input placeholder="e.g., 16 HP" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="engineMake" render={({ field }) => ( <FormItem> <FormLabel>Engine Make</FormLabel> <FormControl> <Input placeholder="e.g., Yamaha" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="engineSerialNumber" render={({ field }) => ( <FormItem> <FormLabel>Engine Serial Number</FormLabel> <FormControl> <Input placeholder="Enter engine serial number" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="grossTonnage" render={({ field }) => ( <FormItem> <FormLabel>Gross Tonnage</FormLabel> <FormControl> <Input placeholder="e.g., 3 GT" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="length" render={({ field }) => ( <FormItem> <FormLabel>Length (meters)</FormLabel> <FormControl> <Input placeholder="Enter length" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="breadth" render={({ field }) => ( <FormItem> <FormLabel>Breadth (meters)</FormLabel> <FormControl> <Input placeholder="Enter breadth" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="depth" render={({ field }) => ( <FormItem> <FormLabel>Depth (meters)</FormLabel> <FormControl> <Input placeholder="Enter depth" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                </div>
            )}
            {registrationType === 'gear' && (
                <div className="space-y-4 pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="gearId" render={({ field }) => ( <FormItem> <FormLabel>Gear ID</FormLabel> <FormControl> <Input placeholder="Enter Gear ID" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                        <FormField control={form.control} name="gearType" render={({ field }) => ( <FormItem> <FormLabel>Gear Type</FormLabel> <FormControl> <Input placeholder="e.g., Gillnet" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    </div>
                    <FormField control={form.control} name="specifications" render={({ field }) => ( <FormItem> <FormLabel>Specifications</FormLabel> <FormControl> <Textarea placeholder="e.g., Mesh size, length, material" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                </div>
            )}
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>{t("Upload Gear/Vessel Photos")}</CardTitle>
                <CardDescription>{t("Upload photos of your vessel or gear, make sure to capture its specifications.")}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" type="button">
                    <Upload className="mr-2 h-4 w-4"/> {t("Upload Files")}
                </Button>
            </CardContent>
        </Card>


        <div className="flex justify-end">
            <Button type="submit" size="lg">
                <FileCheck2 className="mr-2 h-4 w-4"/> {t("Submit Registration")}
            </Button>
        </div>
      </form>
    </Form>
  );
}

    