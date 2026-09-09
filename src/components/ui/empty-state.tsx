import { PackageX } from "lucide-react";

export function EmptyState() {
  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-2 py-12 text-center">
      <PackageX className="h-10 w-10 text-text-secondary" />
      <p className="font-medium text-text-primary">No items found</p>
      <p className="text-sm text-text-secondary">Try a different search or category.</p>
    </div>
  );
}