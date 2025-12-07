"use client";

import { resetPassword } from "@/services/auth/resetPassword";
import { useActionState, useEffect, useState } from "react";
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
import { useSearchParams } from "next/navigation";

interface ResetPasswordFormProps {
  token?: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(resetPassword, null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Get token from props or search params
  const finalToken = token || searchParams.get("token") || "";

  useEffect(() => {
    if (state) {
      if (state.success && state.message) {
        toast.success(state.message);
      } else if (!state.success && state.message) {
        toast.error(state.message);
      }
    }
  }, [state]);

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 5);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPasswordStrength(checkPasswordStrength(password));
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return "bg-red-500";
    if (strength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (!finalToken) {
    return (
      <div className='text-center p-6'>
        <h3 className='text-lg font-semibold text-red-600 mb-2'>
          Invalid Reset Link
        </h3>
        <p className='text-gray-600 mb-4'>
          The password reset link is invalid or has expired.
        </p>
        <Link href='/forgot-password' className='text-blue-600 hover:underline'>
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction}>
      <input type='hidden' name='token' value={finalToken} />

      <FieldGroup>
        <div className='grid grid-cols-1 gap-4'>
          {/* Password */}
          <Field>
            <FieldLabel htmlFor='password'>New Password</FieldLabel>
            <Input
              id='password'
              name='password'
              type='password'
              onChange={handlePasswordChange}
            />

            {/* Password Strength Indicator */}
            {passwordStrength > 0 && (
              <div className='mt-2'>
                <div className='flex gap-1'>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        i < passwordStrength
                          ? getStrengthColor(passwordStrength)
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className='text-xs text-gray-500 mt-1'>
                  {passwordStrength <= 2
                    ? "Weak"
                    : passwordStrength === 3
                    ? "Medium"
                    : passwordStrength === 4
                    ? "Strong"
                    : "Very Strong"}
                </p>
              </div>
            )}

            <FieldDescription>
              Password must be at least 6 characters with uppercase, lowercase,
              and number.
            </FieldDescription>
            <InputFieldError field='password' state={state} />
          </Field>

          {/* Confirm Password */}
          <Field>
            <FieldLabel htmlFor='confirmPassword'>
              Confirm New Password
            </FieldLabel>
            <Input
              id='confirmPassword'
              name='confirmPassword'
              type='password'
            />
            <InputFieldError field='confirmPassword' state={state} />
          </Field>
        </div>

        <FieldGroup className='mt-6'>
          <Field>
            <Button type='submit' disabled={isPending} className='w-full'>
              {isPending ? "Resetting Password..." : "Reset Password"}
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

export default ResetPasswordForm;
