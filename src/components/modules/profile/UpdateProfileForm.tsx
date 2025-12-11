/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateMyProfile } from "@/services/user/updateMyProfile";

type UserProfile = {
  name: string;
  email: string;
  role: "GUIDE" | "TOURIST";
  bio?: string;
  contactNo?: string;
  address?: string;
  photo?: string;
  languagesSpoken?: string[];
  expertise?: string[];
  dailyRate?: number;
  travelPreferences?: string[];
};

export default function UpdateProfileForm({ me }: { me: UserProfile }) {
  const [state, formAction, isPending] = useActionState(updateMyProfile, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    }
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction} className="mt-6">
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4">
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input id="name" name="name" type="text" defaultValue={me.name} required />
          </Field>
          
          <Field>
            <FieldLabel htmlFor="email">Email (read-only)</FieldLabel>
            <Input id="email" name="email" type="email" defaultValue={me.email} readOnly />
          </Field>

          <Field>
            <FieldLabel htmlFor="contactNo">Contact Number</FieldLabel>
            <Input id="contactNo" name="contactNo" type="text" defaultValue={me.contactNo} />
          </Field>
          
          <Field>
            <FieldLabel htmlFor="address">Address</FieldLabel>
            <Input id="address" name="address" type="text" defaultValue={me.address} />
          </Field>
          
          <Field>
            <FieldLabel htmlFor="bio">Bio</FieldLabel>
            <Textarea id="bio" name="bio" defaultValue={me.bio} />
          </Field>

          <Field>
            <FieldLabel htmlFor="languagesSpoken">Languages Spoken (comma separated)</FieldLabel>
            <Input id="languagesSpoken" name="languagesSpoken" type="text" defaultValue={me.languagesSpoken?.join(", ")} />
          </Field>

          {me.role === "GUIDE" && (
            <>
              <Field>
                <FieldLabel htmlFor="expertise">Expertise (comma separated)</FieldLabel>
                <Input id="expertise" name="expertise" type="text" defaultValue={me.expertise?.join(", ")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="dailyRate">Daily Rate</FieldLabel>
                <Input id="dailyRate" name="dailyRate" type="number" defaultValue={me.dailyRate} />
              </Field>
            </>
          )}

          {me.role === "TOURIST" && (
            <Field>
              <FieldLabel htmlFor="travelPreferences">Travel Preferences (comma separated)</FieldLabel>
              <Input id="travelPreferences" name="travelPreferences" type="text" defaultValue={me.travelPreferences?.join(", ")} />
            </Field>
          )}

          <Field>
            <FieldLabel htmlFor="file">Profile Picture</FieldLabel>
            <Input id="file" name="file" type="file" />
          </Field>
        </div>
        <FieldGroup className="mt-4">
          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Profile"}
            </Button>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
}
