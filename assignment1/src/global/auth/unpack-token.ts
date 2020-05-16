import jwtDecode from "jwt-decode";

export type UserIdentityTokenData = {
  userId: string;
  usingGeneratedPassword: boolean;
};

export type TokenJwt = {
  exp: number;
  iat: number;
  data: UserIdentityTokenData;
};

export const unpackToken = (token: string): TokenJwt => {
  try {
    return jwtDecode<TokenJwt>(token);
  } catch (e) {
    throw new Error(
      `Auth token does not match the expected TokenJwt type. Token string (${token}) could not be decoded to TokenJwt`
    );
  }
};
