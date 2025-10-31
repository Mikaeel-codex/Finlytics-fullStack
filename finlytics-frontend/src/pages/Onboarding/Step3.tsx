// src/pages/Onboarding/Step3.tsx
import { useLocation, useNavigate } from "react-router-dom";


export default function Step3() {
  const nav = useNavigate();
  const { state } = useLocation();

  return (
    <div
      className="
        rounded-2xl bg-brand-800/70 shadow-lg ring-1 ring-white/10
        px-6 py-6 flex flex-col
        min-h-[520px] md:min-h-[600px] lg:min-h-[660px]
      "
    >
      {/* Heading */}
      <h1 className="text-3xl font-semibold">Understanding Categories</h1>
      <p className="mt-2 text-sm text-brand-100">
        Finlytics automatically categorizes your transactions into three types:
      </p>

      <hr className="my-6 border-brand-700/60" />

      {/* Category cards */}
      <div className="space-y-5 flex-1">
        <CategoryCard
          tone="green"
          title="Money In"
          subtitle="Positive amounts like salary, refunds, and deposits"
          example="Example: R 15,000.00 (Salary)"
        />
        <CategoryCard
          tone="red"
          title="Money Out"
          subtitle="Negative amounts like payments, purchases, and withdrawals"
          example="Example: R -1,200.00 (Groceries)"
        />
        <CategoryCard
          tone="amber"
          title="Other"
          subtitle="Special transactions like bank fees and interest"
          example="Example: R -50.00 (Bank Fees)"
        />
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-brand-200">Step 3 - 6</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => nav(-1)}
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-brand-900/40 px-4 py-2 font-medium text-white hover:bg-brand-900/60"
          >
            ‹ Back
          </button>
          <button
            type="button"
            onClick={() => nav("/onboarding/step-4", { state })}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-medium text-brand-900 hover:opacity-90"
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({
  tone,
  title,
  subtitle,
  example,
}: {
  tone: "green" | "red" | "amber";
  title: string;
  subtitle: string;
  example: string;
}) {
  const toneMap: Record<typeof tone, string> = {
    green: "bg-emerald-900/40 border-emerald-400/60",
    red: "bg-red-900/30 border-red-400/60",
    amber: "bg-amber-900/30 border-amber-400/80",
  };

  const icon = (() => {
    if (tone === "green") {
      return (
        <svg
          className="h-6 w-6 text-emerald-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <path d="M5 12 9.5 7.5 13 11l4.5-4.5" />
          <path d="M19 5h-4" />
        </svg>
      );
    }
    if (tone === "red") {
      return (
        <svg
          className="h-6 w-6 text-red-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <path d="M5 16 10 11 14 15 19 10" />
          <path d="M19 14v-4h-4" />
        </svg>
      );
    }
    return (
      <svg
        className="h-6 w-6 text-amber-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path d="M12 17v.01" />
        <path d="M12 10v3" />
        <circle cx="12" cy="6" r="1" />
        <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  })();

  return (
    <div
      className={`rounded-xl border px-6 py-5 md:py-6 md:px-7 flex gap-4 ${toneMap[tone]}`}
    >
      <div className="mt-1">{icon}</div>
      <div className="flex-1">
        <div className="text-lg font-semibold text-white">{title}</div>
        <div className="mt-1 text-sm text-brand-50/80">{subtitle}</div>
        <div className="mt-3 text-sm font-medium text-emerald-200/90">
          {example}
        </div>
      </div>
    </div>
  );
}
