import * as yup from "yup";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InputField } from "../input-field/InputField";
import { useYupValidationResolver } from "@/hooks/useYupValidationResolver";
import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import { useToastError } from "@/hooks/useToastError";
import { useToast } from "@/hooks/useToast";
import { useCreateFormMutation } from "@/store/formApi";

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
});

function CreateFormDialog({ handleClose }) {
  const { toast } = useToast();
  const [createForm, { isLoading }] = useCreateFormMutation();

  const resolver = useYupValidationResolver(validationSchema);
  const form = useForm({ resolver });
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = form;
  const handleResponseError = useToastError({ setError });

  const onSubmit = async (data) => {
    try {
      const response = await createForm(data);
      if (response?.data?.success) {
        handleClose();
        toast({ variant: "success", title: "Form created successfully." });
      } else {
        handleResponseError(response?.error);
      }
    } catch (err) {
      handleResponseError(err);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create New Form</DialogTitle>
        <DialogDescription>Create form to publish.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6 mb-6">
          <InputField
            name="title"
            label="Title"
            placeholder="Enter form title"
            register={register}
            error={errors?.title?.message}
          />
        </div>
        <DialogFooter>
          <Button type="submit" isLoading={isLoading}>
            Create
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </>
  );
}
export function CreateForm() {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Form</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <CreateFormDialog handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
