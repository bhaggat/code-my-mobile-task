import { authApi } from "./authApi";

const formApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getForms: builder.query({
      providesTags: ["Form"],
      query: (params) => ({
        url: "forms",
        params,
      }),
    }),
    createForm: builder.mutation({
      query: (body) => ({
        url: "forms",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(authApi.util.invalidateTags(["Form"]));
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetFormsQuery, useCreateFormMutation } = formApi;
export default formApi;
