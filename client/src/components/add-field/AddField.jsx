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
import { useAddFieldMutation } from "@/store/fieldApi";
import { toast } from "sonner";
import { useYupValidationResolver } from "@/hooks/useYupValidationResolver";
import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import { supportedInputTypes } from "@/constants/constants";

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  fieldType: yup.string().required("Field Type is required"),
});

function AddFieldDialog({ handleClose }) {
  const [addField, { isLoading }] = useAddFieldMutation();

  const resolver = useYupValidationResolver(validationSchema);
  const form = useForm({ resolver });
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = form;
  const handleResponseError = (error) => {
    console.log("errors", error);
    if (error?.data?.errors) {
      error?.data.errors?.forEach(({ field, message }) => {
        setError(field, { type: "server", message });
      });
    } else {
      toast({
        variant: "destructive",
        title: error?.message || error?.data?.message || "Something went wrong",
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await addField(data);
      if (response?.data?.success) {
        handleClose();
        toast({ variant: "success", title: "Signin successful." });
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
        <DialogTitle>Add New Field</DialogTitle>
        <DialogDescription>
          Add field to use it to create form.
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
