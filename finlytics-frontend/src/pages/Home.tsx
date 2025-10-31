// src/pages/Home.tsx
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/Components/FileUploader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

type NavState = { fullName?: string };

type ParsedResponse = {
  count: number;
  moneyIn: any[];
  moneyOut: any[];
  other: any[];
  raw: any[];
  ocrEnabled?: boolean;
};

export default function Home() {
  const { state } = useLocation();
  const { fullName } = (state as NavState) || {};
  const name =
    (fullName || localStorage.getItem("fullName") || "Arthur").toString();

  const [files, setFiles] = useState<File[] | null>(null);
  const [parsed, setParsed] = useState<ParsedResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const [filterCategory, setFilterCategory] = useState<
    "all" | "Money In" | "Money Out" | "Other"
  >("all");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [filterMin, setFilterMin] = useState("");
  const [filterMax, setFilterMax] = useState("");

  // derive filtered transactions
  const filteredTx =
    parsed?.raw.filter((tx) => {
      // 1) category
      if (filterCategory !== "all" && tx.category !== filterCategory) {
        return false;
      }

      // 2) date range
      if (filterFrom) {
        const txDate = new Date(tx.date);
        const from = new Date(filterFrom);
        if (txDate < from) return false;
      }
      if (filterTo) {
        const txDate = new Date(tx.date);
        const to = new Date(filterTo);
        if (txDate > to) return false;
      }

      // 3) amount range
      const amt =
        typeof tx.amount === "number"
          ? tx.amount
          : typeof tx.deposit === "number"
          ? tx.deposit
          : typeof tx.withdrawal === "number"
          ? -tx.withdrawal
          : null;

      if (amt !== null) {
        if (filterMin && amt < Number(filterMin)) return false;
        if (filterMax && amt > Number(filterMax)) return false;
      }

      return true;
    }) ?? [];

  // call FastAPI
  const handleContinue = async () => {
    const file = files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const API_BASE =
      import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

      const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    });

      if (!res.ok) {
        toast.error("Upload failed");
        return;
      }

      const data = (await res.json()) as ParsedResponse;
      setParsed(data);

      // reset filters whenever we load new data
      setFilterCategory("all");
      setFilterFrom("");
      setFilterTo("");
      setFilterMin("");
      setFilterMax("");

      toast.success(
        `Parsed ${data.count} transactions (in: ${data.moneyIn.length}, out: ${data.moneyOut.length}, other: ${data.other.length})`
      );
    } catch (err) {
      console.error(err);
      toast.error("Could not connect to backend");
    } finally {
      setLoading(false);
    }
  };

  // real Excel download, based on filteredTx
  const handleDownloadExcel = () => {
    if (!parsed || !parsed.raw.length) {
      toast.error("No data to download");
      return;
    }

    const rowsSource = filteredTx.length ? filteredTx : parsed.raw;

    const rows = rowsSource.map((tx: any) => ({
      Date: tx.date || "",
      Description: tx.description || "",
      Withdrawal: tx.withdrawal ?? "",
      Deposit: tx.deposit ?? "",
      Balance: tx.balance ?? "",
      Category: tx.category ?? "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");

    // optional: column widths
    ws["!cols"] = [
      { wch: 12 },
      { wch: 40 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
    ];

    const wbout = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([wbout], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const today = new Date().toISOString().split("T")[0];
    // if filtered, add a small suffix
    const filename =
      (filteredTx.length ? "finlytics_transactions_filtered_" : "finlytics_transactions_") +
      today +
      ".xlsx";

    saveAs(blob, filename);

    toast.success("Excel file downloaded!");
  };

  return (
    <div className="space-y-6">
      {/* Top info card */}
      <section className="rounded-xl bg-brand-800/70 p-5 shadow-lg ring-1 ring-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">
              Finlytics Bank Statement Parser
            </h2>
            <p className="mt-1 text-sm text-brand-100">
              Automated transaction extraction and categorization
            </p>
          </div>

          <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-500 text-white">
            <span className="font-bold">Fi</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-accent">
            Welcome {name}
          </h3>

          <a
            href="/onboarding/step-1"
            className="text-sm italic underline decoration-white/60 underline-offset-4 hover:opacity-90"
          >
            Restart Tutorial
          </a>
        </div>
      </section>

      {/* Upload area */}
      <section className="rounded-xl bg-brand-800/70 p-6 shadow-lg ring-1 ring-white/10">
        <FileUploader
          value={files}
          onValueChange={(f) => {
            setFiles(f);
            setParsed(null); // clear previous result
          }}
          reSelect
          orientation="vertical"
          dropzoneOptions={{
            multiple: true,
            maxFiles: 10,
            maxSize: 30 * 1024 * 1024, // 30MB
            accept: {
              "text/csv": [".csv"],
              "application/pdf": [".pdf"],
              "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
            },
          }}
          className="gap-3"
        >
          <FileInput
            parentclass="rounded-xl"
            className="border border-dashed border-white/30 bg-brand-900/20 px-6 py-12 text-center"
            dropmsg="Drop your CSV here"
          >
            <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-brand-900/40">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="opacity-80"
              >
                <path
                  d="M12 16V8m0 0l-3 3m3-3l3 3M4 16a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
            </div>
            <p className="text-base">
              <span className="font-semibold text-accent">Click to upload</span>{" "}
              or drag and drop
            </p>
            <p className="mt-1 text-xs text-brand-200">
              CSV, PDF &amp; Image files supported. Max size: 30MB
            </p>
          </FileInput>

          {files?.length ? (
            <FileUploaderContent className="mt-3">
              {files.map((f, i) => (
                <FileUploaderItem key={i} index={i}>
                  <span className="truncate">{f.name}</span>
                  <span className="ml-2 text-xs opacity-70">
                    {(f.size / 1024).toFixed(0)} KB
                  </span>
                </FileUploaderItem>
              ))}
            </FileUploaderContent>
          ) : null}
        </FileUploader>

        <div className="mt-4 flex justify-end gap-3">
          {parsed ? (
            <p className="text-sm text-brand-100 self-center">
              Parsed {parsed.count} transactions
            </p>
          ) : null}
          <button
            className="rounded-lg bg-accent px-4 py-2 font-medium text-brand-900 disabled:opacity-50"
            disabled={!files?.length || loading}
            onClick={handleContinue}
          >
            {loading ? "Uploading..." : "Continue"}
          </button>
        </div>
      </section>

      {/* Results / Empty state */}
      <section className="rounded-xl bg-brand-800/70 p-10 shadow-lg ring-1 ring-white/10">
        {parsed ? (
          <div className="space-y-4 text-left">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold">Parsed Summary</h3>
              <button
                onClick={handleDownloadExcel}
                className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Excel
              </button>
            </div>

      {/* FILTERS – match onboarding */}
      <div className="mt-6 grid gap-4 md:grid-cols-3 bg-brand-900/20 rounded-lg p-4">
        {/* Category */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-wide text-brand-100">
            Category
          </label>
          <select
            className="rounded-md bg-brand-900 border border-white/10 px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/60"
            value={filterCategory}
            onChange={(e) =>
              setFilterCategory(
                e.target.value as "all" | "Money In" | "Money Out" | "Other"
              )
            }
          >
            <option className="bg-brand-900 text-white" value="all">
              All
            </option>
            <option className="bg-brand-900 text-white" value="Money In">
              Money In
            </option>
            <option className="bg-brand-900 text-white" value="Money Out">
              Money Out
            </option>
            <option className="bg-brand-900 text-white" value="Other">
              Other
            </option>
          </select>
        </div>

        {/* Date range */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs uppercase tracking-wide text-brand-100">
              From
            </label>
            <input
              type="date"
              className="w-full rounded-md bg-brand-900 border border-white/10 px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/60"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs uppercase tracking-wide text-brand-100">
              To
            </label>
            <input
              type="date"
              className="w-full rounded-md bg-brand-900 border border-white/10 px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/60"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
            />
          </div>
        </div>

        {/* Amount range */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs uppercase tracking-wide text-brand-100">
              Min amount
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full rounded-md bg-brand-900 border border-white/10 px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/60"
              value={filterMin}
              onChange={(e) => setFilterMin(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="text-xs uppercase tracking-wide text-brand-100">
              Max amount
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full rounded-md bg-brand-900 border border-white/10 px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/60"
              value={filterMax}
              onChange={(e) => setFilterMax(e.target.value)}
            />
          </div>
        </div>
      </div>


            {/* (optional) small list to prove filters work */}
            <div className="mt-4 rounded-lg bg-brand-900/10 border border-white/5 max-h-72 overflow-auto">
              {filteredTx.length ? (
                <table className="min-w-full text-sm">
                  <thead className="bg-brand-900/40 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-left">Description</th>
                      <th className="px-3 py-2 text-right">Withdrawal</th>
                      <th className="px-3 py-2 text-right">Deposit</th>
                      <th className="px-3 py-2 text-left">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTx.map((tx, i) => (
                      <tr key={i} className="border-t border-white/5">
                        <td className="px-3 py-1">
                          {tx.date
                            ? new Date(tx.date).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-3 py-1">{tx.description || "—"}</td>
                        <td className="px-3 py-1 text-right">
                          {tx.withdrawal ?? ""}
                        </td>
                        <td className="px-3 py-1 text-right">
                          {tx.deposit ?? ""}
                        </td>
                        <td className="px-3 py-1">{tx.category ?? ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="px-3 py-2 text-sm text-brand-100">
                  No transactions match your filters.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-4 grid h-14 w-12 place-items-center rounded-md bg-brand-900/40">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                className="opacity-80"
              >
                <path
                  d="M8 3h5l4 4v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path d="M13 3v5h5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold">No Transactions Loaded</h3>
            <p className="mt-1 text-sm text-brand-100">
              Upload a bank statement to get started
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
