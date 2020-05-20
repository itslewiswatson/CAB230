import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import React, { ReactElement } from "react";

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#796fff",
      light: "#af9dff",
      dark: "#635ac7",
      contrastText: "#fff",
    },
    secondary: {
      main: "#FF664D",
      light: "#ff987a",
      dark: "#c63223",
      contrastText: "#fff",
    },
    error: {
      light: "rgb(255, 105, 105)",
      main: "#EF5350",
      dark: "#F44336",
    },
    success: {
      light: "rgb(125, 210, 104)",
      main: "#4CAF50",
      dark: "#43A047",
    },
    action: {
      disabled: "rgba(0, 0, 0, 0.26)",
      disabledBackground: "rgba(0, 0, 0, 0.12)",
    },
  },
});

export const ThemeProvider = (props: { children: ReactElement }) => {
  return <MuiThemeProvider theme={theme} {...props} />;
};
