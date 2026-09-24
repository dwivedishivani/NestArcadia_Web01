import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "apikey"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-078be9eb/health", (c) => {
  return c.json({ status: "ok" });
});

app.post("/make-server-078be9eb/enquiries", async (c) => {
  try {
    const body = await c.req.json();
    const id = `enquiry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const record = {
      id,
      ...body,
      submittedAt: new Date().toISOString(),
    };

    await kv.set(id, record);
    return c.json({ success: true, id }, 200);
  } catch (err) {
    console.error("Enquiry save error:", err);
    return c.json({ error: "Failed to save enquiry" }, 500);
  }
});

Deno.serve(app.fetch);
