import { AlertCircle, Inbox, Loader2 } from "lucide-react";

export function LoadingState({ label = "Loading workspace" }) {
  return (
    <div className="flex min-h-44 items-center justify-center rounded-lg border bg-white">
      <div className="flex items-center gap-3 text-sm font-medium text-ink-500">
        <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
        {label}
      </div>
    </div>
  );
}

export function EmptyState({ title = "Nothing here yet", description, action }) {
  return (
    <div className="rounded-lg border border-dashed bg-white px-6 py-10 text-center">
      <Inbox className="mx-auto h-9 w-9 text-ink-300" />
      <h3 className="mt-3 text-sm font-semibold text-ink-900">{title}</h3>
      {description ? <p className="mx-auto mt-1 max-w-md text-sm text-ink-500">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message = "We could not load this view.", onRetry }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-red-800">
      <div className="flex gap-3">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">{message}</p>
          {onRetry ? (
            <button className="mt-2 text-sm font-semibold underline" type="button" onClick={onRetry}>
              Try again
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 3 }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-lg border bg-white p-5 shadow-card">
          <div className="h-4 w-24 animate-pulse rounded bg-ink-100" />
          <div className="mt-4 h-6 w-3/4 animate-pulse rounded bg-ink-100" />
          <div className="mt-3 h-4 w-full animate-pulse rounded bg-ink-100" />
          <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-ink-100" />
        </div>
      ))}
    </div>
  );
}
