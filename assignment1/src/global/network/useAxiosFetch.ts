import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useAsync } from "react-async";

const defaultTimeout = -1;

export type AxiosResponseWithOk<T> = AxiosResponse<T> & { ok: boolean };

export interface UseAxiosFetchOptions {
  axiosOptions?: AxiosRequestConfig;
  defer?: boolean;
  allowErrorResponse?: boolean;
}

export interface ReturnApi<ResponseType> {
  run: (
    axiosOptions: AxiosRequestConfig
  ) => Promise<AxiosResponseWithOk<ResponseType>>;
  counter: number;
  reload: () => any;
  isLoading: boolean;
  response: AxiosResponseWithOk<ResponseType> | undefined;
  error: Error | undefined;
  startedAt: Date | undefined;
  finishedAt: Date | undefined;
  status: "initial" | "pending" | "fulfilled" | "rejected";
  isInitial: boolean;
  isPending: boolean;
  isFulfilled: boolean;
  isResolved: boolean;
  isRejected: boolean;
  isSettled: boolean;
}

export type UseAxiosFetchApi<ResponseType> = ReturnApi<ResponseType>;

export const useAxiosFetch = <ResponseType>({
  axiosOptions = {},
  defer = false,
  allowErrorResponse = false,
}: UseAxiosFetchOptions): UseAxiosFetchApi<ResponseType> => {
  /**
   * We are using a semi-concrete Axios implementation as we want to abuse
   * AxiosRequestConfig objects. We are optimistically hoping to catch the Axios Response data in the shape of ResponseType
   */
  const axiosFetch = async (
    args: any[]
  ): Promise<AxiosResponseWithOk<ResponseType>> => {
    let runAxiosOptions = axiosOptions;
    if (defer) {
      [runAxiosOptions] = args;
    }

    try {
      /**
       * We merge headers separately here to support the withAuth option.
       * Any other AxiosRequestConfig props which are extended within useFetch will need to be deep merged here manually as well.
       */
      const response = await Axios.request({
        timeout: defaultTimeout,
        ...runAxiosOptions,
        headers: {
          ...runAxiosOptions.headers,
          ...axiosOptions.headers,
        },
      });
      return { ...response, ok: true };
    } catch (error) {
      /**
       * We have the options to huck the response up to the next level even if it was not a
       * 2xx status. We do this so that we can handle well formatted error responses in our useCampfireFetch, but by default we want axios to behave normally.
       */
      if (!allowErrorResponse || !error.response) {
        throw error;
      }
      return { ...error.response, ok: false };
    }
  };

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
    data: axiosResponse,
    error: axiosRequestError,
    status,
    ...restUseAsync
  } = useAsync<AxiosResponseWithOk<ResponseType>>({
    deferFn: axiosFetch,
  });

  useEffect(() => {
    if (status === "pending") {
      setResponseBundle({
        response: undefined,
        isLoading: responseBundle.isLoading,
        error: undefined,
      });
    }
  }, [status, responseBundle.isLoading]);

  useEffect(() => {
    const handleDataResolve = async () => {
      if (
        !defer &&
        axiosResponse === undefined &&
        axiosRequestError === undefined
      ) {
        run(axiosOptions);
        return;
      }
      if (axiosResponse === undefined) {
        return;
      }
      try {
        activateResponse(axiosResponse);
      } catch (e) {
        activateError(e);
      }
    };
    handleDataResolve();
    // eslint-disable-next-line
  }, [axiosResponse]);

  useEffect(() => {
    // Catch timeouts and other really big broken situations
    if (axiosRequestError === undefined) return;
    activateError(axiosRequestError);
  }, [axiosRequestError]);

  return {
    run,
    reload,
    status,
    ...responseBundle,
    ...restUseAsync,
  };
};
