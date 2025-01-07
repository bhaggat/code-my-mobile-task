import { getCookie } from "@/services/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = getCookie("token");
      if (token) {
        headers.set("x-access-token", token);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    init: builder.mutation({
      query: (credentials) => ({
        url: "auth/init",
        method: "POST",
        body: credentials,
      }),
    }),
    signin: builder.mutation({
      query: (credentials) => ({
        url: "auth/signin",
        method: "POST",
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: "auth/signup",
        method: "POST",
        body: userData,
      }),
    }),
  }),
});

export const { useInitMutation, useSigninMutation, useSignupMutation } =
  authApi;
