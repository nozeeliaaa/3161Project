import { X } from "lucide-react";
import Button from "./Button";

export default function Modal({ open, title, description, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-lg border bg-white shadow-soft">
        <div className="flex items-start justify-between border-b px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-ink-900">{title}</h2>
            {description ? <p className="mt-1 text-sm text-ink-500">{description}</p> : null}
          </div>
          <Button variant="ghost" size="sm" icon={X} onClick={onClose} aria-label="Close modal" />
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
