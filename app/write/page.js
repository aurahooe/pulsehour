"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function Write() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [msg, setMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMsg("Sign in first from Account.");
      return;
    }
    const { error } = await supabase.from("pieces").insert({
      user_id: user.id,
      title: title.trim() || null,
      body: body.trim(),
      is_public: isPublic,
    });
    if (error) setMsg(error.message);
    else {
      setMsg(isPublic ? "On the wall." : "Saved privately.");
      setTitle("");
      setBody("");
    }
  }

  return (
    <main>
      <section className="hero">
        <h1>Write a piece</h1>
        <p className="lede">
          Keep it for yourself, or mark it public. Public pieces can be featured
          on the hour.
        </p>
      </section>
      <form className="compose" onSubmit={onSubmit}>
        <input
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          required
          placeholder="What belongs to this hour?"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <label className="check">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          Show this to the public
        </label>
        <button type="submit">Save piece</button>
        {msg ? <p className="notice">{msg}</p> : null}
      </form>
    </main>
  );
}
