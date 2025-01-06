import { authApi } from "./authApi";

const fieldApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getFields: builder.query({
      providesTags: ["Fields"],
      query: (params) => ({
        url: "fields",
        params,
      }),
    }),
    createField: builder.mutation({
      query: (body) => ({
        url: "fields",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(authApi.util.invalidateTags(["Fields"]));
      },
    }),
    getFieldOptions: builder.query({
      providesTags: ["Fields"],
      query: (params) => ({
        url: "fields/options",
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFieldsQuery,
  useCreateFieldMutation,
  useGetFieldOptionsQuery,
} = fieldApi;
export default fieldApi;
