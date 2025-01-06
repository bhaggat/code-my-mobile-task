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
import { useCreateFieldMutation } from "@/store/fieldApi";
import { useYupValidationResolver } from "@/hooks/useYupValidationResolver";
import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import { supportedInputTypes } from "@/constants/constants";
import { useToastError } from "@/hooks/useToastError";
import { useToast } from "@/hooks/useToast";

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  fieldType: yup.string().required("Field Type is required"),
});

function AddFieldDialog({ handleClose }) {
  const { toast } = useToast();
  const [createField, { isLoading }] = useCreateFieldMutation();

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
      const response = await createField(data);
      if (response?.data?.success) {
        handleClose();
        toast({ variant: "success", title: "Fiald created successfully." });
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
        <DialogTitle>Create New Field</DialogTitle>
        <DialogDescription>
          Create field to use it to create form.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6 mb-6">
          <InputField
            name="name"
            label="Name"
            type="text"
            placeholder="Enter field name"
            register={register}
            error={errors?.name?.message}
          />
          <InputField
            name="fieldType"
            label="Field Type"
            type="select"
            options={supportedInputTypes}
            placeholder="Select field type"
            register={register}
            error={errors?.fieldType?.message}
          />
        </div>
        <DialogFooter>
          <Button type="submit" isLoading={isLoading}>
            Add
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
export function AddField() {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Field</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <AddFieldDialog handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
