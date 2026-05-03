export function fullName(item) {
  return [item?.first_name, item?.last_name].filter(Boolean).join(" ") || "Unassigned";
}

export function formatDate(value, fallback = "No date") {
  if (!value) return fallback;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export function formatTime(value) {
  if (!value) return "";
  return value.toString().slice(0, 5);
}

export function initials(name = "User") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function percentage(value, max) {
  if (value === null || value === undefined || !max) return null;
  return Math.round((Number(value) / Number(max)) * 100);
}
