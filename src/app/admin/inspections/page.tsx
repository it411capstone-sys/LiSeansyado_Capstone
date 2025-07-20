
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inspections } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/contexts/language-context";

const translationKeys = [
    "Inspection Schedule",
    "Manage upcoming and past inspections.",
    "Vessel/Gear",
    "Inspector",
    "Date",
    "Status",
    "Actions",
    "New Inspection",
    "Fill out the form to conduct an inspection.",
    "Inspection form with checklist and photo upload would be here.",
    "Start Inspection",
    "Generate QR Code",
    "View Details",
    "Mark as Complete",
    "Flag Issue",
    "Cancel Inspection"
];

export default function AdminInspectionsPage() {
    const { t } = useTranslation(translationKeys);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>{t("Inspection Schedule")}</CardTitle>
                <CardDescription>{t("Manage upcoming and past inspections.")}</CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>{t("Vessel/Gear")}</TableHead>
                        <TableHead>{t("Inspector")}</TableHead>
                        <TableHead>{t("Date")}</TableHead>
                        <TableHead>{t("Status")}</TableHead>
                        <TableHead>
                        <span className="sr-only">{t("Actions")}</span>
                        </TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {inspections.map((inspection) => (
                        <TableRow key={inspection.id}>
                        <TableCell className="font-medium">
                            {inspection.vesselName}
                            <div className="text-xs text-muted-foreground">{inspection.registrationId}</div>
                        </TableCell>
                        <TableCell>{inspection.inspector}</TableCell>
                        <TableCell>{inspection.scheduledDate}</TableCell>
                        <TableCell>
                            <Badge variant={inspection.status === 'Flagged' ? 'destructive' : inspection.status === 'Completed' ? 'default' : 'outline'}>{t(inspection.status)}</Badge>
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">{t("Toggle menu")}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
                                <DropdownMenuItem>{t("View Details")}</DropdownMenuItem>
                                <DropdownMenuItem>{t("Mark as Complete")}</DropdownMenuItem>
                                <DropdownMenuItem>{t("Flag Issue")}</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">{t("Cancel Inspection")}</DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t("New Inspection")}</CardTitle>
                    <CardDescription>{t("Fill out the form to conduct an inspection.")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{t("Inspection form with checklist and photo upload would be here.")}</p>
                     <Button className="w-full">{t("Start Inspection")}</Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>{t("Actions")}</CardTitle>
                </CardHeader>
                <CardContent>
                     <Button className="w-full">
                        <QrCode className="mr-2 h-4 w-4"/>
                        {t("Generate QR Code")}
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
