import { useEffect, useState } from "react";

let _cache = null;
let _pending = null;

async function fetchContent() {
  const res = await fetch("/content.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load content.json");
  return res.json();
}

export function useContent() {
  const [content, setContent] = useState(_cache);
  const [loading, setLoading] = useState(!_cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (_cache) return;
    if (!_pending) _pending = fetchContent();
    _pending
      .then((data) => {
        _cache = data;
        setContent(data);
      })
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, []);

  return { content, loading, error };
}
