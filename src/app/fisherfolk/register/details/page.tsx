
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslation } from "@/contexts/language-context";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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
        if (!data.gearType) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Gear type is required.", path: ["gearType"] });
        if (!data.specifications) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Specifications are required.", path: ["specifications"] });
    }
});

type RegistrationTypeToggleProps = {
    active: 'vessel' | 'gear';
    onVesselClick: () => void;
    onGearClick: () => void;
};

function RegistrationTypeToggle({ active, onVesselClick, onGearClick }: RegistrationTypeToggleProps) {
  const { t } = useTranslation();
  return (
    <div className="relative flex w-full max-w-xs rounded-full border border-input p-1 mx-auto">
      <div
        className={cn(
          'absolute top-1 left-1 h-10 w-[calc(50%-0.25rem)] rounded-full bg-gradient-to-r from-primary to-accent transition-transform duration-300 ease-in-out',
          active === 'gear' && 'translate-x-[calc(100%-0.1rem)]'
        )}
      />
      <button
        type="button"
        onClick={onVesselClick}
        className={cn(
          'z-10 w-1/2 rounded-full py-2.5 text-sm font-medium transition-colors',
          active === 'vessel' ? 'text-white' : 'text-foreground'
        )}
      >
        {t("Vessel")}
      </button>
      <button
        type="button"
        onClick={onGearClick}
        className={cn(
          'z-10 w-1/2 rounded-full py-2.5 text-sm font-medium transition-colors',
          active === 'gear' ? 'text-white' : 'text-foreground'
        )}
      >
        {t("Fishing Gear")}
      </button>
    </div>
  );
}


export default function FisherfolkRegisterDetailsPage() {
  const { t } = useTranslation();
  const [registrationType, setRegistrationType] = useState<'vessel' | 'gear'>('vessel');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      registrationType: "vessel",
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

  useEffect(() => {
    if (registrationType === 'vessel') {
        form.setValue('vesselId', 'VES-0001');
        form.setValue('gearId', '');
    } else {
        form.setValue('gearId', 'GEAR-0001');
        form.setValue('vesselId', '');
    }
  }, [registrationType, form]);

  const handleRegistrationTypeChange = (type: 'vessel' | 'gear') => {
      setRegistrationType(type);
      form.setValue('registrationType', type);
      form.clearErrors();
  }

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
          
          <RegistrationTypeToggle 
              active={registrationType}
              onVesselClick={() => handleRegistrationTypeChange('vessel')}
              onGearClick={() => handleRegistrationTypeChange('gear')}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>{registrationType === 'vessel' ? t("Vessel Details") : t("Fishing Gear Details")}</CardTitle>
            </CardHeader>
            <CardContent>
              {registrationType === 'vessel' ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="vesselId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Vessel ID")}</FormLabel>
                        <FormControl><Input {...field} readOnly className="bg-muted" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="vesselType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Vessel Type")}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                     <FormField control={form.control} name="horsePower" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Horse Power")}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField control={form.control} name="engineMake" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Engine Make")}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="engineSerialNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Engine Serial No.")}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                   <div className="grid md:grid-cols-4 gap-4">
                     <FormField control={form.control} name="grossTonnage" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Gross Tonnage")}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField control={form.control} name="length" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Length")}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="breadth" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Breadth")}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField control={form.control} name="depth" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Depth")}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="gearId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Gear ID")}</FormLabel>
                        <FormControl><Input {...field} readOnly className="bg-muted"/></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="gearType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Gear Type")}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="specifications" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Specifications")}</FormLabel>
                      <FormControl><Textarea {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
              <CardHeader>
                  <CardTitle>{t("Upload Gear/Vessel Photos")}</CardTitle>
                  <CardDescription>{t("Upload photos of your vessel or gear, make sure to capture its specifications.")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <Button variant="outline" type="button" className="w-full">
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
