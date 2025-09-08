import { App } from "@/App";
import "@/index.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}