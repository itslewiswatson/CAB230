import React, {
  createContext,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getAppUrlFromWindowLocation } from "../../common/get-app-url";
import { useApiUrl } from "../network/useApiUrl";
import { useCustomFetchWithoutAuth } from "../network/useCustomFetch";

export interface AuthContextInterface {
  isLoggedIn: boolean;
  token?: string;
  login: (email: string, password: string) => void;
  logout: () => void;
  authState: {
    isLoading: boolean;
    error?: string;
    password?: string;
  };
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

const getErrorMessageFromStatusCode = (code: number) => {
  if (code === 401) {
    return "Incorrect email address or password";
  }
  if (code === 500) {
    return "An unknown error occurred. Try again later.";
  }
};

export const AuthProvider = (props: AuthProviderInterface) => {
  const apiUrl = useApiUrl();

  const [token, setToken] = useState<string | undefined>(
    localStorage.getItem("token") ?? undefined
  );

  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: undefined,
    password: undefined,
  });

  useEffect(() => {
    if (!token) {
      localStorage.clear();
      return;
    }
    localStorage.setItem("token", token);
  }, [token]);

  const setErrorAuthState = useCallback(
    (status?: number) => {
      setAuthState({
        ...authState,
        isLoading: false,
        error: status
          ? getErrorMessageFromStatusCode(status)
          : "Something went wrong, please try again later",
      });
    },
    [setAuthState, authState]
  );

  const isLoggedIn = useMemo(() => {
    return token !== undefined && token !== null && token.length > 0;
  }, [token]);

  const {
    run: runLogin,
    error: loginError,
    isLoading: loginIsLoading,
  } = useCustomFetchWithoutAuth<TokenResponse>({
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
        setAuthState({
          isLoading: false,
          error: undefined,
          password: undefined,
        });
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

  const logout = useCallback(() => {
    setToken(undefined);
    const appUrl = getAppUrlFromWindowLocation();
    window.location.replace(`${appUrl}/login`);
  }, []);

  const value = useMemo(() => {
    return {
      isLoggedIn,
      token,
      login,
      logout,
      authState,
    };
  }, [isLoggedIn, token, login, logout, authState]);

  return <AuthContext.Provider value={value} {...props} />;
};
