"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function Account() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [mine, setMine] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
      if (data.user) loadMine(supabase, data.user.id);
    });
  }, []);

  async function loadMine(supabase, uid) {
    const { data } = await supabase
      .from("pieces")
      .select("id, title, body, is_public, created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    setMine(data || []);
  }

  async function sendLink(e) {
    e.preventDefault();
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setMsg(error ? error.message : "Check your email for the sign-in link.");
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setMine([]);
  }

  async function togglePublic(p) {
    const supabase = createClient();
    await supabase.from("pieces").update({ is_public: !p.is_public }).eq("id", p.id);
    if (user) loadMine(supabase, user.id);
  }

  if (!user) {
    return (
      <main>
        <section className="hero">
          <h1>Sign in</h1>
          <p className="lede">
            Magic link only. No password to remember. Your private pieces stay
            off the wall until you say otherwise.
          </p>
        </section>
        <form className="auth" onSubmit={sendLink}>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Send link</button>
          {msg ? <p className="notice">{msg}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main>
      <section className="hero">
        <h1>Your desk</h1>
        <p className="lede">{user.email}</p>
        <button onClick={signOut} style={{ marginTop: 16 }}>Sign out</button>
      </section>
      <div className="grid">
        {mine.map((p) => (
          <article className="card" key={p.id}>
            <h3>{p.title || "Untitled"}</h3>
            <p>{p.body.slice(0, 180)}{p.body.length > 180 ? "…" : ""}</p>
            <div className="meta">{p.is_public ? "Public" : "Private"}</div>
            <button onClick={() => togglePublic(p)} style={{ marginTop: 12 }}>
              {p.is_public ? "Make private" : "Make public"}
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}
