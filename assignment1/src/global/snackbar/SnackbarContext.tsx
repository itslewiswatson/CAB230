import Snackbar, {
  SnackbarCloseReason,
  SnackbarProps,
} from "@material-ui/core/Snackbar";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

interface GlobalSnackbarProps {
  className?: string;
  message?: string;
  Icon?: React.ReactNode;
  autoHideDuration?: number;
  action?: React.ReactNode;
}

export type SnackbarContextProps = GlobalSnackbarProps & SnackbarProps;
export interface SnackbarContextInterface {
  setSnackbar: Dispatch<SetStateAction<SnackbarContextProps | undefined>>;
}

export const SnackbarContext = createContext<
  SnackbarContextInterface | undefined
>(undefined);

export interface SnackbarProviderProps {
  children: React.ReactNode;
}

const DEFAULT_AUTO_HIDE = 3000;
const DEFAULT_AUTO_HIDE_WITH_ACTION = 6000;

const GlobalSnackbar = ({
  open,
  setSnackbar,
  message,
  Icon,
  onClose,
  autoHideDuration,
  action,
  ...rest
}: SnackbarContextProps & SnackbarContextInterface) => {
  const handleClose = (
    event: React.SyntheticEvent<any>,
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;
    if (onClose) onClose(event, reason);
    setSnackbar((prevSnackbar) => {
      if (!prevSnackbar) return prevSnackbar;
      return {
        ...prevSnackbar,
        open: false,
      };
    });
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={open}
      autoHideDuration={
        autoHideDuration ??
        (action ? DEFAULT_AUTO_HIDE_WITH_ACTION : DEFAULT_AUTO_HIDE)
      }
      onClose={handleClose}
      message={message}
      {...rest}
    />
  );
};

export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  const [snackbar, setSnackbar] = useState<
    GlobalSnackbarProps & SnackbarProps
  >();

  return (
    <SnackbarContext.Provider value={{ setSnackbar }}>
      {children}
      {snackbar ? (
        <GlobalSnackbar {...snackbar} setSnackbar={setSnackbar} />
      ) : null}
    </SnackbarContext.Provider>
  );
};
