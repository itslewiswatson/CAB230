import React from "react";
import { Route } from "react-router-dom";
import { Switch } from "../../common/Switch";
import { FourOhFour } from "../../screens/fourohfour/FourOhFour";
import { LoginScreen } from "../../screens/login/LoginScreen";
import { RegisterScreen } from "../../screens/register/RegisterScreen";
import { StocksScreen } from "../../screens/stocks/StocksScreen";
import { usePageNotFoundContext } from "../page-not-found/PageNotFoundContext";

export const RouteShell = () => {
  const { pageNotFound } = usePageNotFoundContext();

  return (
    <Switch>
      <Route path="/register" exact render={() => <RegisterScreen />} />
      <Route path="/login" exact render={() => <LoginScreen />} />
      <Route path="/stocks" exact render={() => <StocksScreen />} />
      {pageNotFound ? <Route path="*" render={() => <FourOhFour />} /> : null}
    </Switch>
  );
};
