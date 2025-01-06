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
    getFormSubmissions: builder.query({
      providesTags: ["Form"],
      query: (id) => ({
        url: `forms/${id}`,
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
        try {
          await queryFulfilled;
          dispatch(authApi.util.invalidateTags(["Form"]));
        } catch (error) {
          console.error("Error creating form:", error);
        }
      },
    }),
    getPublicFormData: builder.query({
      providesTags: ["Form"],
      query: (id) => ({
        url: `/forms/public/${id}`,
      }),
    }),
    submitForm: builder.mutation({
      query: (body) => ({
        url: "/form-submits",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(authApi.util.invalidateTags(["Form"]));
        } catch (error) {
          console.error("Error submitting form:", error);
        }
      },
    }),
    updateForm: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/forms/${id}`,
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(authApi.util.invalidateTags(["Form"]));
        } catch (error) {
          console.error("Error updating form:", error);
        }
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
  useGetFormSubmissionsQuery,
  useUpdateFormMutation,
} = formApi;

export default formApi;
