import { authApi } from "./authApi";

const fieldApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getFields: builder.query({
      query: ({ search = "", page = 1, limit = 10 } = {}) => ({
        url: "/fields",
        params: {
          search,
          page,
          limit,
        },
      }),
      providesTags: ["Fields"],
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
