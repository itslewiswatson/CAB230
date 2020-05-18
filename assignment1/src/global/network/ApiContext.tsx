import React, { createContext } from "react";

const apiUrl = "http://131.181.190.87:3000";

export interface ApiContextInterface {
  apiUrl: string;
}

export const ApiContext = createContext<ApiContextInterface | undefined>(
  undefined
);

interface ApiProviderInterface {
  children: React.ReactNode;
}

export const ApiProvider = (props: ApiProviderInterface) => {
  const value: ApiContextInterface = {
    apiUrl,
  };

  return <ApiContext.Provider value={value} {...props} />;
};
