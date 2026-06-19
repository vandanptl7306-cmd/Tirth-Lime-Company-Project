import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, description, align = "center" }: Props) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${alignCls}`}>
      {eyebrow && (
        <div
          className={`inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
          {eyebrow}
        </div>
      )}
      <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">{description}</p>
      )}
      <div
        className={`mt-5 h-1 w-16 rounded-full bg-brand-gold ${align === "center" ? "mx-auto" : ""}`}
      />
    </div>
  );
}
