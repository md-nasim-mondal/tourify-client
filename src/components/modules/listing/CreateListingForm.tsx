"use client";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createListing } from "@/services/listing/createListing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getInputFieldError, type IInputErrorState } from "@/lib/getInputFieldError";

type CreateListingFormProps = {
  categories: string[];
  languages: string[];
};

export default function CreateListingForm({
  categories,
  languages,
}: CreateListingFormProps) {
  const [state, formAction, isPending] = useActionState(createListing, null);

  useEffect(() => {
    if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <FieldGroup>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Title */}
          <Field>
            <FieldLabel htmlFor='title'>Title</FieldLabel>
            <Input
              id='title'
              name='title'
              type='text'
              placeholder='e.g., Hidden Jazz Bars of New Orleans'
              required
            />
            <FieldDescription className='text-red-600'>
              {getInputFieldError("title", state as IInputErrorState)}
            </FieldDescription>
          </Field>

          {/* Location */}
          <Field>
            <FieldLabel htmlFor='location'>Location / City</FieldLabel>
            <Input
              id='location'
              name='location'
              type='text'
              placeholder='e.g., New Orleans'
              required
            />
            <FieldDescription className='text-red-600'>
              {getInputFieldError("location", state as IInputErrorState)}
            </FieldDescription>
          </Field>

          {/* Price */}
          <Field>
            <FieldLabel htmlFor='price'>Tour Fee ($)</FieldLabel>
            <Input
              id='price'
              name='price'
              type='number'
              placeholder='e.g., 50'
              required
            />
            <FieldDescription className='text-red-600'>
              {getInputFieldError("price", state as IInputErrorState)}
            </FieldDescription>
          </Field>

          {/* Duration */}
          <Field>
            <FieldLabel htmlFor='duration'>Duration (hours)</FieldLabel>
            <Input
              id='duration'
              name='duration'
              type='number'
              placeholder='e.g., 3'
              required
            />
            <FieldDescription className='text-red-600'>
              {getInputFieldError("duration", state as IInputErrorState)}
            </FieldDescription>
          </Field>

          {/* Meeting Point */}
          <Field>
            <FieldLabel htmlFor='meetingPoint'>Meeting Point</FieldLabel>
            <Input
              id='meetingPoint'
              name='meetingPoint'
              type='text'
              placeholder='e.g., Jackson Square'
              required
            />
            <FieldDescription className='text-red-600'>
              {getInputFieldError("meetingPoint", state as IInputErrorState)}
            </FieldDescription>
          </Field>

          {/* Max Group Size */}
          <Field>
            <FieldLabel htmlFor='maxGroupSize'>Max Group Size</FieldLabel>
            <Input
              id='maxGroupSize'
              name='maxGroupSize'
              type='number'
              placeholder='e.g., 6'
              required
            />
            <FieldDescription className='text-red-600'>
              {getInputFieldError("maxGroupSize", state as IInputErrorState)}
            </FieldDescription>
          </Field>

          {/* Category */}
          <Field>
            <FieldLabel>Category</FieldLabel>
            <Select name='category'>
              <SelectTrigger>
                <SelectValue placeholder='Select a category' />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription className='text-red-600'>
              {getInputFieldError("category", state as IInputErrorState)}
            </FieldDescription>
          </Field>

          {/* Language */}
          <Field>
            <FieldLabel>Language</FieldLabel>
            <Select name='language'>
              <SelectTrigger>
                <SelectValue placeholder='Select a language' />
              </SelectTrigger>
              <SelectContent>
                {languages.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription className='text-red-600'>
              {getInputFieldError("language", state as IInputErrorState)}
            </FieldDescription>
          </Field>

          {/* Description */}
          <div className='md:col-span-2'>
            <Field>
              <FieldLabel htmlFor='description'>
                Description & Itinerary
              </FieldLabel>
              <Textarea
                id='description'
                name='description'
                placeholder='Describe the tour in detail...'
                required
              />
              <FieldDescription className='text-red-600'>
                {getInputFieldError("description", state as IInputErrorState)}
              </FieldDescription>
            </Field>
          </div>

          {/* Images */}
          <div className='md:col-span-2'>
            <Field>
              <FieldLabel htmlFor='images'>Images</FieldLabel>
              <Input id='images' name='images' type='file' multiple required />
              <FieldDescription>Upload up to 5 images.</FieldDescription>
              <FieldDescription className='text-red-600'>
                {getInputFieldError("images", state as IInputErrorState)}
              </FieldDescription>
            </Field>
          </div>
        </div>

        <FieldGroup className='mt-6'>
          <Field>
            <Button type='submit' disabled={isPending}>
              {isPending ? "Creating Listing..." : "Create Listing"}
            </Button>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
}
