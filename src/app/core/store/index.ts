import { createStore } from "@harlem/core";
import type { IncomingHttpHeaders } from "http";
import { ACCESS_TOKEN_KEY } from "../constants";

const STATE = {
  title: "",
  keywords: "",
  description: "",
  token: "",
};

export const { state, getter, mutation, ...store } = createStore("app", STATE);

export const setTitle = mutation<string | "">("setTitle", (state, payload) => {
  state.title = payload;
});

export const setKeywords = mutation<string | "">(
  "setKeywords",
  (state, payload) => {
    state.keywords = payload;
  }
);

export const setDescription = mutation<string | "">(
  "setDescription",
  (state, payload) => {
    state.description = payload;
  }
);

export const getToken = getter("getToken", (state) => {
  if (state.token) {
    return state.token;
  } else {
    let token = "";
    if (!import.meta.env.SSR) {
      token = sessionStorage.getItem(ACCESS_TOKEN_KEY) || "";
      setToken(token);
    }
    return token;
  }
});

export const setToken = mutation<string | "">("setToken", (state, payload) => {
  if (!import.meta.env.SSR) {
    if (payload) {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, payload);
    } else {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  }
  state.token = payload;
});

export const setTokenFromHeader = mutation<IncomingHttpHeaders>(
  "setTokenFromHeader",
  (state, payload) => {
    const accessToken = payload["access-token"];
    let token = "";
    if (accessToken instanceof Array && accessToken.length) {
      token = accessToken[0];
    } else if (typeof accessToken === "string") {
      token = accessToken;
    }
    setToken(token);
  }
);
