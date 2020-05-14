import React, { ReactNode, useContext, useState } from "react";

type PageNotFoundInterface = {
  pageNotFound: boolean;
  setPageNotFound: (x: boolean) => void;
};

export const PageNotFoundContext = React.createContext<
  PageNotFoundInterface | undefined
>(undefined);

export const PageNotFoundProvider = ({ children }: { children: ReactNode }) => {
  const [pageNotFound, setPageNotFound] = useState(false);

  return (
    <PageNotFoundContext.Provider value={{ pageNotFound, setPageNotFound }}>
      {children}
    </PageNotFoundContext.Provider>
  );
};

export const usePageNotFoundContext = () => {
  const pageNotFoundContext = useContext(PageNotFoundContext);
  if (!pageNotFoundContext)
    throw new Error(
      "PageNotFoundContext must be used within a PageNotFoundProvider"
    );
  return pageNotFoundContext;
};
