// src/pages/Onboarding/Step6.tsx
import { useLocation, useNavigate } from "react-router-dom";

type NavState = { fullName?: string; role?: string; email?: string };

export default function Step6() {
  const nav = useNavigate();
  const { state } = useLocation();
  const { fullName } = (state as NavState) || {};
  const firstName = (fullName || "You").split(" ")[0];

  return (
    <div
      className="
        rounded-2xl bg-brand-800/70 shadow-lg ring-1 ring-white/10
        px-6 py-6 flex flex-col
        min-h-[520px] md:min-h-[600px] lg:min-h-[660px]
      "
    >
      {/* Heading */}
      <h1 className="text-3xl font-semibold">You&apos;re All Set! 🚀</h1>
      <p className="mt-2 text-sm text-brand-100">
        Ready to start analyzing your bank statements with Finlytics?
      </p>

      <hr className="my-6 border-brand-700/60" />

      {/* Main content */}
      <div className="space-y-5 flex-1">
        {/* hero card (matches your screenshot) */}
        <div
          className="
            rounded-2xl
            bg-gradient-to-r from-[#d2d2d2]/60 via-[#c9c9c9]/40 to-[#bfbfbf]/35
            px-6 py-8
            flex flex-col items-center text-center
          "
        >
          <img
            src="/Succes.png" // in public/
            alt="Success illustration"
            className="h-28 md:h-36 w-auto mb-4"
          />

          <p className="text-3xl font-semibold text-white drop-shadow-sm">
            You&apos;re Ready to Go! {firstName}
          </p>

          <p className="mt-2 text-sm md:text-base text-white/90">
            Click &quot;Get Started&quot; below to begin uploading your first bank statement.
          </p>
        </div>

        {/* 3 feature boxes */}
        <div className="grid gap-4 md:grid-cols-3">
          <Feature title="Fast" desc="Process in seconds" />
          <Feature title="Accurate" desc="Smart categorization" />
          <Feature title="Easy" desc="No manual work" />
        </div>

        {/* Help line */}
        <div className="rounded-xl border border-amber-400/70 bg-brand-900/20 px-5 py-4 text-sm text-amber-100">
          <span className="font-semibold">Need Help?</span>{" "}
          You can always restart this tutorial from the settings menu.
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-brand-200">Step 6 - 6</p>
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
            onClick={() => nav("/home", { state })}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-medium text-brand-900 hover:opacity-90"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl bg-brand-900/40 px-5 py-4 text-center md:text-left">
      <p className="text-base font-semibold text-white">{title}</p>
      <p className="text-sm text-brand-100/90">{desc}</p>
    </div>
  );
}
