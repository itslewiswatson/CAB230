import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import React, { ReactElement } from "react";

export const LewisThemeProvider = (props: { children: ReactElement }) => {
  const theme = createMuiTheme({
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
    },
  });

  return <ThemeProvider theme={theme} {...props} />;
};
