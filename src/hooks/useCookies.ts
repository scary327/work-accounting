import Cookies from "js-cookie";
import { useState, useCallback } from "react";

export const useCookies = (key: string, initialValue?: string) => {
  const [item, setItem] = useState<string | undefined>(() => {
    return Cookies.get(key) || initialValue;
  });

  const updateItem = useCallback(
    (value: string, options?: Cookies.CookieAttributes) => {
      setItem(value);
      Cookies.set(key, value, options);
    },
    [key]
  );

  const removeItem = useCallback(() => {
    setItem(undefined);
    Cookies.remove(key);
  }, [key]);

  return { item, updateItem, removeItem };
};
