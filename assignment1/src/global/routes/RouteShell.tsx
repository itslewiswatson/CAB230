import React from "react";
import { Route } from "react-router-dom";
import { Switch } from "../../common/Switch";
import { LoginScreen } from "../../screens/login/LoginScreen";
import { RegisterScreen } from "../../screens/register/RegisterScreen";

export const RouteShell = () => {
  return (
    <Switch>
      <Route path="/register" render={() => <RegisterScreen />} />
      <Route path="/login" render={() => <LoginScreen />} />
    </Switch>
  );
};
