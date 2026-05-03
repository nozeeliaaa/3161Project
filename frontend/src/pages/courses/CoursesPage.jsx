import { Plus, Search } from "lucide-react";
import { useState } from "react";
import CourseCard from "../../components/courses/CourseCard";
import Button from "../../components/ui/Button";
import { Card, CardBody } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { EmptyState, ErrorState, SkeletonGrid } from "../../components/ui/Status";
import { useAuth } from "../../context/AuthContext";
import { sampleCourses } from "../../data/demoData";
import { getCourses } from "../../services/courseService";
import { useApiResource } from "../../utils/useApiResource";

export default function CoursesPage({ compactForums = false }) {
  const { role } = useAuth();
  const [query, setQuery] = useState("");
  const { data: courses, loading, error, usingFallback } = useApiResource(getCourses, sampleCourses, []);

  const filtered = courses.filter((course) =>
    [course.course_name, course.course_code, course.description].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {usingFallback && error ? <ErrorState message={`Live API unavailable: ${error}. Showing sample courses.`} /> : null}
      <Card>
        <CardBody className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-ink-900">{compactForums ? "Choose a course forum" : "All Courses"}</h2>
            <p className="mt-1 text-sm text-ink-500">Browse course workspaces, lecturer ownership, members, forums, and deadlines.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-ink-400" />
              <Input className="pl-9 sm:w-80" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search courses" />
            </div>
            {role === "admin" && !compactForums ? <Button icon={Plus}>New course</Button> : null}
          </div>
        </CardBody>
      </Card>

      {loading ? <SkeletonGrid count={6} /> : null}
      {!loading && filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course.course_id} course={course} />
          ))}
        </div>
      ) : null}
      {!loading && !filtered.length ? <EmptyState title="No courses found" description="Try a different search term." /> : null}
    </div>
  );
}
