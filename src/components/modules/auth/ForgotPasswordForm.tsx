"use client";

import { forgotPassword } from "@/services/auth/forgotPassword";
import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import InputFieldError from "@/components/shared/InputFieldError";
import Link from "next/link";

const ForgotPasswordForm = () => {
  const [state, formAction, isPending] = useActionState(forgotPassword, null);

  useEffect(() => {
    if (state) {
      if (state.success && state.message) {
        toast.success(state.message);
      } else if (!state.success && state.message) {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form action={formAction}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='email'>Email</FieldLabel>
          <Input
            id='email'
            name='email'
            type='email'
            placeholder='m@example.com'
            required
          />
          <InputFieldError field='email' state={state} />
          <FieldDescription>
            Enter your email address and we&apos;ll send you a link to reset your password.
          </FieldDescription>
        </Field>

        <FieldGroup className='mt-6'>
          <Field>
            <Button type='submit' disabled={isPending} className="w-full">
              {isPending ? "Sending Reset Link..." : "Send Reset Link"}
            </Button>

            <FieldDescription className='px-6 text-center'>
              Remember your password?{" "}
              <Link href='/login' className='text-blue-600 hover:underline'>
                Sign in
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
};

export default ForgotPasswordForm;