export function ItemDetailSkeleton() {
  return (
    <div className="mt-6 animate-pulse rounded-lg border border-border bg-surface p-6">
      <div className="h-6 w-2/3 rounded bg-border" />
      <div className="mt-2 h-4 w-1/3 rounded bg-border" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-border" />
        <div className="h-3 w-5/6 rounded bg-border" />
        <div className="h-3 w-3/4 rounded bg-border" />
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <div>
          <div className="h-3 w-20 rounded bg-border" />
          <div className="mt-2 h-7 w-12 rounded bg-border" />
        </div>
        <div className="h-9 w-20 rounded bg-border" />
      </div>
    </div>
  );
}
