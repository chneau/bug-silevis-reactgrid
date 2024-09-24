import { createRoot } from "react-dom/client";
import { GridExample } from "./GridExample";
import "normalize.css/normalize.css";
import "@silevis/reactgrid/styles.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");
const root = createRoot(rootEl);
root.render(<GridExample />);
