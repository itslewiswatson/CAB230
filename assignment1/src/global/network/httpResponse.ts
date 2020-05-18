import { AxiosResponse } from "axios";

export const unpackHttpResponse = async <T>(
  httpResponse: AxiosResponse<T>
): Promise<T> => {
  return httpResponse.data;
};
