"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/** -------- Helpers -------- */
function normalizeEmailSpeech(input: string): string {
  let s = input.trim().toLowerCase();
  s = s.replace(/\s+at\s+/g, "@");
  s = s.replace(/\s+dot\s+/g, ".");
  s = s.replace(/\s+/g, "");
  s = s.replace(/[,;:]/g, "");
  return s;
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
function yn(s: string) {
  const a = s.trim().toLowerCase();
  if (["yes","yeah","yep","sure","correct","ok","okay","affirmative","i agree"].includes(a)) return true;
  if (["no","nope","nah","negative","not really","i don’t","i dont"].includes(a)) return false;
  return null;
}
function fuzzyGoal(spoken: string): "conversion"|"data_quality"|"automation"|"all"|"" {
  const s = spoken.toLowerCase();
  if (s.includes("all")) return "all";
  if (s.includes("conversion") || s.includes("sale")) return "conversion";
  if (s.includes("data")) return "data_quality";
  if (s.includes("automation") || s.includes("automations") || s.includes("trigger")) return "automation";
  return "";
}

/** -------- Page -------- */
export default function Demo() {
  const router = useRouter();

  // UI/state
  const [started, setStarted] = useState(false);
  const [promptText, setPromptText] = useState("Ready when you are.");
  const [hint, setHint] = useState<string>("");
  const [listening, setListening] = useState(false);

  // answers
  const [answers, setAnswers] = useState<{ name?: string; email?: string; goal?: string }>({});
  const answersRef = useRef(answers);
  useEffect(() => { answersRef.current = answers; }, [answers]);

  // audio / SR
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const srRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // hold-to-answer resolver
  const holdResolveRef = useRef<((t: string) => void) | null>(null);
  const holdRejectRef = useRef<((e: any) => void) | null>(null);

  // (Optional) lightweight server stubs
  const [sessionId, setSessionId] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/session/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ flowId: "early-access-v1" }),
        });
        const j = await r.json();
        setSessionId(j.session_id || "");
      } catch { /* ok */ }
    })();
  }, []);

  /** ---- Speak (await until TTS finishes) ---- */
  async function speak(text: string) {
    setPromptText(text);
    // unlock autoplay
    const Ctx: any = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!audioCtxRef.current && Ctx) audioCtxRef.current = new Ctx();
    if (audioCtxRef.current?.state === "suspended") await audioCtxRef.current.resume();

    const resp = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!resp.ok) throw new Error("TTS failed");
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);

    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.src = url;

    await new Promise<void>((resolve) => {
      audioRef.current!.onended = () => { URL.revokeObjectURL(url); resolve(); };
      audioRef.current!.play().catch(() => resolve());
    });
  }

  /** ---- Create one SpeechRecognition instance ---- */
  function ensureSR(): boolean {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return false;
    if (!srRef.current) {
      const sr = new SR();
      sr.lang = "en-US";
      sr.interimResults = false;
      sr.maxAlternatives = 1;

      sr.onresult = (e: any) => {
        const t = (e.results?.[0]?.[0]?.transcript || "").trim();
        if (holdResolveRef.current) holdResolveRef.current(t);
        holdResolveRef.current = null;
        holdRejectRef.current = null;
      };
      sr.onerror = (e: any) => {
        if (holdRejectRef.current) holdRejectRef.current(e);
        holdResolveRef.current = null;
        holdRejectRef.current = null;
        setListening(false);
      };
      sr.onend = () => {
        setListening(false);
      };

      srRef.current = sr;
    }
    return true;
  }

  /** ---- HOLD to answer: start on pointer down, stop on pointer up ---- */
  const onHoldDown = async () => {
    if (!ensureSR()) {
      setHint("Speech recognition not available. Try Chrome desktop or iOS Safari.");
      return;
    }
    // ask mic if needed
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      s.getTracks().forEach(t => t.stop());
    } catch {
      setHint("Please allow microphone access.");
      return;
    }
    setListening(true);
    try { srRef.current.start(); } catch { /* SR may already be running */ }
  };

  const onHoldUp = () => {
    try { srRef.current?.stop(); } catch {}
  };

  /** ---- Await one held utterance (returns transcript) ---- */
  function awaitHoldUtterance(timeoutMs = 12000): Promise<string> {
    return new Promise((resolve, reject) => {
      let done = false;
      const to = setTimeout(() => {
        if (done) return;
        done = true;
        try { srRef.current?.stop(); } catch {}
        reject(new Error("timeout"));
      }, timeoutMs);

      holdResolveRef.current = (t: string) => {
        if (done) return;
        done = true;
        clearTimeout(to);
        resolve(t);
      };
      holdRejectRef.current = (e: any) => {
        if (done) return;
        done = true;
        clearTimeout(to);
        reject(e);
      };
    });
  }

  /** ---- Server helpers (no-op safe) ---- */
  async function advanceServer(step_id: string, value: any) {
    if (!sessionId) return;
    try {
      await fetch("/api/session/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, step_id, value }),
      });
    } catch {}
  }
  async function submitToSheet() {
    const a = answersRef.current;
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: a.name || "", email: a.email || "", goal: a.goal || "" }),
      });
    } catch {}
  }

  /** ---- Deterministic flow (push-to-talk only) ---- */
  async function runFlow() {
    // Welcome
    await speak("Hey there, I’m your voice form. Press and hold the Answer button when you speak. Let’s get you set up.");

    // NAME
    // User must hold to answer each time; if invalid, we re-ask.
    while (true) {
      await speak("What’s your full name?");
      setHint("Press & hold the Answer button, speak your name, then release.");
      try {
        const heard = await awaitHoldUtterance();
        if (!/^[A-Za-z .'\-]{2,60}$/.test(heard)) {
          await speak("I didn’t quite catch that. Please say your first and last name, then release.");
          continue;
        }
        setAnswers(a => ({ ...a, name: heard }));
        await advanceServer("name", heard);
        break;
      } catch {
        await speak("No problem. Let’s try again. Press and hold, say your full name, then release.");
      }
    }

    // EMAIL
    while (true) {
      await speak("What’s the best email for your invite? You can say it like eric at gmail dot com.");
      setHint("Press & hold, speak your email, then release.");
      try {
        let heard = await awaitHoldUtterance();
        heard = normalizeEmailSpeech(heard);
        if (!EMAIL_RE.test(heard)) {
          await speak("That didn’t sound like a valid email. Please say it like name at company dot com.");
          continue;
        }
        setAnswers(a => ({ ...a, email: heard }));
        await advanceServer("email", heard);
        break;
      } catch {
        await speak("Didn’t hear it that time. Let’s try again.");
      }
    }

    // GOAL
    while (true) {
      await speak("What’s your primary goal with Formversation? You can say: increase conversions, cleaner data into CRM, trigger automations faster, or all of the above.");
      setHint("Press & hold, say your choice, then release.");
      try {
        const heard = await awaitHoldUtterance();
        const g = fuzzyGoal(heard);
        if (!g) {
          await speak("Please choose one of the options, like increase conversions or all of the above.");
          continue;
        }
        setAnswers(a => ({ ...a, goal: g }));
        await advanceServer("primary_goal", g);
        break;
      } catch {
        await speak("Let’s try again.");
      }
    }

    // CONSENT (optional)
    while (true) {
      await speak("Would you like early-supporter pricing at fifteen dollars a month for life? Please say yes or no.");
      setHint("Press & hold, say yes or no, then release.");
      try {
        const heard = await awaitHoldUtterance();
        const ok = yn(heard);
        if (ok === null) {
          await speak("Please say yes or no.");
          continue;
        }
        await advanceServer("consent", ok ? "agree" : "");
        break;
      } catch {
        await speak("Please say yes or no.");
      }
    }

    // REVIEW + CONFIRM
    const a = answersRef.current;
    const goalText =
      a.goal === "conversion" ? "increase conversions" :
      a.goal === "data_quality" ? "cleaner data into CRM" :
      a.goal === "automation" ? "trigger automations faster" :
      a.goal === "all" ? "all of the above" : "no goal selected";

    await speak(`Here’s what I have: ${a.name || "unknown name"}, ${a.email || "unknown email"}, goal: ${goalText}. Are we ready to submit? Please say yes or no.`);
    setHint("Press & hold, say yes or no, then release.");
    try {
      const heard = await awaitHoldUtterance();
      const ok = yn(heard);
      if (ok === true) {
        await submitToSheet();
        await speak("You’re all set. Check your inbox for early access. Redirecting now.");
        router.push("/thank-you");
        return;
      } else if (ok === false) {
        // Simple MVP: redo from name
        setAnswers({});
        await advanceServer("restart", "user_edit");
        await speak("No problem. Let’s adjust that. We’ll start over. What’s your full name?");
        return runFlow();
      } else {
        await speak("Please say yes to submit, or no to make a change.");
        return runFlow();
      }
    } catch {
      await speak("I didn’t hear that. Say yes to submit, or no to make a change.");
      return runFlow();
    }
  }

  /** ---- Start: single tap to unlock mic + audio + SR ---- */
  const handleStart = async () => {
    setStarted(true);
    setHint("");

    // Mic permission upfront (shows browser prompt once)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
    } catch {
      setHint("Please allow microphone access to continue.");
    }

    // Autoplay unlock
    const Ctx: any = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (Ctx) {
      audioCtxRef.current = new Ctx();
      if (audioCtxRef.current?.state === "suspended") await audioCtxRef.current?.resume();

    }

    // SR instance
    if (!ensureSR()) {
      setHint("Speech recognition not available. Try Chrome desktop or iOS Safari.");
      return;
    }

    // Run the push-to-talk flow
    runFlow().catch(() => {
      setHint("Voice flow hit an error. Refresh to try again.");
    });
  };

  /** ---- UI ---- */
  return (
    <main className="min-h-screen relative bg-slate-950 text-white flex items-center justify-center p-6">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(60% 40% at 20% 10%, rgba(79,70,229,.35), transparent), radial-gradient(50% 35% at 80% 30%, rgba(0,191,166,.28), transparent)",
        }}
      />

      {/* Glass card */}
      <div
        className="w-full max-w-xl relative rounded-2xl p-6"
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(22px)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 20px 60px rgba(0,0,0,.45)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="text-lg font-semibold tracking-tight">Formversation</div>
          <div className="text-sm opacity-80">{started ? (listening ? "Listening…" : "Voice form") : "Ready"}</div>
        </div>

        {/* Prompt / live line */}
        <div className="mb-6 leading-relaxed min-h-[2.5rem]">
          {promptText}
        </div>

        {/* Start button (only before start) */}
        {!started && (
          <>
            <button
              onClick={handleStart}
              className="w-full h-14 rounded-2xl font-semibold shadow-xl"
              style={{ background: "linear-gradient(90deg,#00BFA6,#4F46E5)", color: "#fff" }}
            >
              Start voice form
            </button>
            <p className="text-xs opacity-80 mt-3 text-center">
              By clicking Start, you allow microphone access so our voice form agent can talk and listen.
            </p>
          </>
        )}

        {/* Push-to-talk control (shown after start) */}
        {started && (
          <div className="mt-2">
            <button
              onPointerDown={onHoldDown}
              onPointerUp={onHoldUp}
              onPointerLeave={onHoldUp}
              className="w-full h-16 rounded-2xl font-semibold shadow-xl"
              style={{ background: listening ? "linear-gradient(90deg,#EF4444,#F59E0B)" : "linear-gradient(90deg,#4F46E5,#00BFA6)", color: "#fff" }}
            >
              {listening ? "Release to stop" : "Hold to Answer"}
            </button>
            <p className="text-xs opacity-80 mt-2 text-center">
              Press & hold while you speak, then release.
            </p>
          </div>
        )}

        {!!hint && <p className="text-xs opacity-80 mt-4">{hint}</p>}
      </div>
    </main>
  );
}
