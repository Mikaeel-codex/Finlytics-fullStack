// src/pages/Onboarding/Step1.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Role = "Accountant" | "Bookkeeper" | "Business Owner" | "Developer" | "Other";

export default function Step1() {
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [email, setEmail] = useState("");

  const emailOk = /^\S+@\S+\.\S+$/.test(email);
  const canNext = fullName.trim().length > 1 && !!role && emailOk;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canNext) return;
    nav("/onboarding/step-2", { state: { fullName: fullName.trim(), role, email } });
  };

  return (
  <form
    onSubmit={submit}
    className="
      rounded-2xl bg-brand-800/70 shadow-lg ring-1 ring-white/10
      px-6 py-6
      flex flex-col
      min-h-[520px] md:min-h-[600px] lg:min-h-[660px]
    "
  >
    {/* HEADER + SUBTITLE */}
    <h1 className="text-3xl font-semibold text-white">Welcome to Finlytics!</h1>
    <p className="mt-2 text-sm text-brand-100">
      Your intelligent bank statement parser that automates transaction extraction and categorization.
    </p>

    <hr className="my-6 border-brand-700/60" />

    {/* FIELDS */}
    <div className="space-y-5 flex-1">
      <label className="block">
        <div className="mb-2 text-sm text-brand-100">
          Before we get started, what should we call you?
        </div>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your fullname"
          className="w-full rounded-lg border border-white/10 bg-brand-900/40 px-4 py-2 text-white placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </label>

      <label className="block">
        <div className="mb-2 text-sm text-brand-100">What best describes you?</div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="w-full rounded-lg border border-white/10 bg-brand-900/40 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">Select your role...</option>
          <option>Accountant</option>
          <option>Bookkeeper</option>
          <option>Business Owner</option>
          <option>Developer</option>
          <option>Other</option>
        </select>
      </label>

      <label className="block">
        <div className="mb-2 text-sm text-brand-100">Provide email adress</div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="w-full rounded-lg border border-white/10 bg-brand-900/40 px-4 py-2 text-white placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        {!emailOk && email.length > 0 && (
          <p className="mt-1 text-xs text-red-300">Enter a valid email.</p>
        )}
      </label>
    </div>

    {/* FOOTER */}
    <div className="mt-8 flex items-center justify-between">
      <p className="text-sm text-brand-200">Step 1 - 6</p>
      <button
        type="submit"
        disabled={!canNext}
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 font-medium text-brand-900 disabled:opacity-50"
      >
        Next <span aria-hidden>›</span>
      </button>
    </div>
  </form>
);

}
