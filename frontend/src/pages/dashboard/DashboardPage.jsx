import { ArrowRight, BarChart3, CalendarClock, MessageSquare, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import CourseCard from "../../components/courses/CourseCard";
import Button from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { ErrorState, SkeletonGrid } from "../../components/ui/Status";
import { useAuth } from "../../context/AuthContext";
import { demoStats, sampleCourses, sampleEvents, sampleThreads } from "../../data/demoData";
import { getCourses, getLecturerCourses, getStudentCourses } from "../../services/courseService";
import { formatDate } from "../../utils/format";
import { useApiResource } from "../../utils/useApiResource";

export default function DashboardPage() {
  const { role, user } = useAuth();
  const courseLoader =
    role === "student"
      ? () => getStudentCourses(user.user_id)
      : role === "lecturer"
        ? () => getLecturerCourses(user.user_id)
        : getCourses;

  const { data: courses, loading, error, usingFallback } = useApiResource(courseLoader, sampleCourses, [role, user?.user_id]);
  const stats = demoStats[role] || demoStats.student;

  return (
    <div className="space-y-6">
      {usingFallback && error ? (
        <ErrorState message={`Live API unavailable: ${error}. Showing polished sample data so the workspace remains reviewable.`} />
      ) : null}

      <section className="grid gap-4 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={stat.label}>
            <CardBody>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-ink-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-extrabold text-ink-900">{stat.value}</p>
                  <p className="mt-1 text-sm text-ink-500">{stat.trend}</p>
                </div>
                <div className={index === 1 ? "rounded-lg bg-mint-50 p-3 text-mint-700" : "rounded-lg bg-brand-50 p-3 text-brand-700"}>
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader
            title={role === "student" ? "Enrolled Courses" : role === "lecturer" ? "Courses Teaching" : "Course Portfolio"}
            description="High-signal course cards with lecturer ownership and enrollment visibility."
            action={
              role === "admin" ? (
                <Button icon={Plus} size="sm">
                  New course
                </Button>
              ) : null
            }
          />
          <CardBody>
            {loading ? (
              <SkeletonGrid count={3} />
            ) : (
              <div className="grid gap-4 lg:grid-cols-3">
                {courses.slice(0, 3).map((course) => (
                  <CourseCard key={course.course_id} course={course} />
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Upcoming" description="Deadlines and course events" />
            <CardBody className="space-y-3">
              {sampleEvents.map((event) => (
                <div key={event.event_id} className="flex gap-3 rounded-lg border p-3">
                  <div className="rounded-lg bg-amber-50 p-2 text-amber-700">
                    <CalendarClock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{event.event_title}</p>
                    <p className="text-xs text-ink-500">{formatDate(event.event_date)}</p>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Forum Pulse" description="Recent student conversations" />
            <CardBody className="space-y-3">
              {sampleThreads.map((thread) => (
                <Link key={thread.thread_id} to={`/threads/${thread.thread_id}`} className="group block rounded-lg border p-3 hover:bg-ink-50">
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                    <MessageSquare className="h-4 w-4 text-brand-600" />
                    {thread.thread_title}
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-brand-700">
                    View thread <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
