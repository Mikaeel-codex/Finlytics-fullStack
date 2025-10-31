import { Outlet, Link, useLocation } from "react-router-dom";

const TOTAL_STEPS = 6;

export default function MainLayout() {
  const { pathname } = useLocation();

  // Extract step from URL: /onboarding/step-<n>
  const match = pathname.match(/\/onboarding\/step-(\d+)/);
  const currentStep = match ? Math.max(1, Math.min(TOTAL_STEPS, Number(match[1]))) : 0;

  // Progress: Step 1 = 0%, Step 6 = 100%
  const percent =
    currentStep > 0 ? ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100 : 0;

  return (
    <div className="min-h-screen bg-brand-900 text-white">
      {/* Top bar */}
      <header className="bg-white/95 text-brand-900 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          {/* Take users to step 1 when they click the brand */}
          <Link to="/onboarding/step-1" className="text-lg font-semibold">
            Finlytics
          </Link>
        </div>

        {/* Progress track (thin) */}
        <div className="h-1 w-full bg-transparent">
          <div
            className="h-full bg-accent transition-[width] duration-500 ease-out"
            style={{ width: `${percent}%` }}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(percent)}
            role="progressbar"
          />
        </div>
      </header>

      {/* Page body */}
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
