import { useContext } from "react";
import { ApiContext } from "./ApiContext";

export const useApiUrl = (): string => {
  const apiContext = useContext(ApiContext);

  if (!apiContext)
    throw new Error("UseConfig must be initiated within an ApiContextProvider");

  return apiContext.apiUrl;
};
