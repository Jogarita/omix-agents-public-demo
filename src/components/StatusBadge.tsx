"use client";

interface StatusBadgeProps {
  status: "pass" | "fail" | "warning";
  label?: string;
}

const styles = {
  pass: "bg-emerald-50 text-emerald-600 border-emerald-200",
  fail: "bg-red-50 text-red-500 border-red-200",
  warning: "bg-amber-50 text-amber-600 border-amber-200",
};

const defaultLabels = {
  pass: "Pass",
  fail: "Fail",
  warning: "Warning",
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${styles[status]}`}
    >
      {label || defaultLabels[status]}
    </span>
  );
}
