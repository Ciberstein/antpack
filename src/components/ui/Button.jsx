"use client";

import MuiButton from "@mui/material/Button";

// Estilos por defecto para TODOS los botones de la app. Si quieres cambiar
// el look global (color, bordes, etc.), es este archivo el que tocas.
const defaultSx = {
  textTransform: "none",
  borderRadius: "8px",
  fontWeight: 500,
  backgroundColor: "#4f46e5",
  "&:hover": { backgroundColor: "#4338ca" },
};

export function Button({ variant = "contained", sx, ...props }) {
  return <MuiButton variant={variant} disableElevation sx={{ ...defaultSx, ...sx }} {...props} />;
}
