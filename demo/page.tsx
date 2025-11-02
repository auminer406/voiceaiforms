"use client";
import { useEffect, useMemo, useState } from "react";

type Step =
  | { type: "message"; text: string; next?: string }
  | { type: "text" | "email"; label: string; placeholder?: string; next?: string }
  | { type: "single_select"; label: string; options: { id: string; label: string }[]; next?: string }
  | { type: "checkbox"; label: string; options: { id: string; label: string; required?: boolean }[]; next?: string }
  | { type: "completion"; text: string };

const ORDER = ["welcome", "name", "email", "primary_goal", "consent", "done"];

export default function Demo() {
  const [sessionId, setSessionId] = useState("");
  const [stepId, setStepId] = useState("");
  const [step, setStep] = useState<Step | null>(null);
  const [value, setValue] = useState<any>("");

  // init → show the real first step (welcome)
  useEffect(() => {
    const init = async () => {
      const r = await fetch("/api/session/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flowId: "early-access-v1" }),
      });
      const j = await r.json();
      setSessionId(j.session_id);
      setStepId(j.step_id);
      setStep(j.step); // show welcome immediately
    };
    init();
  }, []);

  const progress = useMemo(() => {
    const i = Math.max(0, ORDER.indexOf(stepId));
    const pct = Math.round((i / (ORDER.length - 1)) * 100);
    return isNaN(pct) ? 0 : pct;
  }, [stepId]);

  const submit = async () => {
    if (!step) return;
    // Enter on empty "message" should just continue
    const payloadValue =
      step.type === "message" ? null :
      step.type === "checkbox" ? (value ? "agree" : "") :
      value;

    const r = await fetch("/api/session/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, step_id: stepId, value: payloadValue }),
    });
    const j = await r.json();

    // completion?
    if (j.next_step?.type === "completion") {
      setStepId("done");
      setStep(j.next_step);
      return;
    }

    setStepId(j.next_step_id);
    setStep(j.next_step);
    setValue("");
  };

  // Enter key to submit
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [submit, step, value, stepId, sessionId]);

  if (!step) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-950 text-white">
        <div>Loading…</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative bg-slate-950 text-white flex items-center justify-center p-6">
      {/* subtle aurora/glass bg */}
      <div className="pointer-events-none absolute inset-0 opacity-50"
           style={{ background:
            "radial-gradient(60% 40% at 20% 10%, rgba(79,70,229,.35), transparent), radial-gradient(50% 35% at 80% 30%, rgba(0,191,166,.28), transparent)" }} />

      <div className="w-full max-w-xl relative rounded-2xl p-6"
           style={{ background:"rgba(255,255,255,0.08)", backdropFilter:"blur(22px)", border:"1px solid rgba(255,255,255,0.2)", boxShadow:"0 20px 60px rgba(0,0,0,.45)" }}>
        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold tracking-tight">Formversation</div>
          <div className="text-sm opacity-80">Early Access</div>
        </div>

        {/* progress */}
        <div className="w-full h-2 rounded-full mb-5" style={{ background:"rgba(255,255,255,0.15)" }}>
          <div className="h-2 rounded-full" style={{ width:`${progress}%`, background:"linear-gradient(90deg,#00BFA6,#4F46E5)" }} />
        </div>

        {/* content */}
        {step.type === "message" && (
          <div className="mb-5 leading-relaxed">{(step as any).text}</div>
        )}

        {(step.type === "text" || step.type === "email") && (
          <>
            <label className="block text-sm mb-2 opacity-90">{(step as any).label}</label>
            <input
              className="w-full rounded-xl px-4 py-3 mb-4 text-black"
              placeholder={(step as any).placeholder || ""}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </>
        )}

        {step.type === "single_select" && (
          <>
            <div className="text-sm mb-2 opacity-90">{(step as any).label}</div>
            <div className="space-y-2 mb-4">
              {(step as any).options.map((o: any) => (
                <label key={o.id} className="flex items-center gap-2">
                  <input type="radio" name="opt" onChange={() => setValue(o.id)} checked={value === o.id} />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </>
        )}

        {step.type === "checkbox" && (
          <label className="flex items-center gap-2 mb-4">
            <input type="checkbox" onChange={(e) => setValue(e.target.checked)} />
            <span>{(step as any).options[0].label}</span>
          </label>
        )}

        {step.type === "completion" ? (
          <div className="text-emerald-300">{(step as any).text}</div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-xs opacity-70">Press Enter ↵</span>
            <button
              onClick={submit}
              className="px-5 py-3 rounded-xl font-semibold"
              style={{ background:"linear-gradient(90deg,#00BFA6,#4F46E5)" }}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
