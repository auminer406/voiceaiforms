"use client";

export default function ThankYou() {
  const shareText = encodeURIComponent("I just filled out a form by TALKING to it! Check out this voice AI form - the future of data collection");
  const shareUrl = encodeURIComponent("https://hello.formversation.com");
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://hello.formversation.com");
    alert("Link copied! Share it anywhere you like!");
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
        className="w-full max-w-xl relative rounded-2xl p-8 text-center"
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(22px)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 20px 60px rgba(0,0,0,.45)",
        }}
      >
        <div className="mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold mb-3">You are all set!</h1>
          <p className="text-lg opacity-90">
            Watch your inbox for early access and founder updates.
          </p>
        </div>

        <div className="my-8 p-4 bg-white/5 rounded-xl border border-white/10">
          <p className="text-sm font-semibold mb-3">
            You just experienced the future of forms
          </p>
          <p className="text-xs opacity-80">
            No typing. No clicking through endless fields. Just talk.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium mb-4">
            Think this was pretty cool? Help us spread the word!
          </p>
          
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            style={{ background: "linear-gradient(90deg,#1DA1F2,#1a8cd8)", color: "#fff" }}
          >
            Share on X Twitter
          </a>

          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            style={{ background: "linear-gradient(90deg,#0077B5,#005885)", color: "#fff" }}
          >
            Share on LinkedIn
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            style={{ background: "linear-gradient(90deg,#4267B2,#365899)", color: "#fff" }}
          >
            Share on Facebook
          </a>

          <button
            onClick={handleCopyLink}
            className="block w-full px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 border border-white/20"
            style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
          >
            Copy Link
          </button>
        </div>

        <p className="text-xs opacity-60 mt-8">
          Early supporters get $15/month pricing for life when we launch!
        </p>
      </div>
    </main>
  );
}
