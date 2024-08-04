import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { TagsProvider } from "./TagsContext"; // Correct import

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <TagsProvider>
    <App />
  </TagsProvider>
);
