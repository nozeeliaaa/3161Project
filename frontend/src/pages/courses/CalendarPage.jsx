import { CalendarDays, Filter } from "lucide-react";
import { useState } from "react";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { EmptyState, ErrorState, LoadingState } from "../../components/ui/Status";
import { useAuth } from "../../context/AuthContext";
import { sampleEvents } from "../../data/demoData";
import { getStudentEvents } from "../../services/calendarService";
import { formatDate, formatTime } from "../../utils/format";
import { useApiResource } from "../../utils/useApiResource";

export default function CalendarPage() {
  const { user } = useAuth();
  const [date, setDate] = useState("");
  const { data, loading, error, usingFallback, reload } = useApiResource(() => getStudentEvents(user.user_id, date), sampleEvents, [user?.user_id, date]);

  if (loading) return <LoadingState label="Loading calendar" />;

  return (
    <div className="space-y-5">
      {usingFallback && error ? <ErrorState message={`Live calendar unavailable: ${error}. Showing sample events.`} onRetry={reload} /> : null}
      <Card>
        <CardHeader
          title="Calendar"
          description="Filter course events and deadlines by date."
          action={
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-ink-400" />
              <Input className="w-44" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </div>
          }
        />
        <CardBody className="space-y-3">
          {data.map((event) => (
            <div key={event.event_id} className="flex gap-4 rounded-lg border bg-white p-4">
              <div className="rounded-lg bg-brand-50 p-3 text-brand-700">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-bold text-ink-900">{event.event_title}</p>
                    <p className="mt-1 text-sm text-ink-500">{event.event_description}</p>
                  </div>
                  <p className="text-sm font-semibold text-brand-700">
                    {formatDate(event.event_date)} {formatTime(event.start_time)}
                  </p>
                </div>
                {event.course_code ? <p className="mt-2 text-xs font-bold text-ink-400">{event.course_code}</p> : null}
              </div>
            </div>
          ))}
          {!data.length ? <EmptyState title="No events found" description="Clear the filter or choose another date." /> : null}
        </CardBody>
      </Card>
    </div>
  );
}
