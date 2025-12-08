/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";
import { envVariables } from "@/lib/env";
import { cookies } from "next/headers";

export async function createBookingAction(
  listingId: string,
  formData: FormData
) {
  "use server";
  const date = String(formData.get("date") || "");
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) {
    return { error: "Please login to book." };
  }
  try {
    const res = await fetch(`${envVariables.BASE_API_URL}/bookings`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: token,
      },
      credentials: "include",
      body: JSON.stringify({ listingId, date }),
    });
    const json = await res.json();
    if (!res.ok) {
      return { error: json?.message || "Failed to create booking" };
    }
    return { success: true };
  } catch (_err: unknown) {
    return { error: "Network error. Please try again." };
  }
}

export default async function TourDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(
    `${envVariables.BASE_API_URL}/listings/${params.id}`,
    {
      cache: "no-store",
    }
  );
  const json = await res.json();
  const tour = json?.data;

  return (
    <div className='max-w-5xl mx-auto py-8 px-4'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-2'>
          <div className='aspect-video bg-zinc-100 mb-4' />
          <h1 className='text-2xl font-semibold'>{tour?.title}</h1>
          <p className='text-zinc-600'>{tour?.location}</p>
          <p className='mt-3'>{tour?.description}</p>
          <h2 className='mt-6 font-semibold'>Reviews</h2>
          <div className='mt-2 space-y-2'>
            {(
              (tour?.reviews as {
                id: string;
                rating: number;
                comment: string;
              }[]) || []
            ).map((r) => (
              <div key={r.id} className='border rounded p-3'>
                <p className='font-medium'>Rating: {r.rating}</p>
                <p className='text-sm text-zinc-600'>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className='border rounded p-4'>
            <p className='text-lg font-semibold'>${tour?.price}</p>
            <form
              action={async (formData: FormData) => {
                const result = await createBookingAction(params.id, formData);
                if (result.error) {
                  alert(result.error);
                }
              }}
              className='mt-3 space-y-3'>
              <div>
                <label className='block text-sm'>Date</label>
                <input
                  name='date'
                  type='date'
                  className='mt-1 w-full rounded border px-3 py-2'
                  required
                />
              </div>
              <button
                type='submit'
                className='w-full rounded bg-black text-white py-2'>
                Request to Book
              </button>
            </form>
            <p className='mt-2 text-xs text-zinc-600'>
              Guide: {tour?.guide?.name}
            </p>
            <div className='mt-6'>
              <h3 className='font-semibold mb-2'>Write a Review</h3>
              <form
                action={async (formData: FormData) => {
                  const result = await postReviewAction(params.id, formData);
                  if (result.error) {
                    alert(result.error);
                  }
                }}
                className='space-y-2'>
                <input
                  name='rating'
                  type='number'
                  min={1}
                  max={5}
                  className='w-full rounded border px-3 py-2'
                  placeholder='Rating (1-5)'
                />
                <textarea
                  name='comment'
                  className='w-full rounded border px-3 py-2'
                  placeholder='Your experience'></textarea>
                <button
                  type='submit'
                  className='rounded bg-black text-white px-4 py-2'>
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function postReviewAction(listingId: string, formData: FormData) {
  "use server";
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return { error: "Please login to review." };
  const rating = Number(formData.get("rating") || 0);
  const comment = String(formData.get("comment") || "");
  try {
    const res = await fetch(`${envVariables.BASE_API_URL}/reviews`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: token },
      body: JSON.stringify({ listingId, rating, comment }),
    });
    const json = await res.json();
    if (!res.ok) return { error: json?.message || "Failed to post review" };
    return { success: true };
  } catch {
    return { error: "Network error. Please try again." };
  }
}
