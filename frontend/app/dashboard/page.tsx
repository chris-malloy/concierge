// This page should be automatically protected by Clerk middleware

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock Asset Data - Replace with actual data fetching later
const assets = [
  {
    id: "ASSET-001",
    name: "Office Laptop 1",
    type: "Equipment",
    serialNumber: "SN123456789",
    status: "Active",
    customer: "Acme Corp",
  },
  {
    id: "ASSET-002",
    name: "Conference Room Phone",
    type: "Telephone Number",
    serialNumber: "TN987654321", // Or actual phone number
    status: "Active",
    customer: "Acme Corp",
  },
  {
    id: "ASSET-003",
    name: "Software License A",
    type: "License",
    serialNumber: "LIC-ABC-123",
    status: "Inactive",
    customer: "Beta Industries",
  },
  {
    id: "ASSET-004",
    name: "Server Rack Unit 5",
    type: "Equipment",
    serialNumber: "SRU5-XYZ",
    status: "Maintenance",
    customer: "Gamma Enterprises",
  },
];

// Renamed function to match the page
export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      {/* Changed heading to reflect dashboard context */}
      <h1 className="text-3xl font-bold mb-6">Dashboard - Asset Overview</h1>
      <Table>
        <TableCaption>A list of company assets.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Asset ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Serial Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Customer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell className="font-medium">{asset.id}</TableCell>
              <TableCell>{asset.name}</TableCell>
              <TableCell>{asset.type}</TableCell>
              <TableCell>{asset.serialNumber}</TableCell>
              <TableCell>{asset.status}</TableCell>
              <TableCell>{asset.customer}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 