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
import { unstable_noStore as noStore } from 'next/cache';

interface Asset {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  status: string;
  customer: string; // Or perhaps customerId/customerName depending on API
}

async function fetchAssets(): Promise<Asset[]> {
  // Opt out of caching for dynamic data
  noStore();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error("Error: NEXT_PUBLIC_API_URL is not defined.");
    throw new Error("API URL is not configured."); // Or return empty array/handle differently
  }

  try {
    // Adjust the endpoint '/api/assets' if needed
    const response = await fetch(`${apiUrl}/api/assets`);

    if (!response.ok) {
      // Log more specific error from response if possible
      console.error(`Error fetching assets: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch assets. Status: ${response.status}`);
    }

    const assets: Asset[] = await response.json();
    return assets;
  } catch (error) {
    console.error("Failed to fetch assets:", error);
    // Re-throw or return empty array/handle error state in UI
    throw new Error("Could not fetch assets from the backend.");
  }
}

// Make the component async to fetch data
export default async function DashboardPage() {
  let assets: Asset[] = [];
  let error: string | null = null;

  try {
    assets = await fetchAssets();
  } catch (e: any) {
    error = e.message || "An unknown error occurred while fetching assets.";
  }

  return (
    <div className="container mx-auto py-10">
      {/* Changed heading to reflect dashboard context */}
      <h1 className="text-3xl font-bold mb-6">Dashboard - Asset Overview</h1>

      {error && (
        <div className="text-red-600 bg-red-100 border border-red-400 p-4 rounded mb-4">
          <p>Error loading assets:</p>
          <p>{error}</p>
          <p>Please ensure the backend API is running and the URL ({process.env.NEXT_PUBLIC_API_URL}/api/assets) is correct.</p>
        </div>
      )}

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
           {assets.length === 0 && !error && (
             <TableRow>
               <TableCell colSpan={6} className="text-center">No assets found.</TableCell>
            </TableRow>
          )}
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