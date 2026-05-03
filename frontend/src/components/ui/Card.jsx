import clsx from "clsx";

export function Card({ children, className }) {
  return <section className={clsx("rounded-lg border bg-white shadow-card", className)}>{children}</section>;
}

export function CardHeader({ title, description, action, className }) {
  return (
    <div className={clsx("flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div>
        <h2 className="text-base font-semibold text-ink-900">{title}</h2>
        {description ? <p className="mt-1 text-sm text-ink-500">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function CardBody({ children, className }) {
  return <div className={clsx("p-5", className)}>{children}</div>;
}
