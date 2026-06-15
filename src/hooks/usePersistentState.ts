import { useEffect, useState } from "react";

/** String state mirrored to localStorage, so it survives reloads and remounts. */
export function usePersistentState(key: string, initial: string) {
  const [value, setValue] = useState(
    () => window.localStorage.getItem(key) ?? initial,
  );

  useEffect(() => {
    window.localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}
