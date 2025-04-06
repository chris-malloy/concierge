import { fetchAssets, type Asset } from "@/api/assets";
import AssetTable from "@/components/assets/AssetTable";

export default async function DashboardPage() {
  let assets: Asset[] = [];
  let error: string | null = null;
  let isLoading = true;

  try {
    assets = await fetchAssets();
    error = null;
  } catch (e: unknown) {
    if (e instanceof Error) {
      error = e.message;
    } else {
      error = "An unknown error occurred while fetching assets.";
    }
    assets = [];
  } finally {
    isLoading = false;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard - Asset Overview</h1>

      <AssetTable assets={assets} error={error} isLoading={isLoading} />
    </div>
  );
} 