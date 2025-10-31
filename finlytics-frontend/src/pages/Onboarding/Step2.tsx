// src/pages/Onboarding/Step2.tsx
import { useLocation, useNavigate } from "react-router-dom";

type NavState = { fullName?: string; role?: string; email?: string };

export default function Step2() {
  const nav = useNavigate();
  const { state } = useLocation();
  const { fullName } = (state as NavState) || {};
  const name = (fullName || "there").split(" ")[0];

  return (
  <div
    className="
      rounded-2xl bg-brand-800/70 shadow-lg ring-1 ring-white/10
      px-6 py-6
      flex flex-col
      min-h-[520px] md:min-h-[600px] lg:min-h-[660px]
    "
  >
    {/* Heading */}
    <h1 className="text-3xl font-semibold">Great to meet you, {name}! 🎉</h1>
    <p className="mt-2 text-sm text-brand-100">
      Let&apos;s walk you through how Finlytics works in just 3 simple steps.
    </p>

    <hr className="my-6 border-brand-700/60" />

    {/* Step cards */}
    <div className="space-y-4 flex-1">
      <StepBox
        number={1}
        title="Upload Your Statement"
        desc="Simply drag and drop your CSV bank statement file"
      />
      <StepBox
        number={2}
        title="Automatic Processing"
        desc="We’ll extract and categorize all transactions instantly"
      />
      <StepBox
        number={3}
        title="Filter & Export"
        desc="Use powerful filters and export your organized data"
      />
    </div>

    {/* Footer */}
    <div className="mt-8 flex items-center justify-between">
      <p className="text-sm text-brand-200">Step 2 - 6</p>
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
          onClick={() => nav('/onboarding/step-3', { state })}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-medium text-brand-900 hover:opacity-90"
        >
          Next ›
        </button>
      </div>
    </div>
  </div>
);

}

/* ------------ card component ------------ */
function StepBox({
  number,
  title,
  desc,
}: {
  number: number;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-5 rounded-xl border border-white/10 bg-brand-900/30 px-6 py-5 md:px-8 md:py-6">
      <div className="grid h-10 w-10 md:h-12 md:w-12 shrink-0 place-items-center rounded-full bg-accent text-brand-900 font-semibold text-base md:text-lg">
        {number}
      </div>
      <div className="leading-tight">
        <div className="font-semibold text-lg md:text-xl">{title}</div>
        <div className="mt-1 text-sm md:text-base text-brand-100">{desc}</div>
      </div>
    </div>
  );
}
