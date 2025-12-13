import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Review = {
    id: string;
    rating: number;
    comment: string;
    tourist: {
        name: string;
        photo: string;
    }
};

export default function ReviewList({ reviews }: { reviews: Review[] }) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Reviews</h2>
            {reviews && reviews.length > 0 ? (
                reviews.map(review => (
                    <div key={review?.id} className="flex gap-4 border-b pb-6">
                        <img src={review?.tourist?.photo || '/default-avatar.png'} alt={review?.tourist?.name} className="w-12 h-12 rounded-full" />
                        <div className="flex-grow">
                            <p className="font-semibold">{review?.tourist?.name}</p>
                            <div className="flex items-center gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        className={cn(
                                            "w-5 h-5",
                                            star <= review?.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                        )}
                                    />
                                ))}
                            </div>
                            <p className="mt-2 text-gray-700">{review?.comment}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No reviews yet.</p>
            )}
        </div>
    );
}
