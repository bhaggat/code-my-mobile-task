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
  }),
  overrideExisting: false,
});

export const { useGetFieldsQuery, useCreateFieldMutation } = fieldApi;
export default fieldApi;
