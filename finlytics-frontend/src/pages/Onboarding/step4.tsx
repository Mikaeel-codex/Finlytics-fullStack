// src/pages/Onboarding/Step4.tsx
import { useLocation, useNavigate } from "react-router-dom";


export default function Step4() {
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
      <h1 className="text-3xl font-semibold">Powerful Filtering Tools</h1>
      <p className="mt-2 text-sm text-brand-100">
        Once your data is loaded, you can filter transactions in multiple ways:
      </p>

      <hr className="my-6 border-brand-700/60" />

      {/* Filters list */}
      <div className="space-y-4 flex-1">
        <FilterRow
          label="Category:"
          desc="Filter by Money In, Money Out, or Other"
        />
        <FilterRow
          label="Date Range:"
          desc="Select specific date ranges"
        />
        <FilterRow
          label="Amount Range:"
          desc="Set minimum and maximum amounts"
        />

        {/* Pro tip box */}
        <div className="rounded-xl border border-brand-100/20 bg-brand-900/30 px-5 py-4 md:px-6 md:py-5">
          <p className="text-sm md:text-base font-medium text-brand-50">
            Pro Tip: Combine multiple filters for precise results!
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-brand-200">Step 4 - 6</p>
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
            onClick={() => nav("/onboarding/step-5", { state })}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-medium text-brand-900 hover:opacity-90"
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterRow({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="flex items-start gap-4 rounded-xl bg-brand-900/30 px-5 py-4 md:px-6 md:py-5">
      {/* circle bullet */}
      <div className="mt-1 h-4 w-4 rounded-full bg-amber-300" />
      <div>
        <p className="text-sm md:text-base">
          <span className="font-semibold">{label}</span> {desc}
        </p>
      </div>
    </div>
  );
}
