"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditFormPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.id as string;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [generateInvoice, setGenerateInvoice] = useState(false);
  const [yamlConfig, setYamlConfig] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadForm();
  }, [formId]);

  async function loadForm() {
    try {
      const res = await fetch(`/api/forms?id=${formId}`);
      if (!res.ok) throw new Error("Form not found");
      
      const form = await res.json();
      setName(form.name);
      setSlug(form.slug || "");
      setWebhookUrl(form.webhook_url || "");
      setGenerateInvoice(form.generate_invoice || false);
      setYamlConfig(form.yaml_config);
    } catch (e: any) {
      setError(e.message || "Failed to load form");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      // Validate YAML
      const yaml = await import("yaml");
      yaml.parse(yamlConfig);

      const res = await fetch("/api/forms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: formId,
          name,
          slug: slug || undefined,
          yaml_config: yamlConfig,
          webhook_url: webhookUrl || undefined,
          generate_invoice: generateInvoice,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update form");
      }

      // Redirect to forms list
      router.push("/forms");
    } catch (e: any) {
      setError(e.message || "Failed to update form");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">Loading form...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Voice Form</h1>
          <p className="text-slate-400">Modify your form configuration</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Form Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Slug (optional) */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Slug (optional)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Webhook URL (optional) */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Webhook URL (optional)
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Workflow Generation Toggle */}
          <div className="p-4 rounded-lg border border-slate-700 bg-slate-900/50">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={generateInvoice}
                onChange={(e) => setGenerateInvoice(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-slate-600 text-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-offset-0 focus:ring-offset-slate-900 bg-slate-800"
              />
              <div className="flex-1">
                <div className="font-medium text-sm mb-1">Generate Workflow (Invoices, Auto-responder, Emails, Scheduling)</div>
                <div className="text-xs text-slate-400">
                  Automatically process and send emails when this form is submitted. Use for invoices, service request notifications, auto-responders, and more. Requires Resend API key and contractor profile with email address.
                </div>
              </div>
            </label>
          </div>

          {/* YAML Configuration */}
          <div>
            <label className="block text-sm font-medium mb-2">
              YAML Configuration *
            </label>
            <textarea
              value={yamlConfig}
              onChange={(e) => setYamlConfig(e.target.value)}
              required
              rows={20}
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 focus:outline-none font-mono text-sm"
              spellCheck={false}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: saving ? "#666" : "linear-gradient(90deg,#00BFA6,#4F46E5)" }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            
            <button
              type="button"
              onClick={() => router.push("/forms")}
              className="px-6 py-3 rounded-lg font-semibold bg-slate-700 hover:bg-slate-600"
            >
              Cancel
            </button>

            <div className="flex-1"></div>

            <a
              href={`/demo?formId=${formId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg font-semibold bg-purple-600 hover:bg-purple-700"
            >
              Test Form
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}
