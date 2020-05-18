import { Box } from "@material-ui/core";
import React from "react";
import { BrowserRouter, Route, withRouter } from "react-router-dom";
import { Switch } from "./common/Switch";
import { AppShell } from "./global/app-shell/AppShell";
import { AuthProvider } from "./global/auth/AuthContext";
import { ApiProvider } from "./global/network/ApiContext";
import { PageNotFoundProvider } from "./global/page-not-found/PageNotFoundContext";
import { LewisThemeProvider } from "./global/theme/ThemeContext";

export const App = () => {
  return (
    <BrowserRouter>
      <PageNotFoundProvider>
        <ApiProvider>
          <AuthProvider>
            <LewisThemeProvider>
              <ShellGateway />
            </LewisThemeProvider>
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

const AppGateway = withRouter(({}) => {
  return <AppShell />;
});
