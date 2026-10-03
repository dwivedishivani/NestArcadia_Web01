import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD") || "nestarcadia2024";
const BUCKET = "site-images";
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, X-Admin-Password",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function admin(req: Request) {
  return req.headers.get("X-Admin-Password") === ADMIN_PASSWORD;
}

function slugify(value: string) {
  return value.normalize("NFKD").replace(/[^\w\s-]/g, "").trim().toLowerCase().replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

function extensionFor(type: string, name: string) {
  const fromName = name.toLowerCase().match(/\.(jpe?g|png|webp)$/)?.[1];
  if (fromName) return fromName === "jpeg" ? "jpg" : fromName;
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

function publicUrl(path: string) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

async function listAssets() {
  const { data, error } = await supabase.from("site_image_assets").select("*").order("page", { ascending: true }).order("category", { ascending: true }).order("display_name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

async function suggestMetadata(body: Record<string, string>) {
  const parts = [body.page, body.section, body.category, body.subject, body.location].map((v) => (v || "").trim()).filter(Boolean);
  const base = parts.join(" ") || "NestArcadia interior design";
  const filename = slugify(base).replace(/-+/g, "-").slice(0, 100) + ".jpg";
  const alt = [body.subject, body.section, body.page, body.location].map((v) => (v || "").trim()).filter(Boolean).join(" ");
  return {
    seo_file_name: filename,
    alt_text: alt || "NestArcadia interior design",
    note: "SEO suggestion is based on supplied page/section context. Visual AI captioning can be enabled separately with a vision model.",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = new URL(req.url);
  const pathname = url.pathname;
  const path = pathname.endsWith("/images") ? "/images" : pathname.endsWith("/admin/images") ? "/admin/images" : pathname.includes("/admin/images/") ? pathname.slice(pathname.lastIndexOf("/admin/images/")) : pathname;

  try {
    if (req.method === "GET" && path === "/images") return json({ data: await listAssets() });

    if (req.method === "GET" && path.startsWith("/image/")) {
      const sourceKey = decodeURIComponent(path.slice("/image/".length));
      if (!sourceKey) return json({ error: "source_key is required" }, 400);
      const { data: asset, error: assetError } = await supabase
        .from("site_image_assets")
        .select("public_url")
        .eq("source_key", sourceKey)
        .maybeSingle();
      if (assetError) throw assetError;
      if (!asset?.public_url) return json({ error: "Image not found" }, 404);

      const imageResponse = await fetch(asset.public_url);
      if (!imageResponse.ok || !imageResponse.body) return json({ error: "Stored image unavailable" }, 502);
      return new Response(imageResponse.body, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": imageResponse.headers.get("content-type") || "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    if (path.startsWith("/admin/") && !admin(req)) return json({ error: "Unauthorized" }, 401);

    if (req.method === "GET" && path === "/admin/images") return json({ data: await listAssets() });

    if (req.method === "POST" && path === "/admin/images/suggest") return json({ data: await suggestMetadata(await req.json()) });

    if (req.method === "POST" && path === "/admin/images/upload") {
      const form = await req.formData();
      const file = form.get("file");
      if (!(file instanceof File)) return json({ error: "Image file is required" }, 400);
      if (!file.type.startsWith("image/")) return json({ error: "Only image files are allowed" }, 400);
      if (file.size > 15 * 1024 * 1024) return json({ error: "Image must be 15MB or smaller" }, 400);

      const sourceKey = String(form.get("source_key") || "").trim();
      if (!sourceKey) return json({ error: "source_key is required" }, 400);

      const displayName = String(form.get("display_name") || "Website image").trim();
      const page = String(form.get("page") || "Website").trim();
      const section = String(form.get("section") || "").trim();
      const category = String(form.get("category") || page).trim();
      const altText = String(form.get("alt_text") || "").trim();
      const suggestedName = String(form.get("seo_file_name") || "").trim();
      const extension = extensionFor(file.type, file.name);
      const baseName = slugify(suggestedName.replace(/\.[^.]+$/, "") || displayName || "nestarcadia-interior");
      const seoFileName = `${baseName}.${extension}`;

      const existing = await supabase.from("site_image_assets").select("id, internal_name").eq("source_key", sourceKey).maybeSingle();
      if (existing.error) throw existing.error;

      const internalName = existing.data?.internal_name || `site.${slugify(page)}.${slugify(section || displayName)}`;
      const version = new Date().toISOString().replace(/[^0-9]/g, "");
      const storagePath = `${slugify(page)}/${baseName}-${version}.${extension}`;

      const upload = await supabase.storage.from(BUCKET).upload(storagePath, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
      if (upload.error) throw upload.error;

      const record = {
        source_key: sourceKey,
        internal_name: internalName,
        display_name: displayName,
        category,
        page,
        section,
        alt_text: altText,
        seo_file_name: seoFileName,
        local_path: `/images/site/${sourceKey}.jpg`,
        storage_path: storagePath,
        public_url: publicUrl(storagePath),
        mime_type: file.type,
        updated_at: new Date().toISOString(),
      };

      const saved = await supabase.from("site_image_assets").upsert(record, { onConflict: "source_key" }).select().single();
      if (saved.error) throw saved.error;

      return json({ success: true, data: saved.data });
    }

    if (req.method === "PUT" && path.startsWith("/admin/images/")) {
      const id = path.split("/").pop();
      const body = await req.json();
      const saved = await supabase.from("site_image_assets").update({
        display_name: body.display_name,
        category: body.category,
        page: body.page,
        section: body.section,
        alt_text: body.alt_text,
        seo_file_name: body.seo_file_name,
        updated_at: new Date().toISOString(),
      }).eq("id", id).select().single();
      if (saved.error) throw saved.error;
      return json({ success: true, data: saved.data });
    }

    return json({ error: "Not found" }, 404);
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : "Unexpected error" }, 500);
  }
});
