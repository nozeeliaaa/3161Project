import clsx from "clsx";
import { BookOpen, CalendarDays, GraduationCap, LayoutDashboard, LogOut, MessageSquare, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Courses", to: "/courses", icon: BookOpen },
  { label: "Forums", to: "/forums", icon: MessageSquare },
  { label: "Calendar", to: "/calendar", icon: CalendarDays },
  { label: "Members", to: "/members", icon: Users, roles: ["admin", "lecturer"] }
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { logout, role } = useAuth();

  const content = (
    <aside className="flex h-full w-72 flex-col border-r bg-white">
      <div className="flex h-16 items-center gap-3 border-b px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-ink-900">EduCore</p>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-500">{role || "workspace"}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems
          .filter((item) => !item.roles || item.roles.includes(role))
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
                  isActive ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
      </nav>

      <div className="border-t p-4">
        <Button variant="ghost" className="w-full justify-start" icon={LogOut} onClick={logout}>
          Sign out
        </Button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block">{content}</div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-ink-900/35" type="button" onClick={onClose} aria-label="Close sidebar" />
          <div className="relative h-full">{content}</div>
        </div>
      ) : null}
    </>
  );
}
