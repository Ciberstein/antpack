"use client";

import MuiTextField from "@mui/material/TextField";

// Igual que Button: un solo lugar para cambiar el estilo de todos los
// inputs, selects y textareas de la app.
const defaultSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
  },
};

export function Input({ sx, ...props }) {
  return <MuiTextField size="small" fullWidth sx={{ ...defaultSx, ...sx }} {...props} />;
}
