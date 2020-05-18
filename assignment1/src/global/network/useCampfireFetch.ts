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
  withAuth?: boolean;
  identityRefresh?: () => void;
}

export type UseCampfireFetchApi<T> = UseAxiosFetchApi<T> & {
  status: "initial" | "pending" | "fulfilled" | "rejected";
};

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
  if (!token) {
    throw new Error(
      `Campfire's useFetch default behaviour requires an authorization token to be returned by useAuth. 
      If you are making a request that doesn't require auth then pass withAuth: false into the useFetch options.`
    );
  }

  const authorizationAxiosOptions: AxiosRequestConfig = {
    ...axiosOptions,
    headers: {
      ...(axiosOptions ? axiosOptions.headers : {}),
      Authorization: `JWT ${token}`,
    },
  };

  return useCampfireFetchWithoutAuth<ResponseType>({
    axiosOptions: authorizationAxiosOptions,
    defer,
  });
};
