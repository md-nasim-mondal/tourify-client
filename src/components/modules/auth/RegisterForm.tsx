"use client";

import { registerUser } from "@/services/auth/registerUser";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "../../ui/field";
import { Input } from "../../ui/input";
import { toast } from "sonner";
import InputFieldError from "../../shared/InputFieldError";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";

const RegisterForm = () => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerUser, null);
  const [selectedRole, setSelectedRole] = useState("TOURIST"); // Default role

  useEffect(() => {
    if (state) {
      if (!state.success && state.message) {
        toast.error(state.message);
      } else if (state.success && state.redirectTo) {
        toast.success("Registration successful! Check your email to verify.");
        router.push("/");
      }
    }
  }, [state, router]);

  return (
    <form action={formAction}>
      <FieldGroup>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Name */}
          <Field>
            <FieldLabel htmlFor='name'>Full Name</FieldLabel>
            <Input id='name' name='name' type='text' placeholder='John Doe' />
            <InputFieldError field='name' state={state} />
          </Field>

          {/* Email */}
          <Field>
            <FieldLabel htmlFor='email'>Email</FieldLabel>
            <Input
              id='email'
              name='email'
              type='email'
              placeholder='m@example.com'
            />
            <InputFieldError field='email' state={state} />
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel htmlFor='password'>Password</FieldLabel>
            <Input id='password' name='password' type='password' />
            <InputFieldError field='password' state={state} />
          </Field>

          {/* Confirm Password */}
          <Field>
            <FieldLabel htmlFor='confirmPassword'>Confirm Password</FieldLabel>
            <Input
              id='confirmPassword'
              name='confirmPassword'
              type='password'
            />
            <InputFieldError field='confirmPassword' state={state} />
          </Field>

          {/* Address */}
          <Field className='md:col-span-2'>
            <FieldLabel htmlFor='address'>Address</FieldLabel>
            <Input
              id='address'
              name='address'
              type='text'
              placeholder='123 Main St, City, Country'
            />
            <InputFieldError field='address' state={state} />
          </Field>

          {/* Contact Number */}
          <Field>
            <FieldLabel htmlFor='contactNo'>Contact Number</FieldLabel>
            <Input
              id='contactNo'
              name='contactNo'
              type='tel'
              placeholder='+8801XXXXXXXXX'
            />
            <InputFieldError field='contactNo' state={state} />
          </Field>

          {/* Role Selection */}
          <Field>
            <FieldLabel>Register as</FieldLabel>
            <RadioGroup
              defaultValue={selectedRole}
              onValueChange={setSelectedRole} // Update state on change
              className='flex flex-col space-y-2'>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='TOURIST' id='tourist' />
                <Label htmlFor='tourist' className='cursor-pointer'>
                  Tourist (I want to book tours)
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='GUIDE' id='guide' />
                <Label htmlFor='guide' className='cursor-pointer'>
                  Guide (I want to host tours)
                </Label>
              </div>
            </RadioGroup>
            <input type="hidden" name="role" value={selectedRole} />
            <InputFieldError field='role' state={state} />
          </Field>
        </div>

        {/* Guide Specific Fields (Conditional) */}
        <div
          id='guideFields'
          className={
            selectedRole === "GUIDE"
              ? "mt-4 space-y-4"
              : "hidden mt-4 space-y-4"
          }>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Field>
              <FieldLabel htmlFor='expertise'>Expertise</FieldLabel>
              <Input
                id='expertise'
                name='expertise'
                type='text'
                placeholder='History, Food, Adventure'
              />
              <FieldDescription>Separate by commas</FieldDescription>
              <InputFieldError field='expertise' state={state} />
            </Field>
            <Field>
              <FieldLabel htmlFor='dailyRate'>Daily Rate ($)</FieldLabel>
              <Input
                id='dailyRate'
                name='dailyRate'
                type='number'
                placeholder='50'
                min='1'
              />
              <InputFieldError field='dailyRate' state={state} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor='languagesSpoken'>Languages Spoken</FieldLabel>
            <Input
              id='languagesSpoken'
              name='languagesSpoken'
              type='text'
              placeholder='English, Spanish, Bengali'
            />
            <FieldDescription>Separate by commas</FieldDescription>
            <InputFieldError field='languagesSpoken' state={state} />
          </Field>

          <Field>
            <FieldLabel htmlFor='bio'>Bio</FieldLabel>
            <textarea
              id='bio'
              name='bio'
              rows={3}
              className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
              placeholder='Tell travelers about yourself...'
            />
            <InputFieldError field='bio' state={state} />
          </Field>
        </div>

        <FieldGroup className='mt-4'>
          <Field>
            <Button type='submit' disabled={isPending} className='w-full'>
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>

            <FieldDescription className='px-6 text-center'>
              Already have an account?{" "}
              <a href='/login' className='text-blue-600 hover:underline'>
                Sign in
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
};

export default RegisterForm;
