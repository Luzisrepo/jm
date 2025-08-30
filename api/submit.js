export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse the form data from the frontend
    const data = req.body;

    // Build the Discord message
    const discordMessage = {
      username: "JM Solutions Staff Applications",
      embeds: [
        {
          title: "New Staff Application",
          color: 0x0080ff,
          fields: [
            { name: "Full Name", value: data.fullName, inline: true },
            { name: "Email", value: data.email, inline: true },
            { name: "Discord Tag", value: data.discordTag, inline: true },
            { name: "Why become staff?", value: shorten(data.q1) },
            { name: "Moderation experience", value: shorten(data.q2) },
            { name: "Hours per week", value: data.q3 },
            { name: "Handling violations", value: shorten(data.q4) },
            { name: "Time zone & active hours", value: data.q5 },
            { name: "Conflict resolution", value: shorten(data.q6) },
            { name: "Skills", value: shorten(data.q7) },
            { name: "Enforcing rules", value: shorten(data.q8) },
            { name: "Additional comments", value: data.q9 || "None" },
          ],
          timestamp: data.timestamp,
          footer: { text: "JM Solutions Staff Application" },
        },
      ],
    };

    // Send to Discord webhook (kept secret via env var)
    const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discordMessage),
    });

    if (!response.ok) {
      throw new Error("Discord webhook error");
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook Error:", err);
    return res.status(500).json({ error: "Failed to send message" });
  }
}

// helper to trim long text
function shorten(txt) {
  return txt.length > 1000 ? txt.substring(0, 1000) + "..." : txt;
}
