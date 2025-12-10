import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ReviewCardProps = {
  review: {
    id: string;
    rating?: number;
    comment?: string;
    tourist?: { name?: string; photo?: string };
    user?: { name?: string; photo?: string };
    createdAt?: string;
  };
};

export default function ReviewCard({ review }: ReviewCardProps) {
  const name = review.tourist?.name || review.user?.name || "Anonymous";
  const photo = review.tourist?.photo || review.user?.photo || "/default-avatar.png";
  const rating = typeof review.rating === "number" ? review.rating : 0;
  const comment = review.comment || "";

  return (
    <Card>
      <CardContent className="flex gap-4 p-5">
        <div className="relative h-12 w-12 overflow-hidden rounded-full">
          <Image src={photo} alt={name} fill className="object-cover" sizes="48px" />
        </div>
        <div className="grow">
          <p className="font-semibold">{name}</p>
          <div className="mt-1 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-4 w-4",
                  star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                )}
              />
            ))}
          </div>
          {comment && <p className="mt-2 text-gray-700">{comment}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

