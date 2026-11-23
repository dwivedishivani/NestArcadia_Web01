// NestArcadia public MCP server (Streamable HTTP, stateless, read-only).
// Exposes the same three tools as the in-browser WebMCP registration on nestarcadia.com.
// Deploy with verify_jwt disabled: agents call it without a Supabase JWT.
// It never reads or writes the database and never submits a lead; it only returns public facts and links.

const SITE = "https://nestarcadia.com";
const SUPPORTED_PROTOCOL_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26"];
const SERVER_INFO = { name: "nestarcadia", title: "NestArcadia", version: "1.0.0" };
const INSTRUCTIONS =
  "Public, read-only information about NestArcadia, an interior design and turnkey execution studio in Noida Extension, Greater Noida West and Delhi NCR. " +
  "Costs are indicative; final scope and price are agreed in writing after a brief and site details. This server never submits an enquiry.";

const SERVICE_AREAS = [
  "Greater Noida West", "Noida Extension", "Noida", "Greater Noida", "Ghaziabad", "Indirapuram",
  "Crossing Republik", "East Delhi", "Delhi", "South Delhi", "Gurugram", "Faridabad", "Dadri", "Jewar", "Yamuna Expressway",
];

const COSTS: Record<string, { range: string; note: string }> = {
  "2bhk": { range: "₹5–12 lakh", note: "Depends on scope, materials and finish level." },
  "3bhk": { range: "₹7–22 lakh", note: "Depends on scope, materials and finish level." },
  "4bhk": { range: "Quoted after a brief", note: "Larger homes and villas are priced from the floor plan and specification." },
};

const tools = [
  {
    name: "get_interior_cost_noida",
    title: "Interior design cost in Noida",
    description:
      "Returns indicative full-interior budget ranges (INR) for 2BHK and 3BHK homes in Noida, Greater Noida and NCR. NestArcadia projects do not start below ₹5 lakh.",
    inputSchema: {
      type: "object",
      properties: {
        bhk: { type: "string", enum: ["2bhk", "3bhk", "4bhk"], description: "Optional home size. Omit to get all sizes." },
      },
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  },
  {
    name: "get_service_areas",
    title: "NestArcadia service areas",
    description: "Returns the cities and localities where NestArcadia takes interior design projects, with the primary focus areas first.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  },
  {
    name: "start_project_enquiry",
    title: "Start a project enquiry",
    description:
      "Returns the link and contact details for starting an interior design enquiry with NestArcadia. It does not submit anything; the person completes the brief on the website.",
    inputSchema: {
      type: "object",
      properties: {
        bhk: { type: "string", description: "Optional home size the person is asking about, for example 3BHK." },
        locality: { type: "string", description: "Optional society or locality, for example Greater Noida West." },
      },
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  },
];

function runTool(name: string, args: Record<string, unknown>) {
  if (name === "get_interior_cost_noida") {
    const key = typeof args.bhk === "string" ? args.bhk.toLowerCase().replace(/\s+/g, "") : "";
    if (key && !COSTS[key]) return { error: "Unknown bhk. Use 2bhk, 3bhk or 4bhk." };
    const data = key ? { [key]: COSTS[key] } : COSTS;
    return {
      data: { currency: "INR", minimum_project_budget: "₹5 lakh", ranges: data, indicative: true },
      source: `${SITE}/interior-design-cost-noida/`,
    };
  }
  if (name === "get_service_areas") {
    return { data: { primary: ["Greater Noida West", "Noida Extension"], areas: SERVICE_AREAS }, source: `${SITE}/interior-design-delhi-ncr/` };
  }
  if (name === "start_project_enquiry") {
    return {
      data: {
        url: `${SITE}/start-your-project/`,
        phone: "+91 84480 61997",
        whatsapp: "https://wa.me/918448061997",
        email: "info@nestarcadia.com",
        submitted: false,
        context: { bhk: args.bhk ?? null, locality: args.locality ?? null },
      },
      source: `${SITE}/contact/`,
    };
  }
  return { error: `Unknown tool: ${name}` };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version",
  "Access-Control-Max-Age": "86400",
};

type Rpc = { jsonrpc?: string; id?: string | number | null; method?: string; params?: Record<string, unknown> };

function rpcError(id: Rpc["id"], code: number, message: string) {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } };
}

function handle(msg: Rpc) {
  if (!msg || msg.jsonrpc !== "2.0" || typeof msg.method !== "string") return rpcError(msg?.id, -32600, "Invalid Request");
  const isNotification = msg.id === undefined || msg.id === null;
  if (isNotification) return null; // notifications/initialized etc. need no reply
  switch (msg.method) {
    case "initialize": {
      const requested = String(msg.params?.protocolVersion ?? "");
      const protocolVersion = SUPPORTED_PROTOCOL_VERSIONS.includes(requested) ? requested : SUPPORTED_PROTOCOL_VERSIONS[0];
      return {
        jsonrpc: "2.0",
        id: msg.id,
        result: { protocolVersion, capabilities: { tools: { listChanged: false } }, serverInfo: SERVER_INFO, instructions: INSTRUCTIONS },
      };
    }
    case "ping":
      return { jsonrpc: "2.0", id: msg.id, result: {} };
    case "tools/list":
      return { jsonrpc: "2.0", id: msg.id, result: { tools } };
    case "tools/call": {
      const name = String(msg.params?.name ?? "");
      if (!tools.some((tool) => tool.name === name)) return rpcError(msg.id, -32602, `Unknown tool: ${name}`);
      const args = (msg.params?.arguments ?? {}) as Record<string, unknown>;
      const out = runTool(name, args);
      const isError = "error" in out;
      return {
        jsonrpc: "2.0",
        id: msg.id,
        result: {
          content: [{ type: "text", text: JSON.stringify(out, null, 2) }],
          ...(isError ? { isError: true } : { structuredContent: out }),
        },
      };
    }
    default:
      return rpcError(msg.id, -32601, `Method not found: ${msg.method}`);
  }
}

export function handleBody(body: unknown) {
  if (Array.isArray(body)) {
    const replies = body.map(handle).filter((reply) => reply !== null);
    return replies.length ? replies : null;
  }
  return handle(body as Rpc);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify(rpcError(null, -32000, "Use POST with a JSON-RPC 2.0 body (Streamable HTTP)")), {
      status: 405,
      headers: { ...corsHeaders, Allow: "POST, OPTIONS", "Content-Type": "application/json" },
    });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify(rpcError(null, -32700, "Parse error")), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const reply = handleBody(body);
  if (reply === null) return new Response(null, { status: 202, headers: corsHeaders });
  return new Response(JSON.stringify(reply), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
