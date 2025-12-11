import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { createCtx } from "@reatom/framework";
import { reatomContext } from "@reatom/npm-react";
import "./index.css";
import App from "./app/App.tsx";
import { queryClient } from "./api/queryClient";

const ctx = createCtx();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <reatomContext.Provider value={ctx}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </reatomContext.Provider>
  </StrictMode>
);
