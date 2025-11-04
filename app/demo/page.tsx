"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface FlowStep {
  type: string;
  label?: string;
  speak?: string;
  reask?: string;
  validate?: {
    required?: boolean;
    regex?: string;
    message?: string;
  };
  confirm?: {
    enabled: boolean;
    prompt?: string;
  };
  options?: Array<{
    id: string;
    label: string;
    synonyms?: string[];
  }>;
  next?: string;
  text?: string;
  map?: string;
}

interface SessionData {
  session_id: string;
  form_id: string;
  step_id: string;
  step: FlowStep;
}

function normalizeEmailSpeech(input: string): string {
  let s = input.trim().toLowerCase();
  s = s.replace(/\s+at\s+/g, "@");
  s = s.replace(/\s+dot\s+/g, ".");
  s = s.replace(/\s+/g, "");
  s = s.replace(/[,;:]/g, "");
  return s;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function yn(s: string): boolean | null {
  const a = s.trim().toLowerCase();
  if (["yes", "yeah", "yep", "sure", "correct", "ok", "okay", "affirmative", "i agree"].includes(a)) return true;
  if (["no", "nope", "nah", "negative", "not really", "i don't", "i dont"].includes(a)) return false;
  return null;
}

function matchSynonym(spoken: string, options: Array<{ id: string; synonyms?: string[] }>): string | null {
  const s = spoken.toLowerCase().trim();
  for (const opt of options) {
    if (!opt.synonyms) continue;
    for (const syn of opt.synonyms) {
      if (s.includes(syn.toLowerCase())) {
        return opt.id;
      }
    }
  }
  return null;
}

function validateWithRegex(input: string, regex: string): boolean {
  try {
    const re = new RegExp(regex);
    return re.test(input);
  } catch {
    return true;
  }
}

function DynamicVoiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get formId from URL parameter, default to early-access-v1 for backward compatibility
  const formId = searchParams.get('formId') || 'early-access-v1';

  const [started, setStarted] = useState(false);
  const [promptText, setPromptText] = useState("Ready when you are.");
  const [hint, setHint] = useState<string>("");
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const [sessionId, setSessionId] = useState("");
  const [currentFormId, setCurrentFormId] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const answersRef = useRef(answers);
  
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const srRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const pendingResolveRef = useRef<((t: string) => void) | null>(null);
  const pendingRejectRef = useRef<((e: any) => void) | null>(null);

  function clearPending() {
    pendingResolveRef.current = null;
    pendingRejectRef.current = null;
    setListening(false);
  }

  async function initSession() {
    try {
      const r = await fetch("/api/session/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId }),
      });
      
      if (!r.ok) {
        throw new Error(`Failed to load form: ${r.status}`);
      }
      
      const data: SessionData = await r.json();
      setSessionId(data.session_id);
      setCurrentFormId(data.form_id);
      return data;
    } catch (e) {
      console.error("Session init failed:", e);
      setHint("Failed to load form. Please check the form ID and refresh.");
      return null;
    }
  }

  async function getNextStep(stepId: string, value: string, useFormId?: string) {
    try {
      const r = await fetch("/api/session/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          session_id: sessionId, 
          form_id: useFormId || currentFormId || formId,
          step_id: stepId, 
          value 
        }),
      });
      const data = await r.json();
      return data;
    } catch (e) {
      console.error("Failed to get next step:", e);
      return null;
    }
  }

  async function submitForm(useFormId?: string) {
    const a = answersRef.current;
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          form_id: useFormId || currentFormId || formId,
          answers: a 
        }),
      });
    } catch (e) {
      console.error("Submit failed:", e);
    }
  }

  function stopSpeaking() {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
    setSpeaking(false);
  }

  async function speak(text: string) {
    setPromptText(text);
    
    // Ensure AudioContext exists and is resumed
    const Ctx: any = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!audioCtxRef.current && Ctx) {
      audioCtxRef.current = new Ctx();
    }
    
    // Critical for iOS: Always try to resume before playing
    if (audioCtxRef.current?.state === "suspended") {
      try {
        await audioCtxRef.current.resume();
      } catch (e) {
        console.warn("Audio context resume failed:", e);
      }
    }

    try {
      const resp = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!resp.ok) throw new Error("TTS failed");
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);

      if (!audioRef.current) audioRef.current = new Audio();
      const a = audioRef.current;
      a.src = url;

      setSpeaking(true);
      
      // iOS requires explicit play() call from user gesture context
      await new Promise<void>((resolve) => {
        a.onended = () => {
          URL.revokeObjectURL(url);
          setSpeaking(false);
          resolve();
        };
        a.onpause = () => setSpeaking(false);
        a.onerror = () => {
          console.error("Audio playback error");
          setSpeaking(false);
          resolve();
        };
        a.play().catch((e) => {
          console.error("Play failed:", e);
          setSpeaking(false);
          resolve();
        });
      });
    } catch (e) {
      console.error("TTS error:", e);
      setSpeaking(false);
    }
  }

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
        pendingResolveRef.current?.(t);
        clearPending();
      };
      
      sr.onerror = (e: any) => {
        pendingRejectRef.current?.(e);
        clearPending();
      };
      
      sr.onend = () => {
        setListening(false);
      };

      srRef.current = sr;
    }
    return true;
  }

  async function awaitNextUtterance(timeoutMs = 12000): Promise<string> {
    if (speaking) stopSpeaking();

    if (!ensureSR()) {
      throw new Error("Speech recognition not available.");
    }

    setListening(true);

    return new Promise<string>((resolve, reject) => {
      let done = false;

      pendingResolveRef.current = (t: string) => {
        if (done) return;
        done = true;
        resolve(t);
      };
      pendingRejectRef.current = (e: any) => {
        if (done) return;
        done = true;
        reject(e);
      };

      try { srRef.current!.start(); } catch { }

      const to = setTimeout(() => {
        if (done) return;
        done = true;
        try { srRef.current?.stop(); } catch {}
        reject(new Error("timeout"));
      }, timeoutMs);

      const finalize = () => {
        clearTimeout(to);
        clearPending();
      };

      const origResolve = pendingResolveRef.current;
      const origReject = pendingRejectRef.current;

      pendingResolveRef.current = (t: string) => {
        finalize();
        origResolve?.(t);
      };

      pendingRejectRef.current = (e: any) => {
        finalize();
        origReject?.(e);
      };
    });
  }

  async function handleTextStep(step: FlowStep, stepId: string): Promise<{ next_step_id: string; next_step: FlowStep } | null> {
    while (true) {
      await speak(step.speak || step.label || "Please speak your answer.");
      
      try {
        const heard = await awaitNextUtterance();
        
        if (step.validate?.regex && !validateWithRegex(heard, step.validate.regex)) {
          await speak(step.validate.message || step.reask || "Let us try that again.");
          continue;
        }
        
        if (step.confirm?.enabled) {
          const confirmPrompt = step.confirm.prompt?.replace(`{${step.map}}`, heard) || `I heard ${heard}. Is that correct?`;
          await speak(confirmPrompt);
          
          try {
            const confirmHeard = await awaitNextUtterance();
            const confirmed = yn(confirmHeard);
            
            if (confirmed === false) {
              await speak("Let us try again.");
              continue;
            } else if (confirmed === null) {
              await speak("Please say yes or no.");
              continue;
            }
          } catch {
            await speak("Please say yes or no.");
            continue;
          }
        }
        
        if (step.map) {
          setAnswers((a) => ({ ...a, [step.map!]: heard }));
        }
        
        return await getNextStep(stepId, heard);
      } catch {
        await speak("Let us try that again.");
      }
    }
  }

  async function handleEmailStep(step: FlowStep, stepId: string): Promise<{ next_step_id: string; next_step: FlowStep } | null> {
    while (true) {
      await speak(step.speak || "What is your email?");
      
      try {
        const heard = await awaitNextUtterance();
        const normalized = normalizeEmailSpeech(heard);
        
        if (!EMAIL_RE.test(normalized)) {
          await speak(step.reask || "That does not sound like a valid email. Try again.");
          continue;
        }
        
        if (step.confirm?.enabled) {
          const confirmPrompt = step.confirm.prompt?.replace(`{${step.map}}`, normalized) || `I heard ${normalized}. Is that correct?`;
          await speak(confirmPrompt);
          
          try {
            const confirmHeard = await awaitNextUtterance();
            const confirmed = yn(confirmHeard);
            
            if (confirmed === false) {
              await speak("Let us try the email again.");
              continue;
            } else if (confirmed === null) {
              await speak("Please say yes or no.");
              continue;
            }
          } catch {
            await speak("Please say yes or no.");
            continue;
          }
        }
        
        if (step.map) {
          setAnswers((a) => ({ ...a, [step.map!]: normalized }));
        }
        
        return await getNextStep(stepId, normalized);
      } catch {
        await speak("Let us try that again.");
      }
    }
  }

  async function handleSingleSelectStep(step: FlowStep, stepId: string): Promise<{ next_step_id: string; next_step: FlowStep } | null> {
    while (true) {
      await speak(step.speak || "Please choose an option.");
      
      try {
        const heard = await awaitNextUtterance();
        const matched = step.options ? matchSynonym(heard, step.options) : null;
        
        if (!matched) {
          await speak(step.reask || "Please choose one of the options.");
          continue;
        }
        
        if (step.confirm?.enabled) {
          const selectedLabel = step.options?.find(o => o.id === matched)?.label || matched;
          const confirmPrompt = step.confirm.prompt?.replace(`{${step.map}}`, selectedLabel) || `You chose ${selectedLabel}. Correct?`;
          await speak(confirmPrompt);
          
          try {
            const confirmHeard = await awaitNextUtterance();
            const confirmed = yn(confirmHeard);
            
            if (confirmed === false) {
              await speak("Let us choose again.");
              continue;
            } else if (confirmed === null) {
              await speak("Please say yes or no.");
              continue;
            }
          } catch {
            await speak("Please say yes or no.");
            continue;
          }
        }
        
        if (step.map) {
          setAnswers((a) => ({ ...a, [step.map!]: matched }));
        }
        
        return await getNextStep(stepId, matched);
      } catch {
        await speak("Let us try again.");
      }
    }
  }

  async function handleCheckboxStep(step: FlowStep, stepId: string): Promise<{ next_step_id: string; next_step: FlowStep } | null> {
    while (true) {
      await speak(step.speak || "Do you agree?");
      
      try {
        const heard = await awaitNextUtterance();
        const agreed = yn(heard);
        
        if (agreed === null) {
          await speak(step.reask || "Please say yes or no.");
          continue;
        }
        
        const value = agreed ? "agree" : "";
        
        if (step.map) {
          setAnswers((a) => ({ ...a, [step.map!]: value }));
        }
        
        return await getNextStep(stepId, value);
      } catch {
        await speak("Please say yes or no.");
      }
    }
  }

  async function handleMessageStep(step: FlowStep, stepId: string, useFormId: string): Promise<{ next_step_id: string; next_step: FlowStep } | null> {
    await speak(step.speak || step.text || "");
    return await getNextStep(stepId, "", useFormId);
  }

  async function handleCompletionStep(step: FlowStep, useFormId: string): Promise<null> {
    await submitForm(useFormId);
    await speak(step.speak || step.text || "Thank you! You are all set.");
    
    setTimeout(() => {
      router.push("/thank-you");
    }, 2000);
    
    return null;
  }

  async function runDynamicFlow() {
    const session = await initSession();
    if (!session) return;

    let currentStepId = session.step_id;
    let currentStep = session.step;
    const flowFormId = session.form_id; // Capture form_id from session

    while (currentStep) {
      let nextData = null;

      switch (currentStep.type) {
        case "message":
          nextData = await handleMessageStep(currentStep, currentStepId, flowFormId);
          break;
        case "text":
          nextData = await handleTextStep(currentStep, currentStepId);
          break;
        case "email":
          nextData = await handleEmailStep(currentStep, currentStepId);
          break;
        case "single_select":
          nextData = await handleSingleSelectStep(currentStep, currentStepId);
          break;
        case "checkbox":
          nextData = await handleCheckboxStep(currentStep, currentStepId);
          break;
        case "completion":
          await handleCompletionStep(currentStep, flowFormId);
          return;
        default:
          console.warn(`Unknown step type: ${currentStep.type}`);
          await speak("Something went wrong. Please refresh.");
          return;
      }

      if (!nextData || !nextData.next_step) {
        break;
      }

      currentStepId = nextData.next_step_id;
      currentStep = nextData.next_step;
    }
  }

  const handleStart = async () => {
    setStarted(true);
    setHint("");

    // 1. Check Speech Recognition FIRST (before audio setup)
    if (!ensureSR()) {
      setHint("Speech recognition not available. Try Chrome desktop or iOS Safari.");
      setStarted(false);
      return;
    }

    // 2. Request microphone permission
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
    } catch {
      setHint("Please allow microphone access to continue.");
      setStarted(false);
      return;
    }

    // 3. Initialize Audio Context LAST (after permissions granted)
    const Ctx: any = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (Ctx) {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new Ctx();
      }
      // iOS Safari requires user interaction to resume AudioContext
      if (audioCtxRef.current?.state === "suspended") {
        try {
          await audioCtxRef.current.resume();
        } catch (e) {
          console.warn("Could not resume audio context:", e);
        }
      }
    }

    // 4. Start the flow
    runDynamicFlow().catch((e) => {
      console.error("Flow error:", e);
      setHint("Voice flow hit an error. Refresh to try again.");
      setStarted(false);
    });
  };

  return (
    <main className="min-h-screen relative bg-slate-950 text-white flex items-center justify-center p-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(60% 40% at 20% 10%, rgba(79,70,229,.35), transparent), radial-gradient(50% 35% at 80% 30%, rgba(0,191,166,.28), transparent)",
        }}
      />

      <div
        className="w-full max-w-xl relative rounded-2xl p-6"
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(22px)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 20px 60px rgba(0,0,0,.45)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="text-lg font-semibold tracking-tight">Formversation</div>
          <div className="text-sm opacity-80">
            {started ? (listening ? "Listening..." : speaking ? "Speaking..." : "Voice form") : "Ready"}
          </div>
        </div>

        <div className="mb-6 leading-relaxed min-h-[2.5rem]">{promptText}</div>

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
              We will talk and listen automatically. Speak after I finish.
            </p>
          </>
        )}

        {started && (
          <div className="mt-4 p-4 bg-white/5 rounded-xl text-center">
            {listening && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Listening...</span>
              </div>
            )}
            {speaking && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Speaking...</span>
              </div>
            )}
            {!listening && !speaking && (
              <span className="text-sm opacity-60">Processing...</span>
            )}
            {speaking && (
              <button
                onClick={stopSpeaking}
                className="mt-3 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
              >
                Stop Speaking
              </button>
            )}
          </div>
        )}

        {!!hint && <p className="text-xs opacity-80 mt-4 text-center text-red-400">{hint}</p>}
      </div>
    </main>
  );
}

export default function DemoPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen relative bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="text-center">Loading...</div>
      </main>
    }>
      <DynamicVoiceForm />
    </Suspense>
  );
}