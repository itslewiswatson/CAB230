import localforage from "localforage";

const tokenStorageKey = "auth_token";
export const updateToken = (
  token: string | undefined
): Promise<void> | Promise<string> => {
  if (!token) {
    return clearToken();
  }

  return storeToken(token);
};
const storeToken = (token: string): Promise<string> => {
  return localforage.setItem(tokenStorageKey, token);
};
const clearToken = (): Promise<void> => {
  return localforage.removeItem(tokenStorageKey);
};
export const getTokenFromStorage = (): Promise<string | undefined> => {
  return localforage.getItem(tokenStorageKey);
};
