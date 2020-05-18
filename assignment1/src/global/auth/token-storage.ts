import * as localforage from "localforage";

const tokenStorageKey = "the_big_bad_token";
export const updateToken = (
  token: string | undefined
): Promise<void> | Promise<string> => {
  if (!token) {
    return clearToken();
  }

  return storeToken(token);
};
export const storeToken = (token: string): Promise<string> => {
  return localforage.setItem(tokenStorageKey, token);
};
export const clearToken = (): Promise<void> => {
  return localforage.removeItem(tokenStorageKey);
};
export const getTokenFromStorage = (): Promise<string | undefined> => {
  return localforage.getItem(tokenStorageKey);
};
