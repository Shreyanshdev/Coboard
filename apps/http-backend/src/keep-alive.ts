import https from "https";
import http from "http";

/**
 * Render Auto-Pinger Bot (Keep-Alive Service)
 * Prevents Render.com free tier services from spinning down due to 15-minute inactivity.
 */
export function startKeepAliveBot(intervalMinutes: number = 10): NodeJS.Timeout | null {
  const targetUrls: string[] = [];

  // Render automatically injects RENDER_EXTERNAL_URL (e.g. https://coboard-backend.onrender.com)
  if (process.env.RENDER_EXTERNAL_URL) {
    targetUrls.push(process.env.RENDER_EXTERNAL_URL);
  }

  // Custom environment variable for custom server domain or multiple endpoints
  if (process.env.SERVER_URL) {
    targetUrls.push(process.env.SERVER_URL);
  }

  if (process.env.KEEP_ALIVE_URLS) {
    const splitUrls = process.env.KEEP_ALIVE_URLS.split(",").map((u) => u.trim());
    targetUrls.push(...splitUrls);
  }

  // Filter and deduplicate URLs
  const uniqueUrls = Array.from(new Set(targetUrls.filter(Boolean)));

  if (uniqueUrls.length === 0) {
    console.log(
      "[Keep-Alive Bot] Standby mode. Set RENDER_EXTERNAL_URL or SERVER_URL in environment to enable auto-pinging."
    );
    return null;
  }

  console.log(
    `[Keep-Alive Bot] 🤖 Active! Pinging ${uniqueUrls.length} target(s) every ${intervalMinutes} minutes to keep Render awake:`
  );
  uniqueUrls.forEach((u) => console.log(`  -> ${u}`));

  const ping = (url: string) => {
    try {
      const fullUrl = url.endsWith("/health") ? url : `${url.replace(/\/$/, "")}/health`;
      const client = fullUrl.startsWith("https") ? https : http;

      const startTime = Date.now();
      const req = client.get(fullUrl, (res) => {
        const latency = Date.now() - startTime;
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
          console.log(
            `[Keep-Alive Bot] 🟢 Ping successful: ${fullUrl} [Status: ${res.statusCode}] (${latency}ms) at ${new Date().toLocaleTimeString()}`
          );
        } else {
          console.warn(
            `[Keep-Alive Bot] 🟡 Ping warning: ${fullUrl} returned status ${res.statusCode}`
          );
        }
      });

      req.on("error", (err) => {
        console.warn(`[Keep-Alive Bot] ⚠️ Ping failed for ${fullUrl}:`, err.message);
      });

      req.setTimeout(10000, () => {
        req.destroy();
      });
    } catch (e: any) {
      console.warn(`[Keep-Alive Bot] Error creating request for ${url}:`, e.message);
    }
  };

  // Initial ping after 30 seconds
  setTimeout(() => {
    uniqueUrls.forEach(ping);
  }, 30 * 1000);

  // Recurring interval (default: 10 minutes)
  const timer = setInterval(() => {
    uniqueUrls.forEach(ping);
  }, intervalMinutes * 60 * 1000);

  return timer;
}
