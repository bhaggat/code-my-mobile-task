import { useCallback } from "react";
import { useToast } from "./useToast";

export function useToastError({ setError }) {
  const { toast } = useToast();
  const handleResponseError = useCallback((error) => {
    if (setError && error?.data?.errors) {
      error?.data.errors?.forEach(({ field, message }) => {
        setError(field, { type: "server", message });
      });
    } else {
      toast({
        variant: "destructive",
        title: error?.message || error?.data?.message || "Something went wrong",
      });
    }
  }, []);

  return handleResponseError;
}
