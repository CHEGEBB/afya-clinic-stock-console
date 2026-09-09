import { AuthGuard } from "@/components/auth-guard";

export default function StockPage() {
  return (
    <AuthGuard>
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-text-primary">
          Stock List
        </h1>
        <p className="mt-2 text-text-secondary">Coming next.</p>
      </div>
    </AuthGuard>
  );
}