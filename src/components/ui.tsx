import { label } from "@/lib/constants";

export function PageHeader({ title, action, subtitle }: { title: string; action?: React.ReactNode; subtitle?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-3xl font-black tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-[#8ea0b5]">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return (
    <div className="panel p-4">
      <div className="text-xs font-bold uppercase tracking-[0.08em] text-[#8ea0b5]">{label}</div>
      <div className="mt-3 text-3xl font-black">{value}</div>
      {detail ? <div className="mt-2 text-xs text-[#8ea0b5]">{detail}</div> : null}
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="panel p-6 text-center">
      <div className="font-bold">{title}</div>
      <div className="mx-auto mt-2 max-w-xl text-sm text-[#8ea0b5]">{body}</div>
    </div>
  );
}

export function SelectField({
  label: fieldLabel,
  name,
  value,
  onChange,
  options,
  allowAny,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  allowAny?: boolean;
}) {
  return (
    <label className="grid gap-1 text-sm font-semibold">
      {fieldLabel}
      <select className="field" name={name} value={value} onChange={(event) => onChange(event.target.value)}>
        {allowAny ? <option value="">Any</option> : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {label(option)}
          </option>
        ))}
      </select>
    </label>
  );
}
