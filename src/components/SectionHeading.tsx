interface SectionHeadingProps {
  title: string;
  description?: string;
  accent?: "green" | "amber" | "gray";
}

export function SectionHeading({ title, description, accent = "green" }: SectionHeadingProps) {
  return (
    <div className={`section-heading section-heading--${accent}`}>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
