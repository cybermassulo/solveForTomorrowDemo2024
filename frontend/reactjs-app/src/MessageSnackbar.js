import React from "react";
import { Snackbar, Alert } from "@mui/material";

function MessageSnackbar({ open, onClose, severity, message }) {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default MessageSnackbar;
