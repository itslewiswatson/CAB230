import React from "react";
import { Route } from "react-router-dom";
import { getAppUrlFromWindowLocation } from "../../common/get-app-url";
import { Switch } from "../../common/Switch";
import { CompanyInfoScreen } from "../../screens/company/CompanyInfoScreen";
import { FourOhFour } from "../../screens/fourohfour/FourOhFour";
import { PriceHistoryScreen } from "../../screens/history/PriceHistoryScreen";
import { LoginScreen } from "../../screens/login/LoginScreen";
import { RegisterScreen } from "../../screens/register/RegisterScreen";
import { AllStocksScreen } from "../../screens/stocks/AllStocksScreen";
import { IndustryStocksScreen } from "../../screens/stocks/IndustryStocksScreen";
import { useAuth } from "../auth/useAuth";
import { usePageNotFoundContext } from "../page-not-found/PageNotFoundContext";

export const RouteShell = () => {
  const { pageNotFound } = usePageNotFoundContext();
  const { logout } = useAuth();

  return (
    <Switch>
      <Route
        path="/"
        exact
        render={() => (
          <>
            {window.location.replace(
              `${getAppUrlFromWindowLocation()}/all-stocks`
            )}
          </>
        )}
      />
      <Route path="/company-information" render={() => <CompanyInfoScreen />} />
      <Route path="/register" exact render={() => <RegisterScreen />} />
      <Route path="/login" exact render={() => <LoginScreen />} />
      <Route
        path="/logout"
        exact
        render={() => {
          logout();
          return <></>;
        }}
      />
      <Route path="/all-stocks" exact render={() => <AllStocksScreen />} />
      <Route
        path="/industry-stocks"
        exact
        render={() => <IndustryStocksScreen />}
      />
      <Route
        path="/price-history"
        exact
        render={() => <PriceHistoryScreen />}
      />
      {pageNotFound ? <Route path="*" render={() => <FourOhFour />} /> : null}
    </Switch>
  );
};
