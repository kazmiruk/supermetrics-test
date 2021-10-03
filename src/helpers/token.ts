import axios, { AxiosResponse } from "axios";
import moment from "moment";

import {
  CachedToken,
  RegisterRequestData,
  RegisterResponseData,
} from "../types";

const tokenTtl = process.env.TOKEN_TTL ? +process.env.TOKEN_TTL : 3600;
// decreases ttl a bit to be sure that any delays between client/server will not affect us
const ttlDelay = process.env.TOKEN_TTL_DELAY ? +process.env.TOKEN_TTL_DELAY : 5;

export const tokenRegisterUrl =
  "https://api.supermetrics.com/assignment/register";

let cachedToken: CachedToken | null = null;

export const getToken = async (): Promise<string> => {
  if (
    cachedToken === null ||
    cachedToken.registeredAt < moment().subtract(tokenTtl - ttlDelay, "seconds")
  ) {
    const tokenResponse = await axios
      .post<RegisterRequestData, AxiosResponse<RegisterResponseData>>(
        tokenRegisterUrl,
        {
          client_id: process.env.CLIENT_ID || "",
          email: process.env.EMAIL || "",
          name: process.env.NAME || "",
        }
      )
      .catch((error: Error) => error);

    if ("status" in tokenResponse && tokenResponse.status === 200) {
      cachedToken = {
        token: tokenResponse.data.data.sl_token,
        registeredAt: moment(),
      };
    } else {
      console.log(tokenResponse);
      throw new Error("Failed to get token");
    }
  }

  return cachedToken.token;
};

export const resetToken = (): void => {
  cachedToken = null;
};
