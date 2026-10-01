"use client";

import { useEffect, useState } from "react";

export default function Flip({ ms }) {
  const [left, setLeft] = useState(ms);
  useEffect(() => {
    const t = setInterval(() => setLeft((v) => Math.max(0, v - 1000)), 1000);
    return () => clearInterval(t);
  }, []);
  const s = Math.floor(left / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return (
    <span className="tick">
      Turns in {String(m).padStart(2, "0")}:{String(sec).padStart(2, "0")}
    </span>
  );
}
