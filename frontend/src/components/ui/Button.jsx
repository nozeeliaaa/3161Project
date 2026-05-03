import clsx from "clsx";

const variants = {
  primary: "bg-brand-600 text-white shadow-sm hover:bg-brand-700",
  secondary: "border bg-white text-ink-700 hover:bg-ink-50",
  ghost: "text-ink-600 hover:bg-ink-100",
  danger: "bg-red-600 text-white hover:bg-red-700"
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base"
};

export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  icon: Icon,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={clsx(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
