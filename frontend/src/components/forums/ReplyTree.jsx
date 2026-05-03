import { MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import Button from "../ui/Button";
import { Textarea } from "../ui/Input";
import { formatDate, fullName } from "../../utils/format";

function buildTree(replies) {
  const byParent = new Map();
  replies.forEach((reply) => {
    const parent = reply.parent_reply_id || "root";
    byParent.set(parent, [...(byParent.get(parent) || []), reply]);
  });

  const attach = (parentId) =>
    (byParent.get(parentId) || []).map((reply) => ({
      ...reply,
      children: attach(reply.reply_id)
    }));

  return attach("root");
}

function ReplyNode({ reply, depth, onReply }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onReply(reply.reply_id, text);
    setText("");
    setOpen(false);
  };

  return (
    <div className="relative">
      <div className="rounded-lg border bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink-900">{fullName(reply)}</p>
          <span className="text-xs text-ink-400">{formatDate(reply.created_at)}</span>
        </div>
        <p className="mt-2 text-sm leading-6 text-ink-600">{reply.reply_text}</p>
        <Button variant="ghost" size="sm" icon={MessageCircle} className="mt-3" onClick={() => setOpen((value) => !value)}>
          Reply
        </Button>
        {open ? (
          <div className="mt-3 space-y-2">
            <Textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Add a thoughtful reply" rows={3} />
            <Button size="sm" onClick={submit}>
              Post reply
            </Button>
          </div>
        ) : null}
      </div>
      {reply.children?.length ? (
        <div className="ml-4 mt-3 space-y-3 border-l pl-4 sm:ml-6 sm:pl-5">
          {reply.children.map((child) => (
            <ReplyNode key={child.reply_id} reply={child} depth={depth + 1} onReply={onReply} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function ReplyTree({ replies, onReply }) {
  const tree = useMemo(() => buildTree(replies), [replies]);

  if (!tree.length) {
    return <p className="rounded-lg border border-dashed bg-white p-6 text-center text-sm text-ink-500">No replies yet.</p>;
  }

  return (
    <div className="space-y-3">
      {tree.map((reply) => (
        <ReplyNode key={reply.reply_id} reply={reply} depth={0} onReply={onReply} />
      ))}
    </div>
  );
}
