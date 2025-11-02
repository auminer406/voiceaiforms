// app/api/submit/route.ts

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log("✅ Formversation submission received:", data);

    // Optional: forward to your external webhook (like n8n, Zapier, Make)
    if (process.env.SUBMIT_WEBHOOK_URL) {
      await fetch(process.env.SUBMIT_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log("📬 Forwarded to:", process.env.SUBMIT_WEBHOOK_URL);
    }

    // Respond OK to the frontend
    return new Response(
      JSON.stringify({ success: true, message: "Submission received" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("❌ Error processing submission:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

