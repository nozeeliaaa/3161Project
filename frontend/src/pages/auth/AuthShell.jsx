import { GraduationCap } from "lucide-react";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_0.95fr]">
      <section className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-600 text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-ink-900">EduCore</p>
              <p className="text-sm font-medium text-ink-500">Course Management System</p>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-ink-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
      <section className="hidden bg-ink-900 p-8 text-white lg:block">
        <div className="flex h-full flex-col justify-between rounded-lg border border-white/10 bg-white/5 p-8 shadow-soft">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-100">Academic operations</p>
            <h2 className="mt-4 max-w-xl text-4xl font-extrabold leading-tight">
              A polished LMS workspace for courses, discussions, grading, and deadlines.
            </h2>
          </div>
          <div className="grid gap-4">
            {["Role-aware dashboards", "Recursive forum discussions", "Assignment submissions and grading"].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/10 p-4">
                <p className="font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
