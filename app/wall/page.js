import { createServerSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function Wall() {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("pieces")
    .select("id, title, body, created_at")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(60);

  return (
    <main>
      <section className="hero">
        <h1>The public wall</h1>
        <p className="lede">
          Only pieces marked public appear here. Private writing stays in your
          account and never enters the room.
        </p>
      </section>
      <div className="grid">
        {(data || []).map((p) => (
          <article className="card" key={p.id}>
            <h3>{p.title || "Untitled"}</h3>
            <p>{p.body.slice(0, 220)}{p.body.length > 220 ? "…" : ""}</p>
            <div className="meta">{new Date(p.created_at).toUTCString()}</div>
          </article>
        ))}
      </div>
    </main>
  );
}
