import { Send } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ReplyTree from "../../components/forums/ReplyTree";
import Button from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Field, Textarea } from "../../components/ui/Input";
import { ErrorState, LoadingState } from "../../components/ui/Status";
import { sampleReplies, sampleThreads } from "../../data/demoData";
import { createReply, getReplies } from "../../services/forumService";
import { formatDate, fullName } from "../../utils/format";
import { useApiResource } from "../../utils/useApiResource";

export default function ThreadDetailPage() {
  const { threadId } = useParams();
  const thread = useMemo(() => sampleThreads.find((item) => String(item.thread_id) === String(threadId)) || sampleThreads[0], [threadId]);
  const { data, setData, loading, error, usingFallback } = useApiResource(() => getReplies(threadId), sampleReplies, [threadId]);
  const [text, setText] = useState("");

  const postReply = async (parentReplyId = null, replyText = text) => {
    if (!replyText.trim()) return;
    const optimistic = {
      reply_id: Date.now(),
      parent_reply_id: parentReplyId,
      reply_text: replyText,
      first_name: "You",
      last_name: "",
      created_at: new Date().toISOString()
    };

    try {
      const created = await createReply(threadId, { reply_text: replyText, parent_reply_id: parentReplyId });
      setData([...data, { ...optimistic, reply_id: created.reply_id }]);
    } catch {
      setData([...data, optimistic]);
    } finally {
      setText("");
    }
  };

  if (loading) return <LoadingState label="Loading thread" />;

  return (
    <div className="space-y-5">
      {usingFallback && error ? <ErrorState message={`Live replies unavailable: ${error}. Showing sample nested replies.`} /> : null}
      <Card>
        <CardHeader title={thread.thread_title} description={`${fullName(thread)} · ${formatDate(thread.created_at)}`} />
        <CardBody>
          <p className="text-sm leading-7 text-ink-600">{thread.starting_post}</p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Add reply" description="Start a new top-level reply to this discussion." />
        <CardBody className="space-y-3">
          <Field label="Reply">
            <Textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Share an answer, source, or follow-up question" />
          </Field>
          <Button icon={Send} onClick={() => postReply(null, text)}>
            Post reply
          </Button>
        </CardBody>
      </Card>

      <ReplyTree replies={data} onReply={postReply} />
    </div>
  );
}
