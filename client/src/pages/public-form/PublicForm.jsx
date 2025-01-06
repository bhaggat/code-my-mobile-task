import React, { useState } from "react";
import {
  useGetPublicFormDataQuery,
  useSubmitFormMutation,
} from "@/store/formApi";
import { useParams } from "react-router-dom";
import { InputField } from "@/components/input-field/InputField";
import { useToastError } from "@/hooks/useToastError";
import { validations } from "@/services/validations";
import * as yup from "yup";
import { useToast } from "@/hooks/useToast";
import { useYupValidationResolver } from "@/hooks/useYupValidationResolver";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader/Loader";

const validationSchema = yup.object().shape({
  email: validations.email,
});

const PublicForm = () => {
  const param = useParams();
  const { data, isLoading } = useGetPublicFormDataQuery(param.id);
  const { toast } = useToast();
  const [customForm, { isLoading: isSubmitting }] = useSubmitFormMutation();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const resolver = useYupValidationResolver(validationSchema);
  const {
    handleSubmit,
    register,
    setError,
    getValues,
    formState: { errors },
  } = useForm({ resolver });
  const handleResponseError = useToastError({ setError });

  const onSubmit = async () => {
    const formData = getValues();
    const formattedData = {
      email: formData.email,
      formId: data.data.id,
      submittedData: data.data.fields.reduce((acc, { name, id }) => {
        acc[id] = formData[name];
        return acc;
      }, {}),
    };

    try {
      const response = await customForm(formattedData);
      if (response?.data?.success) {
        setFormSubmitted(true);
        toast({ variant: "success", title: "Form submitted successfully." });
      } else {
        handleResponseError(response?.error);
      }
    } catch (err) {
      handleResponseError(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex center justify-center align-center">
        <strong>Form not found!</strong>
      </div>
    );
  }

  if (formSubmitted) {
    return (
      <div className="max-w-lg mx-auto mt-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Thank You!</h1>
        <p className="mb-6">Your response has been submitted successfully.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">{data.data.title}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          name="email"
          register={register}
          label="Email Address"
          placeholder="Enter your email"
          error={errors?.email?.message}
        />
        {data.data.fields.map(({ name, fieldType }) => (
          <InputField
            key={name}
            name={name}
            type={fieldType}
            label={name}
            register={register}
            placeholder={`Enter ${name}`}
            error={errors?.[name]?.message}
          />
        ))}
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PublicForm;
