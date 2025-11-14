"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DEFAULT_YAML = `version: 1
flow:
  id: "my-form"
  name: "My Voice Form"
  start: "welcome"

  steps:
    welcome:
      type: "message"
      speak: "Welcome! Let's get started."
      next: "name"

    name:
      type: "text"
      label: "What's your name?"
      speak: "What's your name?"
      validate:
        required: true
        regex: "^[A-Za-z .'-]{2,60}$"
      map: "name"
      next: "email"

    email:
      type: "email"
      speak: "What's your email? Say it like: name at example dot com."
      confirm:
        enabled: true
        prompt: "I heard {email}. Is that correct?"
      map: "email"
      next: "done"

    done:
      type: "completion"
      speak: "Thank you! Your response has been recorded."
`;

const THEMES = [
  {
    id: 'dark',
    name: 'Dark',
    description: 'Modern dark theme with subtle transparency',
    preview: 'bg-gradient-to-br from-slate-900 to-slate-800'
  },
  {
    id: 'light',
    name: 'Light',
    description: 'Clean light theme for bright backgrounds',
    preview: 'bg-gradient-to-br from-white to-gray-50'
  },
  {
    id: 'glass',
    name: 'Glass',
    description: 'Glassmorphism with blur and transparency',
    preview: 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur'
  },
  {
    id: 'brand',
    name: 'Brand',
    description: 'Teal to indigo gradient with glow',
    preview: 'bg-gradient-to-br from-teal-600 to-indigo-700'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple white with subtle borders',
    preview: 'bg-white border-2 border-gray-200'
  }
];

export default function CreateFormPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [theme, setTheme] = useState("dark");
  const [generateInvoice, setGenerateInvoice] = useState(false);
  const [yamlConfig, setYamlConfig] = useState(DEFAULT_YAML);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      // Validate YAML
      const yaml = await import("yaml");
      yaml.parse(yamlConfig);

      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: slug || undefined,
          yaml_config: yamlConfig,
          webhook_url: webhookUrl || undefined,
          theme,
          generate_invoice: generateInvoice,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create form");
      }

      const form = await res.json();
      
      // Redirect to forms list
      router.push("/forms");
    } catch (e: any) {
      setError(e.message || "Failed to create form");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Voice Form</h1>
          <p className="text-slate-400">Define your form using YAML configuration</p>
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
              placeholder="e.g., Contact Form, Lead Capture, Survey"
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
              placeholder="contact-form"
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 focus:outline-none"
            />
            <p className="text-xs text-slate-500 mt-1">
              Optional friendly URL: /f/your-slug
            </p>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Visual Theme *
            </label>
            <p className="text-xs text-slate-400 mb-4">
              Choose a theme that matches your brand or website where this form will be embedded
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    theme === t.id
                      ? 'border-teal-500 bg-teal-500/10'
                      : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                  }`}
                >
                  <div className={`w-full h-20 rounded-lg mb-3 ${t.preview}`}></div>
                  <div className="font-semibold text-sm mb-1">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.description}</div>
                </button>
              ))}
            </div>
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
              placeholder="https://your-webhook.com/endpoint"
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 focus:outline-none"
            />
            <p className="text-xs text-slate-500 mt-1">
              Submissions will be sent to this URL (e.g., Zapier, n8n, Make)
            </p>
          </div>

          {/* Invoice Generation Toggle */}
          <div className="p-4 rounded-lg border border-slate-700 bg-slate-900/50">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={generateInvoice}
                onChange={(e) => setGenerateInvoice(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-slate-600 text-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-offset-0 focus:ring-offset-slate-900 bg-slate-800"
              />
              <div className="flex-1">
                <div className="font-medium text-sm mb-1">Generate Invoices</div>
                <div className="text-xs text-slate-400">
                  Automatically generate and email invoices when this form is submitted. Requires OpenAI and Resend API keys, plus a contractor profile with email address.
                </div>
              </div>
            </label>
          </div>

          {/* YAML Configuration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">
                YAML Configuration *
              </label>
              <a
                href="https://github.com/yourusername/voiceaiforms/blob/main/docs/yaml-guide.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                View YAML Guide
              </a>
            </div>
            <textarea
              value={yamlConfig}
              onChange={(e) => setYamlConfig(e.target.value)}
              required
              rows={20}
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 focus:outline-none font-mono text-sm"
              spellCheck={false}
            />
            <p className="text-xs text-slate-500 mt-1">
              Define your form flow using YAML. See the default template above for reference.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: saving ? "#666" : "linear-gradient(90deg,#00BFA6,#4F46E5)" }}
            >
              {saving ? "Creating..." : "Create Form"}
            </button>
            
            <button
              type="button"
              onClick={() => router.push("/forms")}
              className="px-6 py-3 rounded-lg font-semibold bg-slate-700 hover:bg-slate-600"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-12 p-6 rounded-lg border border-slate-700 bg-slate-900/50">
          <h3 className="text-lg font-semibold mb-3">💡 Quick Tips</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>• Use <code className="px-1 py-0.5 bg-slate-800 rounded">type: "text"</code> for open-ended questions</li>
            <li>• Use <code className="px-1 py-0.5 bg-slate-800 rounded">type: "email"</code> for email capture with automatic parsing</li>
            <li>• Use <code className="px-1 py-0.5 bg-slate-800 rounded">type: "single_select"</code> for multiple choice</li>
            <li>• Add <code className="px-1 py-0.5 bg-slate-800 rounded">confirm: enabled: true</code> to verify answers</li>
            <li>• Use <code className="px-1 py-0.5 bg-slate-800 rounded">synonyms</code> to match different ways users might say the same thing</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
