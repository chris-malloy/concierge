import { unstable_noStore as noStore } from 'next/cache';

export interface Asset {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  status: string;
  customer: string; // Or perhaps customerId/customerName depending on API
}

export async function fetchAssets(): Promise<Asset[]> {
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
    throw new Error("Could not fetch assets from the backend: " + error);
  }
} 