import { useContext } from "react";
import { AuthContext, AuthContextInterface } from "./AuthContext";

export const useAuth = (): AuthContextInterface => {
  const authContext = useContext(AuthContext);
  if (!authContext)
    throw new Error("useAuth must be used within an AuthContextProvider");
  return authContext;
};
