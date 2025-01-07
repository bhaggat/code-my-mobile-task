import { authApi } from "./authApi";

const fileApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    readFile: builder.query({
      query: (id) => `/files/${id}`,
      transformResponse: (response) => response.data,
      providesTags: ["Files"],
    }),
  }),
  overrideExisting: false,
});

export const { useReadFileQuery } = fileApi;
export default fileApi;
