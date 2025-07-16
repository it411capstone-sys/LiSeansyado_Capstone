'use client';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Registration, getStatusIcon } from "@/lib/data";
import { ListFilter, Search, FileDown } from 'lucide-react';

interface RegistrationsClientProps {
  data: Registration[];
}

export function RegistrationsClient({ data }: RegistrationsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);

  const handleStatusFilterChange = (status: string) => {
    setStatusFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const filteredData = data.filter((reg) => {
    const matchesSearch =
      reg.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.vesselName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.gearType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      statusFilters.length === 0 || statusFilters.includes(reg.status);

    return matchesSearch && matchesStatus;
  });

  const allStatuses: Registration['status'][] = ['Approved', 'Pending', 'Rejected', 'Expired'];

  return (
    <div>
      <div className="flex items-center gap-2 pb-4">
        <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
            placeholder="Search by owner, vessel, gear, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
            />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              <ListFilter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter by Status</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {allStatuses.map(status => (
                <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilters.includes(status)}
                    onCheckedChange={() => handleStatusFilterChange(status)}
                >
                    {status}
                </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button className="gap-1">
            <FileDown className="h-3.5 w-3.5"/>
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
        </Button>
      </div>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registration ID</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Vessel / Gear</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
                filteredData.map((reg) => {
                const Icon = getStatusIcon(reg.status);
                return (
                    <TableRow key={reg.id}>
                    <TableCell className="font-medium">{reg.id}</TableCell>
                    <TableCell>{reg.ownerName}</TableCell>
                    <TableCell>
                        <div>{reg.vesselName}</div>
                        <div className="text-xs text-muted-foreground">{reg.gearType}</div>
                    </TableCell>
                    <TableCell>{reg.registrationDate}</TableCell>
                    <TableCell>{reg.expiryDate}</TableCell>
                    <TableCell className="text-right">
                        <Badge variant={reg.status === 'Pending' ? 'secondary' : reg.status === 'Rejected' || reg.status === 'Expired' ? 'destructive' : 'default'} className="capitalize">
                            <Icon className="mr-1 h-3 w-3" />
                            {reg.status}
                        </Badge>
                    </TableCell>
                    </TableRow>
                )
            })
            ) : (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        No results found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
