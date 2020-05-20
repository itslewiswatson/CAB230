import { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { unpackHttpResponse } from "./httpResponse";
import {
  AxiosResponseWithOk,
  useAxiosFetch,
  UseAxiosFetchApi,
} from "./useAxiosFetch";

export interface UseCampfireFetchOptions {
  axiosOptions?: AxiosRequestConfig;
  defer?: boolean;
}

export type UseCampfireFetchApi<T> = UseAxiosFetchApi<T> & {
  status: "initial" | "pending" | "fulfilled" | "rejected";
};

/*
 * This function needs to exist so we can be run requests
 * inside AuthContext.tsx without running into conditional
 * hook render issues that would arise otherwise.
 */
export const useCampfireFetchWithoutAuth = <ResponseType>({
  axiosOptions = {},
  defer = false,
}: UseCampfireFetchOptions): UseCampfireFetchApi<ResponseType> => {
  type ResponseBundle = {
    error: Error | undefined;
    isLoading: boolean;
    response: AxiosResponseWithOk<ResponseType> | undefined;
  };

  const [responseBundle, setResponseBundle] = useState<ResponseBundle>({
    error: undefined,
    isLoading: false,
    response: undefined,
  });

  const activateResponse = (r: AxiosResponseWithOk<ResponseType>) => {
    setResponseBundle({
      response: r,
      isLoading: false,
      error: undefined,
    });
  };

  const activateError = (e: Error) => {
    setResponseBundle({
      response: undefined,
      isLoading: false,
      error: e,
    });
  };

  const {
    run,
    reload,
    response: axiosResponse,
    error: axiosRequestError,
    ...restAxiosFetch
  } = useAxiosFetch<ResponseType>({
    axiosOptions,
    defer,
    allowErrorResponse: true,
  });

  useEffect(() => {
    const handleDataResolve = async () => {
      if (axiosResponse === undefined) return;
      try {
        await unpackHttpResponse<ResponseType>(axiosResponse);
        activateResponse(axiosResponse);
      } catch (e) {
        activateError(new Error("Something went wrong"));
      }
    };
    handleDataResolve();
  }, [axiosResponse]);

  useEffect(() => {
    // Catch timeouts and other really big broken situations
    if (axiosRequestError === undefined) return;
    activateError(new Error("Something went wrong"));
  }, [axiosRequestError]);

  const isResponseNotOk =
    restAxiosFetch.status !== "pending" &&
    responseBundle &&
    responseBundle.response &&
    !responseBundle.response.ok;

  const status = isResponseNotOk ? "rejected" : restAxiosFetch.status;

  return {
    run,
    reload,
    ...responseBundle,
    ...restAxiosFetch,
    status,
  };
};

export const useCampfireFetch = <ResponseType>({
  axiosOptions,
  defer = false,
}: UseCampfireFetchOptions): UseCampfireFetchApi<ResponseType> => {
  const { token } = useAuth();

  const authorizationAxiosOptions: AxiosRequestConfig = {
    ...axiosOptions,
    headers: {
      ...(axiosOptions ? axiosOptions.headers : {}),
      Authorization:
        token !== undefined && token !== null ? `Bearer ${token}` : undefined,
    },
  };

  return useCampfireFetchWithoutAuth<ResponseType>({
    axiosOptions: authorizationAxiosOptions,
    defer,
  });
};
