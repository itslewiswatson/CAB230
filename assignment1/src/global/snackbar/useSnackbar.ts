import { useContext } from "react";
import { SnackbarContext, SnackbarContextInterface } from "./SnackbarContext";

export const useSnackbar = (): SnackbarContextInterface => {
  const snackbarContext = useContext(SnackbarContext);
  if (!snackbarContext) {
    throw new Error("UseConfig must be initiated within an AppContextProvider");
  }
  return snackbarContext;
};
