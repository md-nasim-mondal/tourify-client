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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateListing } from "@/services/listing/updateListing";
import { getInputFieldError, type IInputErrorState } from "@/lib/getInputFieldError";

type Listing = {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  duration: number;
  meetingPoint: string;
  maxGroupSize: number;
  category: string;
  language: string;
};

type UpdateListingFormProps = {
  listing: Listing;
  categories: string[];
  languages: string[];
};

export default function UpdateListingForm({
  listing,
  categories,
  languages,
}: UpdateListingFormProps) {
  const updateListingWithId = updateListing.bind(null, listing.id);
  const [state, formAction, isPending] = useActionState(
    updateListingWithId,
    null
  );

  useEffect(() => {
    if (state?.success === true) {
      toast.success("Listing updated successfully!");
    }
    if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <FieldGroup>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Field>
            <FieldLabel htmlFor='title'>Title</FieldLabel>
            <Input
              id='title'
              name='title'
              type='text'
              defaultValue={listing.title}
              required
            />
            <FieldDescription className='text-red-600'>
              {getInputFieldError("title", state as IInputErrorState)}
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor='location'>Location / City</FieldLabel>
            <Input
              id='location'
              name='location'
              type='text'
              defaultValue={listing.location}
              required
            />
            <FieldDescription className='text-red-600'>
              {getInputFieldError("location", state as IInputErrorState)}
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor='price'>Tour Fee ($)</FieldLabel>
            <Input
              id='price'
              name='price'
              type='number'
              defaultValue={listing.price}
              required
            />
            <FieldDescription className='text-red-600'>
              {getInputFieldError("price", state as IInputErrorState)}
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor='duration'>Duration (hours)</FieldLabel>
            <Input
              id='duration'
              name='duration'
              type='number'
              defaultValue={listing.duration}
              required
            />
            <FieldDescription className='text-red-600'>
              {getInputFieldError("duration", state as IInputErrorState)}
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor='meetingPoint'>Meeting Point</FieldLabel>
            <Input
              id='meetingPoint'
              name='meetingPoint'
              type='text'
              defaultValue={listing.meetingPoint}
              required
            />
            <FieldDescription className='text-red-600'>
              {getInputFieldError("meetingPoint", state as IInputErrorState)}
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor='maxGroupSize'>Max Group Size</FieldLabel>
            <Input
              id='maxGroupSize'
              name='maxGroupSize'
              type='number'
              defaultValue={listing.maxGroupSize}
              required
            />
            <FieldDescription className='text-red-600'>
              {getInputFieldError("maxGroupSize", state as IInputErrorState)}
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel>Category</FieldLabel>
            <Select name='category' defaultValue={listing.category}>
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

          <Field>
            <FieldLabel>Language</FieldLabel>
            <Select name='language' defaultValue={listing.language}>
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

          <div className='md:col-span-2'>
            <Field>
              <FieldLabel htmlFor='description'>
                Description & Itinerary
              </FieldLabel>
              <Textarea
                id='description'
                name='description'
                defaultValue={listing.description}
                required
              />
              <FieldDescription className='text-red-600'>
                {getInputFieldError("description", state as IInputErrorState)}
              </FieldDescription>
            </Field>
          </div>

          <div className='md:col-span-2'>
            <Field>
              <FieldLabel htmlFor='images'>New Images</FieldLabel>
              <Input id='images' name='images' type='file' multiple />
              <FieldDescription>
                Upload new images to replace existing ones. Leave blank to keep
                current images.
              </FieldDescription>
            </Field>
          </div>
        </div>

        <FieldGroup className='mt-6'>
          <Field>
            <Button type='submit' disabled={isPending}>
              {isPending ? "Updating Listing..." : "Update Listing"}
            </Button>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
}
