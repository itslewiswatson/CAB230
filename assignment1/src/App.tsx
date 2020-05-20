import MomentUtils from "@date-io/moment";
import { Box } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { Switch } from "./common/Switch";
import { AppShell } from "./global/app-shell/AppShell";
import { AuthProvider } from "./global/auth/AuthContext";
import { ApiProvider } from "./global/network/ApiContext";
import { PageNotFoundProvider } from "./global/page-not-found/PageNotFoundContext";
import { SnackbarProvider } from "./global/snackbar/SnackbarContext";
import { ThemeProvider } from "./global/theme/ThemeContext";

export const App = () => {
  return (
    <BrowserRouter>
      <PageNotFoundProvider>
        <ApiProvider>
          <AuthProvider>
            <ThemeProvider>
              <QueryParamProvider>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <SnackbarProvider>
                    <ShellGateway />
                  </SnackbarProvider>
                </MuiPickersUtilsProvider>
              </QueryParamProvider>
            </ThemeProvider>
          </AuthProvider>
        </ApiProvider>
      </PageNotFoundProvider>
    </BrowserRouter>
  );
};

const ShellGateway = () => {
  return (
    <Box>
      <Switch>
        <Route path="*" render={() => <AppGateway />} />
      </Switch>
    </Box>
  );
};

const AppGateway = () => {
  return <AppShell />;
};
