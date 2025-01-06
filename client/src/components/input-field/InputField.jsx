import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import ValidationWrapper from "../validation-wrapper/ValidationWrapper";
import { useId } from "react";

export const InputField = ({
  label,
  type = "text",
  placeholder,
  register,
  error,
  action,
  name,
  options = [],
  ...inputProps
}) => {
  const id = useId();

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {action}
      </div>

      {type === "select" ? (
        <select
          id={id}
          {...register(name)}
          className="w-full rounded-md border px-3 py-2 text-sm focus:ring focus:ring-offset-1"
          {...inputProps}
        >
          <option value="">{placeholder || "Select an option"}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          {...inputProps}
          {...register(name)}
        />
      )}
      <ValidationWrapper error={error} />
    </div>
  );
};
