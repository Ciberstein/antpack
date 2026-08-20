"use client";

import { createTheme } from "@mui/material/styles";

// Tema oscuro para MUI, para que Input/Button/Select se vean bien sobre
// el fondo negro del dashboard.
export const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0a0a0f",
      paper: "#13131a",
    },
    primary: {
      main: "#6366f1",
    },
  },
  shape: {
    borderRadius: 8,
  },
});
