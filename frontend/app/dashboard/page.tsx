// This page should be automatically protected by Clerk middleware

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to your dashboard! This page is only visible when you are logged in.</p>
      {/* Add actual dashboard content here */}
    </div>
  );
} 