interface Props {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function SectionHeading({ title, subtitle, action }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
      <div className="min-w-0 flex-1">
        <h2 className="font-[Manrope] text-[22px] sm:text-2xl md:text-3xl font-semibold tracking-tight break-words leading-tight">{title}</h2>
        {subtitle && <p className="mt-2 text-[13px] sm:text-sm text-neutral-600 break-words leading-5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 w-full sm:w-auto">{action}</div>}
    </div>
  );
}

