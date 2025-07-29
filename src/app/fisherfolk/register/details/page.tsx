
'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslation } from "@/contexts/language-context";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
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


export default function FisherfolkRegisterDetailsPage() {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t("New Registration - Step 2")}</h1>
        <p className="text-muted-foreground">
          {t("Provide the details for your vessel or fishing gear.")}
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                            <RadioGroupItem value="vessel" id="vessel"/>
                          </FormControl>
                          <FormLabel htmlFor="vessel" className="font-normal">
                            {t("Vessel")}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="gear" id="gear"/>
                          </FormControl>
                          <FormLabel htmlFor="gear" className="font-normal">
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
    </div>
  );
}
