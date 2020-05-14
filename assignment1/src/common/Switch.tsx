import React, { ReactNode } from "react";
import { Route, Switch as ReactSwitch } from "react-router-dom";
import { usePageNotFoundContext } from "../global/PageNotFoundContext";

interface SwitchProps {
  children: ReactNode;
}

export const Switch = (props: SwitchProps) => {
  const { children } = props;
  const { setPageNotFound } = usePageNotFoundContext();

  return (
    <ReactSwitch>
      {children}
      <Route
        path="*"
        render={() => {
          setPageNotFound(true);
          return null;
        }}
      />
    </ReactSwitch>
  );
};
