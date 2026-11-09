import { useEffect, useState } from "react";
import client from "../api/client";

export function useBackendOffline() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    client.get("/capi", { timeout: 3000 }).catch(() => setOffline(true));
  }, []);

  return offline;
}
