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
import { updateListing } from "@/services/listing/updateListing";
import { getInputFieldError, type IInputErrorState } from "@/lib/getInputFieldError";
import { MultiSelect } from "@/components/ui/multi-select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { X, Upload, Trash2 } from "lucide-react";
import Image from "next/image";

type Listing = {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  duration: number;
  meetingPoint: string;
  maxGroupSize: number;
  category: string | string[]; // Support both for transition
  language: string | string[]; // Support both for transition
  images: string[]; // Add images to type
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

  // Helper to normalize to array (handle comma-separated strings)
  const normalizeToArray = (val: string | string[] | undefined) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return val.split(',').map(s => s.trim()).filter(Boolean);
  };

  // State for MultiSelect
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    normalizeToArray(listing.category)
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    normalizeToArray(listing.language)
  );

  // State for Images
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [keptImages, setKeptImages] = useState<string[]>(listing.images || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.success === true) {
      toast.success("Listing updated successfully!");
    }
    if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  // Handle Image Selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      const uniqueFiles = newFiles.filter(
        (file) => !imageFiles.some((existing) => existing.name === file.name)
      );

      if (uniqueFiles.length + imageFiles.length + keptImages.length > 5) {
        toast.error("You can have a maximum of 5 images (existing + new).");
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
    
    URL.revokeObjectURL(imagePreviews[index]);

    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
    updateFileInput(updatedFiles);
  };

  const removeKeptImage = (index: number) => {
    const updatedKept = keptImages.filter((_, i) => i !== index);
    setKeptImages(updatedKept);
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
        <CardTitle className="text-2xl font-bold">Update Listing</CardTitle>
        <CardDescription>
          Modify your listing details below. Keep your tour information up-to-date.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
           {/* Submit kept images as hidden inputs */}
           {keptImages.map((src) => (
             <input key={src} type="hidden" name="keptImages" value={src} />
           ))}
           
          <FieldGroup className="space-y-6">
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Field className="md:col-span-2">
                <FieldLabel htmlFor='title'>Title</FieldLabel>
                <Input
                  id='title'
                  name='title'
                  type='text'
                  defaultValue={listing.title}
                  required
                  className="bg-background"
                />
                <FieldDescription className='text-red-500'>
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
                  className="bg-background"
                />
                <FieldDescription className='text-red-500'>
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
                  className="bg-background"
                />
                <FieldDescription className='text-red-500'>
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
                  className="bg-background"
                />
                <FieldDescription className='text-red-500'>
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
                  className="bg-background"
                />
                <FieldDescription className='text-red-500'>
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
                  className="bg-background"
                />
                <FieldDescription className='text-red-500'>
                  {getInputFieldError("maxGroupSize", state as IInputErrorState)}
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel>Categories</FieldLabel>
                <MultiSelect
                  options={categories}
                  selected={selectedCategories}
                  onChange={setSelectedCategories}
                  placeholder="Select categories..."
                />
                {selectedCategories.map((cat) => (
                  <input key={cat} type="hidden" name="category" value={cat} />
                ))}
                <FieldDescription className='text-red-500'>
                  {getInputFieldError("category", state as IInputErrorState)}
                </FieldDescription>
              </Field>

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
                    className="min-h-[150px] bg-background"
                  />
                  <FieldDescription className='text-red-500'>
                    {getInputFieldError("description", state as IInputErrorState)}
                  </FieldDescription>
                </Field>
              </div>

              <div className='md:col-span-2 space-y-4'>
                <Field>
                  <FieldLabel>Current Images</FieldLabel>
                  {keptImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        {keptImages.map((src, index) => (
                           <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border bg-background">
                              <Image 
                                src={src} 
                                alt={`Current Image ${index}`} 
                                unoptimized
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeKeptImage(index)}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove image"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                           </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No images kept. Upload new ones or keep at least one if required.</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel>Add New Images</FieldLabel>
                  <div className="flex flex-col gap-4">
                     <div 
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="p-3 bg-muted rounded-full mb-3">
                         <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="font-medium">Click to upload new images</p>
                      <p className="text-sm text-muted-foreground">Appends to current images.</p>
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
                   <FieldDescription>
                    Total images (Current + New) cannot exceed 5.
                  </FieldDescription>
                </Field>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type='submit' disabled={isPending} size="lg" className="w-full md:w-auto">
                {isPending ? "Updating Listing..." : "Update Listing"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
