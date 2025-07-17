import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { MantineProvider } from '@mantine/core';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
  <MantineProvider>
    <App />
    </MantineProvider>
  </BrowserRouter>
);
