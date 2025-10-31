// src/pages/Onboarding/Step5.tsx
import { useLocation, useNavigate } from "react-router-dom";

type NavState = { fullName?: string; role?: string; email?: string };

export default function Step5() {
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
      <h1 className="text-3xl font-semibold">Export Your Data</h1>
      <p className="mt-2 text-sm text-brand-100">
        Share and integrate your organized financial data anywhere:
      </p>

      <hr className="my-6 border-brand-700/60" />

      {/* Export options */}
      <div className="space-y-5 flex-1">
        <ExportBox
          tone="green"
          title="CSV Export"
          desc="Perfect for Excel and spreadsheet applications"
        />      

        {/* info box */}
        <div className="rounded-xl border border-amber-400/70 bg-brand-900/20 px-5 py-4 md:px-6 md:py-5">
          <p className="text-sm text-brand-50">
            Your exports will include all filtered transactions with:
          </p>
          <ul className="mt-3 ml-5 list-disc space-y-1 text-sm text-brand-50/90">
            <li>Date</li>
            <li>Description</li>
            <li>Amount</li>
            <li>Category</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-brand-200">Step 5 - 6</p>
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
            onClick={() => nav("/onboarding/step-6", { state })}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-medium text-brand-900 hover:opacity-90"
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  );
}

function ExportBox({
  tone,
  title,
  desc,
}: {
  tone: "green" | "purple";
  title: string;
  desc: string;
}) {
  const toneMap: Record<typeof tone, string> = {
    green: "bg-emerald-700/25",
    purple: "bg-fuchsia-700/25",
  };

  const icon =
    tone === "green" ? (
      <div className="grid h-10 w-10 place-items-center rounded-md bg-emerald-400 text-brand-900">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.7"
          fill="none"
        >
          <path d="M12 3v14" />
          <path d="m6 11 6 6 6-6" />
          <path d="M5 21h14" />
        </svg>
      </div>
    ) : (
      <div className="grid h-10 w-10 place-items-center rounded-md bg-fuchsia-400 text-brand-900">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.7"
          fill="none"
        >
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 9h6v6H9z" />
        </svg>
      </div>
    );

  return (
    <div className="flex items-center gap-4 rounded-xl bg-brand-900/30 px-5 py-4 md:px-6 md:py-5 border border-white/5">
      {icon}
      <div>
        <div className="text-base md:text-lg font-semibold text-white">
          {title}
        </div>
        <div className="text-sm text-brand-100">{desc}</div>
      </div>
    </div>
  );
}
