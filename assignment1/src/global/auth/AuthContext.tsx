import React, {
  createContext,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useApiUrl } from "../network/useApiUrl";
import { useCampfireFetchWithoutAuth } from "../network/useCampfireFetch";
import { getTokenFromStorage, updateToken } from "./token-storage";

export interface AuthContextInterface {
  token?: string;
  gotToken: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextInterface | undefined>(
  undefined
);

interface AuthState {
  isLoading: boolean;
  error?: string;
  password?: string;
}

const axiosOptions = {
  method: "post",
  headers: {
    "Content-Type": "application/json",
  },
};

interface TokenResponse {
  token: string;
}

interface AuthProviderInterface {
  children: ReactElement;
}

export const AuthProvider = (props: AuthProviderInterface) => {
  const [gotToken, setGotToken] = useState(false);
  const [token, setToken] = useState<string | undefined>();
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: undefined,
    password: undefined,
  });

  useEffect(() => {
    getTokenFromStorage()
      .then((tokenFromStorage) => setToken(tokenFromStorage))
      .finally(() => setGotToken(true));
  }, []);

  const setErrorAuthState = useCallback(
    (status?: number) => {
      setAuthState({
        ...authState,
        isLoading: false,
        error: status
          ? "getErrorMessageFromStatusCode(status)"
          : "Something went wrong, please try again later",
      });
    },
    [setAuthState, authState]
  );

  const apiUrl = useApiUrl();

  const {
    run: runLogin,
    error: loginError,
    isLoading: loginIsLoading,
  } = useCampfireFetchWithoutAuth<TokenResponse>({
    defer: true,
  });

  const login = useCallback(
    (email: string, password: string) => {
      setAuthState({
        password,
        isLoading: true,
        error: undefined,
      });
      runLogin({
        ...axiosOptions,
        url: `${apiUrl}/user/login`,
        data: {
          email,
          password,
        },
      }).then((response) => {
        if (!response) return;
        if (response.status !== 200) {
          setErrorAuthState(response.status);
          return;
        }
        setToken(response.data.token);
      });
    },
    [apiUrl, runLogin, setErrorAuthState]
  );

  useEffect(() => {
    if (loginError && !loginIsLoading) {
      setErrorAuthState();
    }
  }, [loginError, loginIsLoading, setErrorAuthState]);

  // useEffect(() => {}, []);

  const logout = useCallback(() => {
    updateToken(undefined).finally(() => {
      const appUrl = "localhost:3000";
      window.location.replace(`${appUrl}/login`);
    });
  }, []);

  const value = useMemo(() => {
    return {
      token,
      login,
      gotToken,
      logout,
    };
  }, [token, login, gotToken, logout]);

  return <AuthContext.Provider value={value} {...props} />;
};
