"use client";

import { useActionState, useEffect, useState, useRef, ChangeEvent } from "react";
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
import { getInputFieldError, type IInputErrorState } from "@/lib/getInputFieldError";
import { MultiSelect } from "@/components/ui/multi-select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { X, Upload } from "lucide-react";
import Image from "next/image";

type CreateListingFormProps = {
  categories: string[];
  languages: string[];
};

export default function CreateListingForm({
  categories,
  languages,
}: CreateListingFormProps) {
  const [state, formAction, isPending] = useActionState(createListing, null);
  
  // State for MultiSelect
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  // State for Images
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  // Handle Image Selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Filter out duplicate files by name (basic check)
      const uniqueFiles = newFiles.filter(
        (file) => !imageFiles.some((existing) => existing.name === file.name)
      );

      if (uniqueFiles.length + imageFiles.length > 5) {
        toast.error("You can only upload a maximum of 5 images.");
        return;
      }

      const updatedFiles = [...imageFiles, ...uniqueFiles];
      setImageFiles(updatedFiles);

      // Generate Previews
      const newPreviews = uniqueFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);

      // Update the actual input.files using DataTransfer
      updateFileInput(updatedFiles);
    }
  };

  const removeImage = (index: number) => {
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Revoke old URL to avoid memory leak
    URL.revokeObjectURL(imagePreviews[index]);

    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
    updateFileInput(updatedFiles);
  };

  const updateFileInput = (files: File[]) => {
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      files.forEach((file) => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border-none shadow-none md:border md:shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create New Listing</CardTitle>
        <CardDescription>
          Fill in the details below to publish your tour. Connect with travelers by providing rich information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <FieldGroup className="space-y-6">
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              
              {/* Title */}
              <Field className="md:col-span-2">
                <FieldLabel htmlFor='title'>Listing Title</FieldLabel>
                <Input
                  id='title'
                  name='title'
                  type='text'
                  placeholder='e.g., Hidden Jazz Bars of New Orleans'
                  required
                  className="bg-background"
                />
                <FieldDescription className='text-red-500'>
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
                  className="bg-background"
                />
                <FieldDescription className='text-red-500'>
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
                  className="bg-background"
                />
                <FieldDescription className='text-red-500'>
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
                  className="bg-background"
                />
                <FieldDescription className='text-red-500'>
                  {getInputFieldError("duration", state as IInputErrorState)}
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
                  className="bg-background"
                />
                <FieldDescription className='text-red-500'>
                  {getInputFieldError("maxGroupSize", state as IInputErrorState)}
                </FieldDescription>
              </Field>

              {/* Meeting Point */}
              <Field className="md:col-span-2">
                <FieldLabel htmlFor='meetingPoint'>Meeting Point</FieldLabel>
                <Input
                  id='meetingPoint'
                  name='meetingPoint'
                  type='text'
                  placeholder='e.g., Jackson Square, in front of the cathedral'
                  required
                  className="bg-background"
                />
                <FieldDescription className='text-red-500'>
                  {getInputFieldError("meetingPoint", state as IInputErrorState)}
                </FieldDescription>
              </Field>

              {/* Category */}
              <Field>
                <FieldLabel>Categories</FieldLabel>
                <MultiSelect
                  options={categories}
                  selected={selectedCategories}
                  onChange={setSelectedCategories}
                  placeholder="Select categories..."
                />
                {/* Hidden inputs to submit array values */}
                {selectedCategories.map((cat) => (
                  <input key={cat} type="hidden" name="category" value={cat} />
                ))}
                <FieldDescription className='text-red-500'>
                  {getInputFieldError("category", state as IInputErrorState)}
                </FieldDescription>
              </Field>

              {/* Language */}
              <Field>
                <FieldLabel>Languages Spoken</FieldLabel>
                <MultiSelect
                  options={languages}
                  selected={selectedLanguages}
                  onChange={setSelectedLanguages}
                  placeholder="Select languages..."
                />
                {selectedLanguages.map((lang) => (
                  <input key={lang} type="hidden" name="language" value={lang} />
                ))}
                <FieldDescription className='text-red-500'>
                  {getInputFieldError("language", state as IInputErrorState)}
                </FieldDescription>
              </Field>

              {/* Description */}
              <Field className="md:col-span-2">
                <FieldLabel htmlFor='description'>
                  Description & Itinerary
                </FieldLabel>
                <Textarea
                  id='description'
                  name='description'
                  placeholder='Describe the tour locally, highlight key stops, and what makes it unique...'
                  required
                  className="min-h-[150px] bg-background"
                />
                <FieldDescription className='text-red-500'>
                  {getInputFieldError("description", state as IInputErrorState)}
                </FieldDescription>
              </Field>

              {/* Images */}
              <div className='md:col-span-2 space-y-4'>
                <Field>
                  <FieldLabel>Listing Images</FieldLabel>
                  <div className="flex flex-col gap-4">
                    <div 
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="p-3 bg-muted rounded-full mb-3">
                         <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="font-medium">Click to upload images</p>
                      <p className="text-sm text-muted-foreground">SVG, PNG, JPG or GIF (max. 5 images)</p>
                      <Input 
                        ref={fileInputRef}
                        id='images' 
                        name='images' 
                        type='file' 
                        multiple 
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>
                    
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {imagePreviews.map((src, index) => (
                           <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border bg-background">
                              <Image 
                                src={src} 
                                alt={`Preview ${index}`} 
                                unoptimized
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                           </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <FieldDescription className='text-red-500 mt-2'>
                    {getInputFieldError("images", state as IInputErrorState)}
                  </FieldDescription>
                </Field>
              </div>

            </div>

            <div className="flex justify-end pt-4">
               <Button type='submit' disabled={isPending} size="lg" className="w-full md:w-auto">
                {isPending ? "Creating Listing..." : "Create Listing"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
