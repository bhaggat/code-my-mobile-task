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
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/constants/constants";

const PublicForm = () => {
  const param = useParams();
  const { data, isLoading, isError } = useGetPublicFormDataQuery(param.id);
  const { toast } = useToast();
  const [customForm, { isLoading: isSubmitting }] = useSubmitFormMutation();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [fileUploads, setFileUploads] = useState({});

  const validationSchema = React.useMemo(() => {
    const schema = {
      email: validations.email,
    };

    data?.data?.fields?.forEach(({ name, fieldType, required }) => {
      if (fieldType === "file") {
        schema[name] = yup
          .mixed()
          .test("required", "File is required", function (value) {
            if (required && !value) return false;
            return true;
          })
          .test(
            "fileSize",
            "File size is too large (max 5MB)",
            function (value) {
              if (!value) return true;
              return value.size <= MAX_FILE_SIZE;
            }
          )
          .test("fileType", "Unsupported file type", function (value) {
            if (!value) return true;
            return ALLOWED_FILE_TYPES.includes(value.type);
          });
      } else if (required) {
        schema[name] = yup.string().required(`${name} is required`);
      }
    });

    return yup.object().shape(schema);
  }, [data?.data?.fields]);

  const resolver = useYupValidationResolver(validationSchema);
  const {
    handleSubmit,
    register,
    setError,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ resolver });

  const handleResponseError = useToastError({ setError });

  const handleFileChange = (event, fieldName) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError(fieldName, {
          type: "manual",
          message: "File size is too large (max 5MB)",
        });
        return;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError(fieldName, {
          type: "manual",
          message: "Unsupported file type",
        });
        return;
      }
      setFileUploads((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
      setValue(fieldName, file);
    }
  };

  const onSubmit = async () => {
    const formData = new FormData();
    const values = getValues();

    formData.append("email", values.email);
    formData.append("formId", data.data.id);
    const submittedData = {};
    const allFileIds = [];

    for (const { name, id, fieldType } of data.data.fields) {
      if (fieldType === "file" && fileUploads[name]) {
        const file = fileUploads[name];
        formData.append("files", file);
        submittedData[id] = `file:${file.name}`;
        allFileIds.push(id);
      } else {
        submittedData[id] = values[name] || [];
      }
    }
    formData.append("allFileIds", JSON.stringify(allFileIds));
    formData.append("submittedData", JSON.stringify(submittedData));
    try {
      const response = await customForm(formData).unwrap();
      setFormSubmitted(true);
      toast({ variant: "success", title: "Form submitted successfully." });
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
    <div className="max-w-lg mx-auto p-6 md:p-10">
      <h1 className="text-2xl font-bold mb-6">{data.data.title}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          name="email"
          register={register}
          label="Email Address"
          placeholder="Enter your email"
          error={errors?.email?.message}
          required
        />
        {data.data.fields.map(({ name, fieldType, required }) => (
          <div key={name} className="space-y-2">
            {fieldType === "file" ? (
              <div>
                <label className="block text-sm font-medium mb-1">
                  {name} {required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, name)}
                  className="w-full"
                  accept={ALLOWED_FILE_TYPES.join(",")}
                />
                {fileUploads[name] && (
                  <p className="text-sm text-green-600 mt-1">
                    Selected: {fileUploads[name].name}
                  </p>
                )}
                {errors?.[name] && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors[name].message}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Max file size: 5MB. Supported formats: PDF, DOC, DOCX, JPG,
                  PNG, GIF
                </p>
              </div>
            ) : (
              <InputField
                name={name}
                type={fieldType}
                label={name}
                register={register}
                placeholder={`Enter ${name}`}
                error={errors?.[name]?.message}
                required={required}
              />
            )}
          </div>
        ))}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader className="mr-2 h-4 w-4" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </div>
  );
};

export default PublicForm;
