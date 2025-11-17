"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navigation from "@/app/components/Navigation";

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();

      if (data.profile) {
        setEmail(data.profile.email || "");
        setCompanyName(data.profile.company_name || "");
      }
    } catch (e) {
      console.error(e);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company_name: companyName }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save profile");
      }

      setMessage("Profile saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (e: any) {
      setError(e.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navigation />
        <main className="text-white p-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center py-12">Loading profile...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />
      <main className="text-white p-8">
        <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Business Profile</h1>
            <p className="text-slate-400">
              Set your business email and company name for invoice generation and automated notifications
            </p>
          </div>
          <Link
            href="/forms"
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
          >
            ← Back to Forms
          </Link>
        </div>

        {/* Profile Form */}
        <div
          className="rounded-xl p-6 border border-white/10"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
              />
              <p className="text-xs text-slate-400 mt-1">
                You'll receive a copy of all automations generated from your forms
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Company Name (Optional)
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your HVAC Company LLC"
              />
              <p className="text-xs text-slate-400 mt-1">
                Appears on automations sent to customers
              </p>
              <p className="text-xs text-slate-500 mt-2 italic">
                Note: Only invoice forms send automations to customers. Opt-in and other internal forms are for your records only.
              </p>
            </div>

            {message && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/40 rounded-lg text-green-400">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
              style={{ background: "linear-gradient(90deg,#00BFA6,#4F46E5)" }}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h3 className="font-semibold mb-2">How Automation Works:</h3>
          <ol className="text-sm text-slate-300 space-y-1 list-decimal list-inside">
            <li>Customer completes your voice form</li>
            <li>Formversation processes the form data into an automation</li>
            <li>Invoices are sent to the customer</li>
            <li>A copy is sent to your email above</li>
          </ol>
        </div>
        </div>
      </main>
    </div>
  );
}
