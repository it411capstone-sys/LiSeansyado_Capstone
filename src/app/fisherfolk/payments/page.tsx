
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslation } from "@/contexts/language-context";

const vesselsRegistrationFees = [
    { item: "Pump boat less than 10 HP", fee: "Php 330.00" },
    { item: "Pump boat 10 HP to 16 HP", fee: "Php 360.00" },
    { item: "Pump boat 16 HP and above but less than 3 G.T", fee: "Php 500.00" },
    { item: "Non-motorized fishing boat", fee: "Php 50.00" },
    { item: "Banca with sail (layag)", fee: "Php 50.00" },
    { item: "Municipal fisherfolk", fee: "Php 50.00" },
];

const certificateFees = [
    { item: "CERTIFICATE OF NUMBER:", fee: "Php 120.00" },
    { item: "PERMIT TO OPERATE", fee: "Php 120.00" },
    { item: "MOTORBOAT OPERATORS PERMIT", fee: "Php 120.00" },
];

const netsLicenseFees = [
    { item: "For each pocot 5 bundles below (length)", fee: "Php 200.00" },
    { item: "For each pocot 5-10 bundles (length)", fee: "Php 300.00" },
    { item: "For each additional 1 bundle in length", fee: "Php 50.00" },
    { item: "Anod", fee: "Php 20.00" },
    { item: "Pamarongoy with motorboat", fee: "Php 100.00" },
    { item: "Pamarongoy without motorboat", fee: "Php 50.00" },
    { item: "Palaran or drift gill net (panglaklak)\nFrom 1-10 meters long\nFrom 10-25 meters long\nFrom 25 meters and over", fee: "Php 100.00\nPhp 120.00\nPhp 150.00" },
    { item: "Panganduhaw or Panulid\nFrom 20m to 50m\nFor each additional 50m", fee: "Php 200.00\nPhp 20.00" },
    { item: "Sapyao / sarap", fee: "Php 200.00" },
    { item: "Pamo / Pamangsi", fee: "Php 600.00" },
    { item: "Basnig / baling", fee: "Php 800.00" },
    { item: "Baling (special permit)", fee: "Php 350.00" },
];

const otherGearsFees = [
    { item: "Lamp and spear", fee: "Php 50.00" },
    { item: "Bow and Arrow with light", fee: "Php 100.00" },
    { item: "Scoop net with light (sarap)", fee: "Php 100.00" },
    { item: "Jigs (squid – kayongkong. Ect)", fee: "Php 50.00" },
];

const trapsGearsFees = [
    { item: "Crab lift net (pintol)\nIn excess to 100 sq.m", fee: "Php 50.00\nPhp 2.00/sq.m." },
    { item: "Crab pot (panggal/anglambay/bantak)\nIn excess of 100 sq.m.", fee: "Php 50.00\nPhp 2.00/sq.m." },
    { item: "Lobster pot (bubo pagbanagan)\nIn excess of 100 sq.m.", fee: "Php 110.00\nPhp 3.00/sq.m." },
    { item: "Fish Pot-large (bubo-hampas, pangal, timing)\nIn excess of 100 sq.m.", fee: "Php 110.00\nPhp 3. 00/sq.m." },
    { item: "Squid Pot (bubo pangnokus) Bungsod\nIn excess of 100 sq.m.", fee: "Php 110.00\nPhp 3.00/sq.m" },
    { item: "Bungsod", fee: "Php 150.00" },
];

const hookAndLineFees = [
    { item: "Simple Hook and lines (bira-bira; pamingwit; ton-ton)", fee: "Php 100.00" },
    { item: "Hook and lines with float (pamataw)", fee: "Php 100.00" },
    { item: "Multiple handline (undak-undak; birabira; tuwang-tuwang)", fee: "Php 100.00" },
    { item: "Drag handlines (Margati/bahan)", fee: "Php 300.00" },
    { item: "Troll line (lambu; palangre – lutaw)", fee: "Php 170.00" },
];


export default function FisherfolkPaymentsPage() {
    const { t } = useTranslation();
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t("Payments")}</h1>
        <p className="text-muted-foreground">
          {t("The Municipal Agriculture Office will verify your registration, inspect your fishing gears and vessels, and then send you the summary of your payment. Please wait patiently for the official notification.  Once you receive it, you may settle your payment at the Municipal Treasurer's Office.")}
        </p>
      </div>

      <Card>
          <CardHeader>
              <CardTitle>{t("Guidelines")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
              <Table>
                <TableHeader><TableRow><TableHead className="font-bold">VESSELS REGISTRATION FEE</TableHead><TableHead className="text-right font-bold">ANNUAL FEE</TableHead></TableRow></TableHeader>
                <TableBody>
                    {vesselsRegistrationFees.map(item => (
                        <TableRow key={item.item}><TableCell>{item.item}</TableCell><TableCell className="text-right">{item.fee}</TableCell></TableRow>
                    ))}
                </TableBody>
              </Table>
              <Table>
                <TableBody>
                    {certificateFees.map(item => (
                        <TableRow key={item.item}><TableCell>{item.item}</TableCell><TableCell className="text-right">{item.fee}</TableCell></TableRow>
                    ))}
                </TableBody>
              </Table>
              <Table>
                  <TableHeader><TableRow><TableHead className="font-bold">LICENSE FEE</TableHead><TableHead className="text-right font-bold">ANNUAL FEE</TableHead></TableRow></TableHeader>
                  <TableBody>
                    <TableRow><TableCell colSpan={2} className="font-semibold">A. Fishefolks using nets</TableCell></TableRow>
                     {netsLicenseFees.map(item => (
                        <TableRow key={item.item}><TableCell className="whitespace-pre-line pl-8">{item.item}</TableCell><TableCell className="text-right whitespace-pre-line">{item.fee}</TableCell></TableRow>
                    ))}
                    <TableRow><TableCell colSpan={2} className="font-semibold pt-6">B. Fisherfolks Using Other Fishing Gears</TableCell></TableRow>
                     {otherGearsFees.map(item => (
                        <TableRow key={item.item}><TableCell className="pl-8">{item.item}</TableCell><TableCell className="text-right">{item.fee}</TableCell></TableRow>
                    ))}
                     <TableRow><TableCell colSpan={2} className="font-semibold pt-6">C. Fisherfolk using traps/gears</TableCell></TableRow>
                     {trapsGearsFees.map(item => (
                        <TableRow key={item.item}><TableCell className="whitespace-pre-line pl-8">{item.item}</TableCell><TableCell className="text-right whitespace-pre-line">{item.fee}</TableCell></TableRow>
                    ))}
                    <TableRow><TableCell colSpan={2} className="font-semibold pt-6">D. Fisherfolks Using Hook and Line</TableCell></TableRow>
                     {hookAndLineFees.map(item => (
                        <TableRow key={item.item}><TableCell className="pl-8">{item.item}</TableCell><TableCell className="text-right">{item.fee}</TableCell></TableRow>
                    ))}
                  </TableBody>
              </Table>
          </CardContent>
      </Card>

       <Card className="mt-8">
        <CardHeader>
          <CardTitle>{t("Payment History")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">{t("No payment history available.")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
