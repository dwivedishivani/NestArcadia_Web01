import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono().basePath("/server");

const supabase = () => createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// Admin password - in production, use environment variable
const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD") || "nestarcadia2024";

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Admin-Password", "apikey", "x-client-info"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// Admin auth middleware
const verifyAdmin = (c: any, next: any) => {
  const password = c.req.header("X-Admin-Password");
  if (password !== ADMIN_PASSWORD) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  return next();
};

// Health check endpoint
app.get("/make-server-078be9eb/health", (c) => {
  return c.json({ status: "ok" });
});

// Admin login verification
app.post("/make-server-078be9eb/admin/login", async (c) => {
  const { password } = await c.req.json();
  if (password === ADMIN_PASSWORD) {
    return c.json({ success: true });
  }
  return c.json({ error: "Invalid password" }, 401);
});

// ============== ENQUIRIES ENDPOINTS ==============

// Submit enquiry (public)
app.post("/make-server-078be9eb/enquiries", async (c) => {
  try {
    const body = await c.req.json();
    const db = supabase();
    
    const { data, error } = await db.from("enquiries_078be9eb").insert({
      name: body.name,
      email: body.email,
      phone: body.phone,
      city: body.city,
      project_type: body.project_type,
      configuration: body.configuration,
      budget: body.budget,
      timeline: body.timeline,
      design_style: body.design_style,
      message: body.message,
      source: body.source,
      status: "new",
      created_at: new Date().toISOString(),
    });
    
    if (error) throw error;
    return c.json({ success: true, data });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// Get all enquiries (admin only)
app.get("/make-server-078be9eb/admin/enquiries", verifyAdmin, async (c) => {
  try {
    const db = supabase();
    const { data, error } = await db
      .from("enquiries_078be9eb")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return c.json({ data });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// Update enquiry status (admin only)
app.put("/make-server-078be9eb/admin/enquiries/:id", verifyAdmin, async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const db = supabase();
    
    const { data, error } = await db
      .from("enquiries_078be9eb")
      .update({ status: body.status, notes: body.notes })
      .eq("id", id);
    
    if (error) throw error;
    return c.json({ success: true, data });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// Delete enquiry (admin only)
app.delete("/make-server-078be9eb/admin/enquiries/:id", verifyAdmin, async (c) => {
  try {
    const id = c.req.param("id");
    const db = supabase();
    
    const { error } = await db
      .from("enquiries_078be9eb")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ============== BLOGS/JOURNAL ENDPOINTS ==============

// Get all blogs (public - for journal page)
app.get("/make-server-078be9eb/blogs", async (c) => {
  try {
    const db = supabase();
    const { data, error } = await db
      .from("blogs_078be9eb")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    
    if (error) throw error;
    return c.json({ data });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// Get single blog by slug (public)
app.get("/make-server-078be9eb/blogs/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");
    const db = supabase();
    const { data, error } = await db
      .from("blogs_078be9eb")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    
    if (error) throw error;
    return c.json({ data });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// Get all blogs including drafts (admin only)
app.get("/make-server-078be9eb/admin/blogs", verifyAdmin, async (c) => {
  try {
    const db = supabase();
    const { data, error } = await db
      .from("blogs_078be9eb")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return c.json({ data });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// Create blog (admin only)
app.post("/make-server-078be9eb/admin/blogs", verifyAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const db = supabase();
    
    const { data, error } = await db.from("blogs_078be9eb").insert({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category,
      author: body.author,
      image_url: body.image_url,
      status: body.status || "draft",
      read_time: body.read_time,
      tags: body.tags,
      created_at: new Date().toISOString(),
      published_at: body.status === "published" ? new Date().toISOString() : null,
    }).select();
    
    if (error) throw error;
    return c.json({ success: true, data });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// Update blog (admin only)
app.put("/make-server-078be9eb/admin/blogs/:id", verifyAdmin, async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const db = supabase();
    
    const updateData: any = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category,
      author: body.author,
      image_url: body.image_url,
      status: body.status,
      read_time: body.read_time,
      tags: body.tags,
      updated_at: new Date().toISOString(),
    };
    
    // Set published_at when publishing for the first time
    if (body.status === "published" && !body.published_at) {
      updateData.published_at = new Date().toISOString();
    }
    
    const { data, error } = await db
      .from("blogs_078be9eb")
      .update(updateData)
      .eq("id", id)
      .select();
    
    if (error) throw error;
    return c.json({ success: true, data });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// Delete blog (admin only)
app.delete("/make-server-078be9eb/admin/blogs/:id", verifyAdmin, async (c) => {
  try {
    const id = c.req.param("id");
    const db = supabase();
    
    const { error } = await db
      .from("blogs_078be9eb")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ============== HOMES/PORTFOLIO ENDPOINTS ==============

// Get all homes (public - for homes page)
app.get("/make-server-078be9eb/homes", async (c) => {
  try {
    const db = supabase();
    const { data, error } = await db
      .from("homes_078be9eb")
      .select("*")
      .eq("status", "published")
      .order("display_order", { ascending: true });
    
    if (error) throw error;
    return c.json({ data });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// Get all homes including unpublished (admin only)
app.get("/make-server-078be9eb/admin/homes", verifyAdmin, async (c) => {
  try {
    const db = supabase();
    const { data, error } = await db
      .from("homes_078be9eb")
      .select("*")
      .order("display_order", { ascending: true });
    
    if (error) throw error;
    return c.json({ data });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// Create home (admin only)
app.post("/make-server-078be9eb/admin/homes", verifyAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const db = supabase();
    
    const { data, error } = await db.from("homes_078be9eb").insert({
      name: body.name,
      location: body.location,
      type: body.type,
      area: body.area,
      style: body.style,
      description: body.description,
      gallery_images: body.gallery_images || [],
      status: body.status || "published",
      display_order: body.display_order || 0,
      created_at: new Date().toISOString(),
    }).select();
    
    if (error) throw error;
    return c.json({ success: true, data });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// Update home (admin only)
app.put("/make-server-078be9eb/admin/homes/:id", verifyAdmin, async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const db = supabase();
    
    const { data, error } = await db
      .from("homes_078be9eb")
      .update({
        name: body.name,
        location: body.location,
        type: body.type,
        area: body.area,
        style: body.style,
        description: body.description,
        gallery_images: body.gallery_images,
        status: body.status,
        display_order: body.display_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();
    
    if (error) throw error;
    return c.json({ success: true, data });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// Delete home (admin only)
app.delete("/make-server-078be9eb/admin/homes/:id", verifyAdmin, async (c) => {
  try {
    const id = c.req.param("id");
    const db = supabase();
    
    const { error } = await db
      .from("homes_078be9eb")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    return c.json({ success: true });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

Deno.serve(app.fetch);