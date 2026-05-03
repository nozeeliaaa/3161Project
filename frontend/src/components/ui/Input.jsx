import clsx from "clsx";

export function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-700">{label}</span>
      {children}
      {error ? <span className="mt-1.5 block text-sm text-red-600">{error}</span> : null}
    </label>
  );
}

export function Input({ className, ...props }) {
  return (
    <input
      className={clsx(
        "focus-ring h-11 w-full rounded-lg border bg-white px-3 text-sm text-ink-900 placeholder:text-ink-400",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      className={clsx(
        "focus-ring w-full resize-y rounded-lg border bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }) {
  return (
    <select
      className={clsx("focus-ring h-11 w-full rounded-lg border bg-white px-3 text-sm text-ink-900", className)}
      {...props}
    >
      {children}
    </select>
  );
}
