"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Submission {
  id: string;
  answers: Record<string, any>;
  metadata?: Record<string, any>;
  submitted_at: string;
}

interface Form {
  id: string;
  name: string;
}

export default function SubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;

  const [form, setForm] = useState<Form | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [formId]);

  async function loadData() {
    try {
      // Load form
      const formRes = await fetch(`/api/forms?id=${formId}`);
      if (!formRes.ok) throw new Error("Form not found");
      const formData = await formRes.json();
      setForm(formData);

      // Load submissions
      const subsRes = await fetch(`/api/submissions?formId=${formId}`);
      if (!subsRes.ok) throw new Error("Failed to load submissions");
      const subsData = await subsRes.json();
      setSubmissions(subsData);
    } catch (e: any) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  function exportToCSV() {
    if (submissions.length === 0) return;

    // Get all unique answer keys
    const allKeys = new Set<string>();
    submissions.forEach(sub => {
      Object.keys(sub.answers).forEach(key => allKeys.add(key));
    });

    const keys = Array.from(allKeys);
    
    // Create CSV
    const headers = ["Submission ID", "Submitted At", ...keys].join(",");
    const rows = submissions.map(sub => {
      const values = [
        sub.id,
        new Date(sub.submitted_at).toLocaleString(),
        ...keys.map(key => {
          const val = sub.answers[key] || "";
          // Escape commas and quotes
          return `"${String(val).replace(/"/g, '""')}"`;
        })
      ];
      return values.join(",");
    });

    const csv = [headers, ...rows].join("\n");
    
    // Download
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form?.name || "form"}-submissions-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">Loading submissions...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
            {error}
          </div>
          <button
            onClick={() => router.push("/forms")}
            className="mt-4 px-6 py-3 rounded-lg font-semibold bg-slate-700 hover:bg-slate-600"
          >
            Back to Forms
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{form?.name} - Submissions</h1>
            <p className="text-slate-400">{submissions.length} total submissions</p>
          </div>
          <div className="flex gap-3">
            {submissions.length > 0 && (
              <button
                onClick={exportToCSV}
                className="px-6 py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-700"
              >
                Export CSV
              </button>
            )}
            <Link
              href="/forms"
              className="px-6 py-3 rounded-lg font-semibold bg-slate-700 hover:bg-slate-600"
            >
              Back to Forms
            </Link>
          </div>
        </div>

        {/* Submissions List */}
        {submissions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-semibold mb-2">No submissions yet</h2>
            <p className="text-slate-400 mb-6">Submissions will appear here once users complete your form</p>
            <Link
              href={`/demo?formId=${formId}`}
              target="_blank"
              className="inline-block px-6 py-3 rounded-lg font-semibold"
              style={{ background: "linear-gradient(90deg,#00BFA6,#4F46E5)" }}
            >
              Test Your Form
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="rounded-xl p-6 border border-white/10"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-xs text-slate-500">
                    {new Date(submission.submitted_at).toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {submission.id}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(submission.answers).map(([key, value]) => (
                    <div key={key}>
                      <div className="text-xs text-slate-400 mb-1 uppercase tracking-wide">
                        {key.replace(/_/g, " ")}
                      </div>
                      <div className="text-sm font-medium">
                        {String(value)}
                      </div>
                    </div>
                  ))}
                </div>

                {submission.metadata && Object.keys(submission.metadata).length > 0 && (
                  <details className="mt-4">
                    <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-400">
                      View Metadata
                    </summary>
                    <pre className="mt-2 text-xs bg-slate-900 p-3 rounded overflow-x-auto">
                      {JSON.stringify(submission.metadata, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
