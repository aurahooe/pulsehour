import { createServerSupabase, hourKey, hoursUntilFlip } from "@/lib/supabase";
import Flip from "./flip";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServerSupabase();
  const key = hourKey();
  const { data: feature } = await supabase
    .from("hourly_features")
    .select("curator_note, piece_id, pieces(title, body, created_at)")
    .eq("hour_key", key)
    .maybeSingle();

  let piece = feature?.pieces;
  if (!piece) {
    const { data: publics } = await supabase
      .from("pieces")
      .select("title, body, created_at")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(24);
    const list = publics || [];
    if (list.length) {
      const idx = Number(key.replace(/\D/g, "").slice(-6)) % list.length;
      piece = list[idx];
    }
  }

  return (
    <main>
      <section className="hero">
        <h1>What this hour<br />is willing to keep.</h1>
        <p className="lede">
          Pulsehour is a small public wall. Write something. Keep it private, or
          mark it public and let it stand in the room with everyone else. Every
          hour the featured piece turns.
        </p>
      </section>
      <div className="hourbar">
        <span className="tick">Hour {key}</span>
        <Flip ms={hoursUntilFlip()} />
      </div>
      <section className="featured">
        <div className="kicker">Now on the wall</div>
        {piece ? (
          <>
            <h2>{piece.title || "Untitled"}</h2>
            <div className="body">{piece.body}</div>
            {feature?.curator_note ? (
              <p className="meta">{feature.curator_note}</p>
            ) : null}
          </>
        ) : (
          <h2>The wall is empty for this hour. Write the first piece.</h2>
        )}
      </section>
    </main>
  );
}
