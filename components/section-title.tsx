import { Badge } from "@/components/badge";

type SectionTitleProps = {
  eyebrow: string;
  title: string;
  body: string;
  tag?: string;
};

export function SectionTitle({ eyebrow, title, body, tag }: SectionTitleProps) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs uppercase tracking-signal text-slate-400">{eyebrow}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h2 className="display-face text-4xl text-stone md:text-5xl">{title}</h2>
        {tag ? <Badge tone="accent">{tag}</Badge> : null}
      </div>
      <p className="mt-5 text-base leading-7 text-slate-300 md:text-lg">{body}</p>
    </div>
  );
}
