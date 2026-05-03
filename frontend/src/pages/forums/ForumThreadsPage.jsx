import { MessageSquare, Plus } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Field, Input, Textarea } from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import { ErrorState, LoadingState } from "../../components/ui/Status";
import { sampleThreads } from "../../data/demoData";
import { createThread, getThreads } from "../../services/forumService";
import { formatDate, fullName } from "../../utils/format";
import { useApiResource } from "../../utils/useApiResource";

export default function ForumThreadsPage() {
  const { forumId } = useParams();
  const { data, setData, loading, error, usingFallback } = useApiResource(() => getThreads(forumId), sampleThreads, [forumId]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ thread_title: "", starting_post: "" });

  const submit = async () => {
    if (!form.thread_title.trim() || !form.starting_post.trim()) return;
    const optimistic = {
      ...form,
      thread_id: Date.now(),
      first_name: "You",
      last_name: "",
      created_at: new Date().toISOString()
    };

    try {
      const created = await createThread(forumId, form);
      setData([{ ...optimistic, thread_id: created.thread_id }, ...data]);
    } catch {
      setData([optimistic, ...data]);
    } finally {
      setForm({ thread_title: "", starting_post: "" });
      setOpen(false);
    }
  };

  if (loading) return <LoadingState label="Loading threads" />;

  return (
    <div className="space-y-5">
      {usingFallback && error ? <ErrorState message={`Live threads unavailable: ${error}. Showing sample discussion threads.`} /> : null}
      <Card>
        <CardHeader title="Forum Threads" description="Reddit-style course conversations with nested replies." action={<Button icon={Plus} onClick={() => setOpen(true)}>New thread</Button>} />
        <CardBody className="space-y-3">
          {data.map((thread) => (
            <Link key={thread.thread_id} to={`/threads/${thread.thread_id}`} className="block rounded-lg border p-4 transition hover:bg-ink-50">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-brand-50 p-2 text-brand-700">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-ink-900">{thread.thread_title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-ink-500">{thread.starting_post}</p>
                  <p className="mt-2 text-xs font-semibold text-ink-400">
                    {fullName(thread)} · {formatDate(thread.created_at)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </CardBody>
      </Card>
      <Modal open={open} title="Create thread" onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <Field label="Title">
            <Input value={form.thread_title} onChange={(event) => setForm((current) => ({ ...current, thread_title: event.target.value }))} />
          </Field>
          <Field label="Starting post">
            <Textarea value={form.starting_post} onChange={(event) => setForm((current) => ({ ...current, starting_post: event.target.value }))} />
          </Field>
          <Button onClick={submit}>Post thread</Button>
        </div>
      </Modal>
    </div>
  );
}
