import { useEffect, useState } from "react";

export function useApiResource(loader, fallback, dependencies = []) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await loader();
      setData(result);
      setUsingFallback(false);
    } catch (err) {
      setData(fallback);
      setUsingFallback(true);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // The caller owns refresh dependencies so inline endpoint loaders stay ergonomic.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, setData, loading, error, usingFallback, reload: load };
}
