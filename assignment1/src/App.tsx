import { Box } from "@material-ui/core";
import React from "react";
import { BrowserRouter, Route, withRouter } from "react-router-dom";
import { Switch } from "./common/Switch";
import { AppShell } from "./global/app-shell/AppShell";
import { PageNotFoundProvider } from "./global/page-not-found/PageNotFoundContext";

export const App = () => {
  return (
    <BrowserRouter>
      <PageNotFoundProvider>
        <ShellGateway />
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

const AppGateway = withRouter(({ location }) => {
  console.log(location.pathname);
  return <AppShell />;
});
