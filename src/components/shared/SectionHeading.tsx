interface Props {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function SectionHeading({ title, subtitle, action }: Props) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="font-[Manrope] text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-neutral-600">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

