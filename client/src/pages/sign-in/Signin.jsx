import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useUser } from "../../context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useSigninMutation } from "@/store/authApi";
import { useYupValidationResolver } from "@/hooks/useYupValidationResolver";
import { validations } from "@/services/validations";
import { useToast } from "@/hooks/useToast";
import { InputField } from "@/components/input-field/InputField";
import { useToastError } from "@/hooks/useToastError";

const validationSchema = yup.object().shape({
  email: validations.email,
  password: validations.password,
});

const Signin = () => {
  const { setUser } = useUser();
  const { toast } = useToast();
  const [signin, { isLoading }] = useSigninMutation();
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
      const response = await signin(data);
      if (response?.data?.data?.token) {
        toast({ variant: "success", title: "Signin successful." });
        setUser(response.data.data);
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
        <CardTitle className="text-2xl">Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              register={register}
              error={errors?.email?.message}
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              register={register}
              error={errors?.password?.message}
              // action={
              //   <Link
              //     disabled
              //     to="forgot-password"
              //     className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              //   >
              //     Forgot your password?
              //   </Link>
              // }
            />
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign in
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default Signin;
