import { ArrowRight, BookOpen, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { fullName } from "../../utils/format";

export default function CourseCard({ course }) {
  return (
    <Link
      to={`/courses/${course.course_id}`}
      className="group block rounded-lg border bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <BookOpen className="h-5 w-5" />
        </div>
        <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-bold text-ink-600">{course.course_code}</span>
      </div>
      <h3 className="mt-5 line-clamp-2 text-lg font-bold text-ink-900">{course.course_name}</h3>
      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-ink-500">{course.description || "No course description provided."}</p>
      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Lecturer</p>
          <p className="text-sm font-semibold text-ink-700">{fullName(course)}</p>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-semibold text-ink-500">
          <Users className="h-4 w-4" />
          {course.student_count ?? course.number_of_students ?? "0"}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm font-bold text-brand-700">
        Open course
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
