import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useSignupMutation } from "@/store/authApi";
import { useYupValidationResolver } from "@/hooks/useYupValidationResolver";
import { validations } from "@/services/validations";
import { useToast } from "@/hooks/useToast";
import { InputField } from "@/components/input-field/InputField";
import { useToastError } from "@/hooks/useToastError";

const validationSchema = yup.object().shape({
  email: validations.email,
  password: validations.password,
  name: validations.name,
});

const Signup = () => {
  const [signup, { isLoading }] = useSignupMutation();
  const navigator = useNavigate();
  const { toast } = useToast();

  const resolver = useYupValidationResolver(validationSchema);
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm({ resolver });
  const handleResponseError = useToastError({ setError });

  const onSubmit = async (data) => {
    try {
      const response = await signup(data);
      if (response?.data?.success) {
        toast({ variant: "success", title: "Signup successful." });
        navigator("/signin");
      } else {
        handleResponseError(response?.error);
      }
    } catch (err) {
      handleResponseError(err);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Signu Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <InputField
              label="Name"
              name="name"
              type="text"
              placeholder="Enter your name"
              register={register}
              error={errors?.name?.message}
            />
            <InputField
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email address"
              register={register}
              error={errors?.email?.message}
            />
            <InputField
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              register={register}
              error={errors?.password?.message}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              isLoading={isLoading}
            >
              Sign up
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/signin" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default Signup;
