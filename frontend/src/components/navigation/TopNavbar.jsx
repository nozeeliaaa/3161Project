import { Bell, Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../utils/format";
import Button from "../ui/Button";

const titles = {
  "/dashboard": "Dashboard",
  "/courses": "Courses",
  "/forums": "Forums",
  "/calendar": "Calendar",
  "/members": "Members"
};

export default function TopNavbar({ onMenu }) {
  const { user, role } = useAuth();
  const { pathname } = useLocation();
  const title = titles[pathname] || (pathname.includes("/courses/") ? "Course Workspace" : "Workspace");
  const displayName = user?.username || "Account";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/90 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" icon={Menu} onClick={onMenu} className="lg:hidden" aria-label="Open navigation" />
        <div>
          <h1 className="text-lg font-bold text-ink-900">{title}</h1>
          <p className="hidden text-xs font-medium text-ink-500 sm:block">Course operations, conversations, and deadlines</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden h-10 w-72 items-center gap-2 rounded-lg border bg-ink-50 px-3 lg:flex">
          <Search className="h-4 w-4 text-ink-400" />
          <span className="text-sm text-ink-400">Search courses, forums, people</span>
        </div>
        <Button variant="ghost" size="sm" icon={Bell} aria-label="Notifications" />
        <div className="flex items-center gap-3 rounded-lg border bg-white px-2 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-xs font-bold text-white">
            {initials(displayName)}
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold text-ink-900">{displayName}</p>
            <p className="text-xs capitalize text-ink-500">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
