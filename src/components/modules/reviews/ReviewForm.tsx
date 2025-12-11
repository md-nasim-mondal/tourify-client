"use client";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createReview } from "@/services/review/createReview";
import {getInputFieldError, type IInputErrorState} from "@/lib/getInputFieldError";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type ReviewFormProps = {
  booking: {
    id: string;
    listing: {
        id: string;
    }
  };
};

export default function ReviewForm({ booking }: ReviewFormProps) {
  const [state, formAction, isPending] = useActionState(createReview, null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
     if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction}>
        <input type="hidden" name="bookingId" value={booking.id} />
        <input type="hidden" name="listingId" value={booking.listing.id} />
        <input type="hidden" name="rating" value={rating} />

      <FieldGroup>
        {/* Rating */}
        <Field>
            <FieldLabel>Rating</FieldLabel>
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={cn(
                            "w-8 h-8 cursor-pointer",
                            star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                        )}
                        onClick={() => setRating(star)}
                    />
                ))}
            </div>
            <FieldDescription className='text-red-600'>{getInputFieldError("rating", state as IInputErrorState) ?? ""}</FieldDescription>
        </Field>

        {/* Comment */}
        <Field>
          <FieldLabel htmlFor="comment">Comment</FieldLabel>
          <Textarea id="comment" name="comment" placeholder="Share your experience..." required />
          <FieldDescription className='text-red-600'>{getInputFieldError("comment", state as IInputErrorState) ?? ""}</FieldDescription>
        </Field>

        <FieldGroup className="mt-6">
          <Field>
            <Button type="submit" disabled={isPending || rating === 0}>
              {isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
}
