"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Paywall from "@/app/components/Paywall";
import Navigation from "@/app/components/Navigation";
import { checkPaymentStatusClient } from "@/lib/payment-check-client";

interface Form {
  id: string;
  name: string;
  slug: string | null;
  created_at: string;
  updated_at: string;
}

export default function FormsListPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Payment check states
  const [hasPaid, setHasPaid] = useState<boolean | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(true);

  // Check payment status on mount
  useEffect(() => {
    async function checkPayment() {
      try {
        const status = await checkPaymentStatusClient();
        setHasPaid(status.hasPaid);
      } catch (error) {
        console.error('Error checking payment:', error);
        setHasPaid(false);
      } finally {
        setCheckingPayment(false);
      }
    }
    checkPayment();
  }, []);

  useEffect(() => {
    if (hasPaid) {
      loadForms();
    }
  }, [hasPaid]);

  async function loadForms() {
    try {
      const res = await fetch("/api/forms");
      if (!res.ok) throw new Error("Failed to load forms");
      const data = await res.json();
      setForms(data);
    } catch (e) {
      setError("Failed to load forms");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function deleteForm(id: string, name: string) {
    if (!confirm(`Delete form "${name}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/forms?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      
      // Refresh list
      loadForms();
    } catch (e) {
      alert("Failed to delete form");
      console.error(e);
    }
  }

  function copyEmbedCode(formId: string) {
    const embedCode = `<!-- VoiceAIForms Embed -->
<script src="${window.location.origin}/embed.js"></script>
<div id="voiceform-${formId}"></div>
<script>
  VoiceAIForms.init('${formId}');
</script>`;

    const embedUrl = `${window.location.origin}/demo?formId=${formId}`;
    
    navigator.clipboard.writeText(embedUrl);
    alert("Form URL copied to clipboard!\n\n" + embedUrl);
  }

  // Show loading while checking payment
  if (checkingPayment) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show paywall if user hasn't paid
  if (!hasPaid) {
    return <Paywall />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navigation />
        <main className="text-white p-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">Loading forms...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />
      <main className="text-white p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Voice Forms</h1>
            <p className="text-slate-400">Create and manage voice-powered forms</p>
          </div>
          <Link
            href="/forms/create"
            className="px-6 py-3 rounded-lg font-semibold"
            style={{ background: "linear-gradient(90deg,#00BFA6,#4F46E5)" }}
          >
            + Create New Form
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-red-400">
            {error}
          </div>
        )}

        {/* Forms Grid */}
        {forms.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎙️</div>
            <h2 className="text-xl font-semibold mb-2">No forms yet</h2>
            <p className="text-slate-400 mb-6">Create your first voice form to get started</p>
            <Link
              href="/forms/create"
              className="inline-block px-6 py-3 rounded-lg font-semibold"
              style={{ background: "linear-gradient(90deg,#00BFA6,#4F46E5)" }}
            >
              Create Your First Form
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div
                key={form.id}
                className="rounded-xl p-6 border border-white/10"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <h3 className="text-lg font-semibold mb-2">{form.name}</h3>
                {form.slug && (
                  <p className="text-sm text-slate-400 mb-4">/{form.slug}</p>
                )}
                <p className="text-xs text-slate-500 mb-4">
                  Created {new Date(form.created_at).toLocaleDateString()}
                </p>

                <div className="flex flex-col gap-2">
                  <Link
                    href={`/forms/${form.id}/edit`}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-center"
                  >
                    Edit Form
                  </Link>
                  
                  <Link
                    href={`/forms/${form.id}/submissions`}
                    className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium text-center"
                  >
                    View Submissions
                  </Link>

                  <button
                    onClick={() => copyEmbedCode(form.id)}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium"
                  >
                    Copy Form URL
                  </button>

                  <Link
                    href={`/demo?formId=${form.id}`}
                    target="_blank"
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium text-center"
                  >
                    Test Form
                  </Link>

                  <button
                    onClick={() => deleteForm(form.id, form.name)}
                    className="w-full px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
