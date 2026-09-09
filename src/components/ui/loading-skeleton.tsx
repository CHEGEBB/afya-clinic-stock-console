export function LoadingSkeleton() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg border border-border bg-surface p-4">
          <div className="h-32 w-full rounded bg-border" />
          <div className="mt-3 h-4 w-3/4 rounded bg-border" />
          <div className="mt-2 h-3 w-1/2 rounded bg-border" />
        </div>
      ))}
    </div>
  );
}
