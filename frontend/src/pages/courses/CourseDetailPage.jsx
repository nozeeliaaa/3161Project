import clsx from "clsx";
import { CalendarDays, FileText, Link as LinkIcon, MessageSquare, Plus, Presentation, Upload, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Field, Input, Textarea } from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/Status";
import Table from "../../components/ui/Table";
import { useAuth } from "../../context/AuthContext";
import { sampleAssignments, sampleCourses, sampleEvents, sampleForums, sampleSections } from "../../data/demoData";
import { getAssignments, getSubmissions, gradeSubmission, submitAssignment } from "../../services/assignmentService";
import { getCourseEvents } from "../../services/calendarService";
import { getCourseContent } from "../../services/contentService";
import { getCourseMembers } from "../../services/courseService";
import { createForum, getForums } from "../../services/forumService";
import { formatDate, formatTime, fullName } from "../../utils/format";
import { useApiResource } from "../../utils/useApiResource";

const tabs = [
  { key: "content", label: "Content", icon: FileText },
  { key: "assignments", label: "Assignments", icon: Upload },
  { key: "forums", label: "Forums", icon: MessageSquare },
  { key: "members", label: "Members", icon: Users },
  { key: "calendar", label: "Calendar", icon: CalendarDays }
];

const itemIcons = {
  link: LinkIcon,
  file: FileText,
  slide: Presentation
};

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("content");
  const course = useMemo(() => sampleCourses.find((item) => String(item.course_id) === String(courseId)) || sampleCourses[0], [courseId]);

  return (
    <div className="space-y-6">
      <Card>
        <CardBody>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">{course.course_code}</span>
                <span className="rounded-full bg-mint-50 px-3 py-1 text-xs font-bold text-mint-700">Active</span>
              </div>
              <h2 className="mt-3 text-2xl font-extrabold text-ink-900">{course.course_name}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-500">{course.description}</p>
            </div>
            <div className="rounded-lg border bg-ink-50 px-4 py-3 text-sm">
              <p className="font-semibold text-ink-900">Lecturer</p>
              <p className="text-ink-500">{fullName(course)}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="overflow-x-auto border-b">
        <div className="flex min-w-max gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition",
                activeTab === tab.key ? "border-brand-600 text-brand-700" : "border-transparent text-ink-500 hover:text-ink-900"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "content" ? <ContentTab courseId={courseId} /> : null}
      {activeTab === "assignments" ? <AssignmentsTab courseId={courseId} /> : null}
      {activeTab === "forums" ? <ForumsTab courseId={courseId} /> : null}
      {activeTab === "members" ? <MembersTab courseId={courseId} /> : null}
      {activeTab === "calendar" ? <CalendarTab courseId={courseId} /> : null}
    </div>
  );
}

function ContentTab({ courseId }) {
  const { data, loading, error, usingFallback } = useApiResource(() => getCourseContent(courseId), sampleSections, [courseId]);

  if (loading) return <LoadingState label="Loading course content" />;

  return (
    <div className="space-y-4">
      {usingFallback && error ? <ErrorState message={`Live content unavailable: ${error}. Showing sample sections.`} /> : null}
      {data.map((section) => (
        <Card key={section.section_id}>
          <CardHeader title={section.section_title} description={`Section ${section.section_order}`} />
          <CardBody className="space-y-3">
            {section.items?.length ? (
              section.items.map((item) => {
                const Icon = itemIcons[item.item_type] || FileText;
                return (
                  <a key={item.item_id} href={item.item_url || "#"} className="flex items-center justify-between rounded-lg border p-3 hover:bg-ink-50">
                    <span className="flex items-center gap-3">
                      <span className="rounded-lg bg-brand-50 p-2 text-brand-700">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-ink-900">{item.item_title}</span>
                        <span className="block text-xs capitalize text-ink-500">{item.item_type}</span>
                      </span>
                    </span>
                  </a>
                );
              })
            ) : (
              <EmptyState title="No items in this section" />
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

function AssignmentsTab({ courseId }) {
  const { role } = useAuth();
  const { data, loading, error, usingFallback } = useApiResource(() => getAssignments(courseId), sampleAssignments, [courseId]);
  const [submission, setSubmission] = useState({ assignmentId: null, text: "" });
  const [grading, setGrading] = useState({ assignment: null, submissions: [], loading: false, error: "" });
  const [message, setMessage] = useState("");

  const submit = async () => {
    if (!submission.text.trim()) return;
    try {
      await submitAssignment(submission.assignmentId, { submission_text: submission.text });
      setMessage("Submission uploaded successfully.");
      setSubmission({ assignmentId: null, text: "" });
    } catch (err) {
      setMessage(err.message);
    }
  };

  const openGrading = async (assignment) => {
    setGrading({ assignment, submissions: [], loading: true, error: "" });
    try {
      const rows = await getSubmissions(assignment.assignment_id);
      setGrading({ assignment, submissions: rows, loading: false, error: "" });
    } catch (err) {
      setGrading({
        assignment,
        loading: false,
        error: err.message,
        submissions: [
          {
            submission_id: 901,
            first_name: "Talia",
            last_name: "Brown",
            email: "talia.brown@school.edu",
            submission_text: "Submitted ERD, schema, and reflection notes.",
            submitted_at: "2026-04-28 14:30:00",
            grade: null
          },
          {
            submission_id: 902,
            first_name: "Noah",
            last_name: "Singh",
            email: "noah.singh@school.edu",
            submission_text: "Included SQL scripts and diagram export.",
            submitted_at: "2026-04-29 09:10:00",
            grade: 88
          }
        ]
      });
    }
  };

  const updateGrade = (submissionId, grade) => {
    setGrading((current) => ({
      ...current,
      submissions: current.submissions.map((row) => (row.submission_id === submissionId ? { ...row, grade } : row))
    }));
  };

  const saveGrade = async (submissionId, grade) => {
    try {
      await gradeSubmission(submissionId, { grade: Number(grade) });
      setMessage("Grade saved successfully.");
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <LoadingState label="Loading assignments" />;

  return (
    <div className="space-y-4">
      {usingFallback && error ? <ErrorState message={`Live assignments unavailable: ${error}. Showing sample assignments.`} /> : null}
      {message ? <div className="rounded-lg border bg-white px-4 py-3 text-sm font-semibold text-ink-700">{message}</div> : null}
      {data.map((assignment) => (
        <Card key={assignment.assignment_id}>
          <CardBody className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-brand-700">Due {formatDate(assignment.due_date)}</p>
              <h3 className="mt-1 text-lg font-bold text-ink-900">{assignment.assignment_title}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-500">{assignment.description}</p>
              <p className="mt-3 text-sm font-semibold text-ink-700">Max grade: {assignment.max_grade}</p>
            </div>
            {role === "student" ? (
              <Button icon={Upload} onClick={() => setSubmission({ assignmentId: assignment.assignment_id, text: "" })}>
                Submit
              </Button>
            ) : role === "lecturer" ? (
              <Button variant="secondary" onClick={() => openGrading(assignment)}>
                Grade submissions
              </Button>
            ) : null}
          </CardBody>
        </Card>
      ))}
      <Modal open={Boolean(submission.assignmentId)} title="Submit assignment" onClose={() => setSubmission({ assignmentId: null, text: "" })}>
        <div className="space-y-4">
          <Field label="Submission text">
            <Textarea value={submission.text} onChange={(event) => setSubmission((current) => ({ ...current, text: event.target.value }))} />
          </Field>
          <Button onClick={submit}>Upload submission</Button>
        </div>
      </Modal>
      <Modal open={Boolean(grading.assignment)} title="Grade submissions" description={grading.assignment?.assignment_title} onClose={() => setGrading({ assignment: null, submissions: [], loading: false, error: "" })}>
        {grading.loading ? (
          <LoadingState label="Loading submissions" />
        ) : (
          <div className="space-y-3">
            {grading.error ? <ErrorState message={`Live submissions unavailable: ${grading.error}. Showing sample submissions.`} /> : null}
            {grading.submissions.map((row) => (
              <div key={row.submission_id} className="rounded-lg border p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-ink-900">{fullName(row)}</p>
                    <p className="text-xs text-ink-500">{row.email} · {formatDate(row.submitted_at)}</p>
                    <p className="mt-2 text-sm leading-6 text-ink-600">{row.submission_text || "No submission text."}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input className="w-24" type="number" min="0" max={grading.assignment?.max_grade || 100} value={row.grade ?? ""} onChange={(event) => updateGrade(row.submission_id, event.target.value)} placeholder="Grade" />
                    <Button size="sm" onClick={() => saveGrade(row.submission_id, row.grade)}>
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {!grading.submissions.length ? <EmptyState title="No submissions yet" /> : null}
          </div>
        )}
      </Modal>
    </div>
  );
}

function ForumsTab({ courseId }) {
  const { role } = useAuth();
  const { data, setData, loading, error, usingFallback } = useApiResource(() => getForums(courseId), sampleForums, [courseId]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const submit = async () => {
    if (!title.trim()) return;
    try {
      const created = await createForum(courseId, { forum_title: title });
      setData([{ forum_id: created.forum_id, forum_title: title, created_at: new Date().toISOString() }, ...data]);
      setOpen(false);
      setTitle("");
    } catch {
      setData([{ forum_id: Date.now(), forum_title: title, created_at: new Date().toISOString() }, ...data]);
      setOpen(false);
      setTitle("");
    }
  };

  if (loading) return <LoadingState label="Loading forums" />;

  return (
    <Card>
      <CardHeader
        title="Discussion Forums"
        description="Course-level spaces for announcements, help, and peer conversations."
        action={role !== "student" ? <Button icon={Plus} onClick={() => setOpen(true)}>New forum</Button> : null}
      />
      <CardBody className="space-y-3">
        {usingFallback && error ? <ErrorState message={`Live forums unavailable: ${error}. Showing sample forums.`} /> : null}
        {data.map((forum) => (
          <Link key={forum.forum_id} to={`/forums/${forum.forum_id}/threads`} className="flex items-center justify-between rounded-lg border p-4 hover:bg-ink-50">
            <span>
              <span className="block text-sm font-bold text-ink-900">{forum.forum_title}</span>
              <span className="block text-xs text-ink-500">Created {formatDate(forum.created_at)}</span>
            </span>
            <MessageSquare className="h-5 w-5 text-brand-600" />
          </Link>
        ))}
      </CardBody>
      <Modal open={open} title="Create forum" onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <Field label="Forum title">
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Assignment 2 support" />
          </Field>
          <Button onClick={submit}>Create forum</Button>
        </div>
      </Modal>
    </Card>
  );
}

function MembersTab({ courseId }) {
  const { data, loading, error, usingFallback } = useApiResource(() => getCourseMembers(courseId), [], [courseId]);

  if (loading) return <LoadingState label="Loading members" />;
  if (!data.length && !usingFallback) return <EmptyState title="No members found" />;

  const rows = data.length
    ? data
    : [
        { first_name: "Maya", last_name: "Chen", email: "maya.chen@school.edu", member_role: "lecturer", department: "Computer Science" },
        { first_name: "Talia", last_name: "Brown", email: "talia.brown@school.edu", member_role: "student", major: "Computer Science" }
      ];

  return (
    <div className="space-y-4">
      {usingFallback && error ? <ErrorState message={`Live members unavailable: ${error}. Showing sample members.`} /> : null}
      <Table
        rows={rows}
        columns={[
          { key: "name", header: "Name", render: fullName },
          { key: "email", header: "Email" },
          { key: "member_role", header: "Role", render: (row) => <span className="capitalize">{row.member_role}</span> },
          { key: "profile", header: "Profile", render: (row) => row.major || row.department || "General" }
        ]}
      />
    </div>
  );
}

function CalendarTab({ courseId }) {
  const [date, setDate] = useState("");
  const { data, loading, error, usingFallback } = useApiResource(() => getCourseEvents(courseId), sampleEvents, [courseId]);
  const filtered = date ? data.filter((event) => event.event_date === date) : data;

  if (loading) return <LoadingState label="Loading calendar" />;

  return (
    <Card>
      <CardHeader
        title="Course Calendar"
        description="Simple date filtering for course events."
        action={<Input className="w-44" type="date" value={date} onChange={(event) => setDate(event.target.value)} />}
      />
      <CardBody className="space-y-3">
        {usingFallback && error ? <ErrorState message={`Live events unavailable: ${error}. Showing sample events.`} /> : null}
        {filtered.map((event) => (
          <div key={event.event_id} className="rounded-lg border p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-bold text-ink-900">{event.event_title}</p>
                <p className="mt-1 text-sm text-ink-500">{event.event_description}</p>
              </div>
              <p className="text-sm font-semibold text-brand-700">
                {formatDate(event.event_date)} {formatTime(event.start_time)}
              </p>
            </div>
          </div>
        ))}
        {!filtered.length ? <EmptyState title="No events for this date" /> : null}
      </CardBody>
    </Card>
  );
}
