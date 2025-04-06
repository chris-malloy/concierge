import AssetTable from "@/components/assets/AssetTable";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard - Asset Overview</h1>

      <AssetTable />
    </div>
  );
} 