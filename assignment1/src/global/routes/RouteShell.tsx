import React from "react";
import { Route } from "react-router-dom";
import { Switch } from "../../common/Switch";
import { FourOhFour } from "../../screens/fourohfour/FourOhFour";
import { LoginScreen } from "../../screens/login/LoginScreen";
import { RegisterScreen } from "../../screens/register/RegisterScreen";
import { AllStocksScreen } from "../../screens/stocks/AllStocksScreen";
import { IndustryStocksScreen } from "../../screens/stocks/IndustryStocksScreen";
import { usePageNotFoundContext } from "../page-not-found/PageNotFoundContext";

export const RouteShell = () => {
  const { pageNotFound } = usePageNotFoundContext();

  return (
    <Switch>
      <Route path="/register" exact render={() => <RegisterScreen />} />
      <Route path="/login" exact render={() => <LoginScreen />} />
      <Route path="/all-stocks" exact render={() => <AllStocksScreen />} />
      <Route
        path="/industry-stocks"
        exact
        render={() => <IndustryStocksScreen />}
      />
      {pageNotFound ? <Route path="*" render={() => <FourOhFour />} /> : null}
    </Switch>
  );
};
