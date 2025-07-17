
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

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
  ownerName: z.string().min(2, { message: "Owner name is required." }).default("Juan Dela Cruz"),
  email: z.string().email({ message: "Please enter a valid email address." }),
  contact: z.string().min(10, { message: "Please enter a valid contact number." }),
  address: z.string().optional(),
  outsiderAddress: z.string().optional(),
  isOutsider: z.boolean().default(false).optional(),
  registrationType: z.enum(["vessel", "gear"], { required_error: "You need to select a registration type."}),
  size: z.string().min(1, "Size is required."),
  color: z.string().min(1, "Color is required."),
  width: z.string().min(1, "Width is required."),
  height: z.string().min(1, "Height is required."),
  weight: z.string().min(1, "Weight is required."),
  creationDate: z.string().min(1, "Creation date is required."),
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

export function RegistrationForm() {
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
      size: "",
      color: "",
      width: "",
      height: "",
      weight: "",
      creationDate: ""
    },
  });

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
                name="address"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Address (Barangay in Cantilan)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} disabled={isOutsider}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a barangay" />
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
                        Check this box if you are a fisherfolk from outside the municipality of Cantilan.
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
                    <FormLabel>Address (Outside Cantilan)</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter your full address" {...field} />
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
            <CardTitle>Vessel & Gear Details</CardTitle>
            <CardDescription>Provide the specifics of the vessel or fishing gear you wish to register.</CardDescription>
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
                          Fishing Gear
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Size (e.g., 5 meters)</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter size" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter color" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Width (e.g., 2 meters)</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter width" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Height (e.g., 1.5 meters)</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter height" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Weight (e.g., 500 kg)</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter weight" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="creationDate"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Creation Date</FormLabel>
                        <FormControl>
                            <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Upload Gear/Vessel Photos</CardTitle>
                <CardDescription>Upload photos of your vessel or gear, make sure to capture its specifications.</CardDescription>
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
