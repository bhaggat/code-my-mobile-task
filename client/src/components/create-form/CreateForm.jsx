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
import { useGetFieldOptionsQuery } from "@/store/fieldApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import ValidationWrapper from "../validation-wrapper/ValidationWrapper";

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
});

function SortableField({ field, onRemove, data }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 bg-white border rounded-md"
    >
      <button
        type="button"
        className="cursor-grab hover:text-gray-700 touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="flex-1">
        {data?.data?.find((f) => f.id === field)?.name}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(field)}
      >
        Remove
      </Button>
    </div>
  );
}

function CreateFormDialog() {
  const { toast } = useToast();
  const [createForm, { isLoading }] = useCreateFormMutation();
  const { data } = useGetFieldOptionsQuery();

  const resolver = useYupValidationResolver(validationSchema);
  const form = useForm({ resolver });
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = form;
  const handleResponseError = useToastError({ setError });
  const [published, setpublished] = useState(true);
  const [selectedFields, setSelectedFields] = useState([]);
  const [showFieldSelect, setShowFieldSelect] = useState(false);
  const [formUrl, setFormUrl] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSelectedFields((fields) => {
        const oldIndex = fields.findIndex((f) => f === active.id);
        const newIndex = fields.findIndex((f) => f === over.id);

        return arrayMove(fields, oldIndex, newIndex);
      });
    }
  };

  const onFieldSelect = useCallback((fieldId) => {
    const id = Number(fieldId);
    setSelectedFields((prev) => [...prev, id]);
    setShowFieldSelect(false);
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await createForm({
        ...data,
        fields: selectedFields,
        published,
      });
      if (response?.data?.success) {
        console.log("response.data", response.data);
        setFormUrl(
          `${location.origin}/public/forms/${response.data?.data.publicId}`
        );
        toast({ variant: "success", title: "Form created successfully." });
      } else {
        handleResponseError(response?.error);
      }
    } catch (err) {
      handleResponseError(err);
    }
  };

  if (formUrl) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Form Created</DialogTitle>
          <DialogDescription>
            Your form has been successfully created.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <p className="mb-4 text-sm">
            Use the following link to access the form:
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={formUrl}
              readOnly
              className="flex-1 p-2 border rounded-md bg-gray-100 text-sm"
            />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(formUrl).then(() => {
                  toast({
                    title: "Copied to clipboard",
                  });
                });
              }}
              variant="outline"
            >
              Copy URL
            </Button>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </>
    );
  }

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

          <div className="flex items-center gap-2">
            <Checkbox
              id="published"
              onCheckedChange={setpublished}
              checked={published}
            />
            <label htmlFor="published" className="text-sm font-medium">
              Publish
            </label>
          </div>

          <div className="space-y-4">
            {selectedFields.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Selected Fields:</h3>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={selectedFields}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {selectedFields.map((field) => (
                        <SortableField
                          key={field}
                          field={field}
                          data={data}
                          onRemove={(fieldId) => {
                            setSelectedFields((prev) =>
                              prev.filter((f) => f !== fieldId)
                            );
                          }}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}

            {showFieldSelect && (
              <Select
                defaultValue=""
                onValueChange={(value) => {
                  if (value) {
                    onFieldSelect(value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a field" />
                </SelectTrigger>
                <SelectContent>
                  {data?.data?.map((field) => (
                    <SelectItem
                      key={field.id}
                      value={field.id.toString()}
                      disabled={selectedFields.some((f) => f === field.id)}
                    >
                      {field.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowFieldSelect(true)}
            >
              Add Field
            </Button>
          </div>
          <ValidationWrapper error={errors?.fields?.message} />
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
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Form</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <CreateFormDialog />
      </DialogContent>
    </Dialog>
  );
}
