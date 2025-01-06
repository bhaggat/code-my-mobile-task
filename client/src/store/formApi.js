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
      query: (body) => {
        console.log("body", body);
        return {
          url: "forms",
          method: "POST",
          body,
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(authApi.util.invalidateTags(["Form"]));
      },
    }),
    getPublicFormData: builder.query({
      providesTags: ["Form"],
      query: (id) => ({
        url: `/forms/public/${id}`,
      }),
    }),
    submitForm: builder.mutation({
      query: (body) => {
        return {
          url: "/form-submits",
          method: "POST",
          body,
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(authApi.util.invalidateTags(["Form"]));
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFormsQuery,
  useCreateFormMutation,
  useGetPublicFormDataQuery,
  useSubmitFormMutation,
} = formApi;
export default formApi;
