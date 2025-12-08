/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FieldError } from "@/components/ui/field";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputFieldErrorProps {
  field: string;
  state: any;
  className?: string;
}

const InputFieldError = ({ field, state, className }: InputFieldErrorProps) => {
  if (!state || !state.errors) return null;

  const error = state.errors.find(
    (err: { field: string }) => err.field === field
  );

  if (!error) return null;

  return (
    <div className={cn("mt-1", className)}>
      <FieldError className="flex items-center gap-1">
        <AlertCircle size={14} />
        <span>{error.message}</span>
      </FieldError>
    </div>
  );
};

export default InputFieldError;