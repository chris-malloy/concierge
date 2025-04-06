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

// Define the Asset type based on the backend model
// Note: This should align with the actual structure returned by your API
type Asset = {
  Id: number; // Assuming backend sends PascalCase
  Name: string;
  Type: string; // Assuming AssetType enum is serialized as string
  SerialNumber: string | null;
  CustomerId: number;
  IsManaged: boolean;
  Manufacturer: string | null;
  Model: string | null;
  DateCreated: string; // Assuming dates are serialized as strings
  DateModified: string;
};

// Mock Asset Data - Replace with actual data fetching later - REMOVE THIS
// const assets = [...]; // REMOVED

// Renamed function to match the page and make it async
export default async function DashboardPage() {
  let assets: Asset[] = [];
  let fetchError: string | null = null;

  try {
    // Use an environment variable for the API base URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error("NEXT_PUBLIC_API_URL environment variable is not set.");
    }

    const response = await fetch(`${apiUrl}/api/assets`, {
      // Add cache control if needed, e.g., no-store for dynamic data
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch assets: ${response.statusText}`);
    }

    assets = await response.json();
  } catch (error) {
    console.error("Error fetching assets:", error);
    fetchError = error instanceof Error ? error.message : "An unknown error occurred.";
    // Keep assets as empty array in case of error
  }

  return (
    <div className="container mx-auto py-10">
      {/* Changed heading to reflect dashboard context */}
      <h1 className="text-3xl font-bold mb-6">Dashboard - Asset Overview</h1>

      {fetchError && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
          <span className="font-medium">Error:</span> {fetchError}
        </div>
      )}

      <Table>
        {/* Updated Caption */}
        <TableCaption>A list of company assets retrieved from the API.</TableCaption>
        <TableHeader>
          <TableRow>
            {/* Updated Headers based on Asset type */}
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Serial Number</TableHead>
            <TableHead>Customer ID</TableHead>
            {/* Removed Status header */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Map over fetched assets */}
          {assets.length > 0 ? (
            assets.map((asset) => (
              <TableRow key={asset.Id}>
                {/* Use actual asset fields (assuming PascalCase from API) */}
                <TableCell className="font-medium">{asset.Id}</TableCell>
                <TableCell>{asset.Name}</TableCell>
                <TableCell>{asset.Type}</TableCell>
                <TableCell>{asset.SerialNumber ?? "N/A"}</TableCell> {/* Handle null */}
                <TableCell>{asset.CustomerId}</TableCell>
                {/* Removed Status and Customer Name cells */}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                {fetchError ? "Could not load data." : "No assets found."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
} 