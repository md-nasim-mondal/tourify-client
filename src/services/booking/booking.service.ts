import { serverFetch } from "@/lib/server-fetch";

type CreateBookingPayload = {
  listingId: string;
  date: string;
  groupSize: number;
};

export const createBooking = async (
  payload: CreateBookingPayload,
  accessToken: string
) => {
  const res = await serverFetch.post("/bookings", {
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
    accessToken,
  });
  return await res.json();
};

export const getBookings = async (
  params: { limit?: number; page?: number } = {}
) => {
  const query = new URLSearchParams();
  if (params.limit) query.set("limit", String(params.limit));
  if (params.page) query.set("page", String(params.page));

  const res = await serverFetch.get(`/bookings?${query.toString()}`);
  return await res.json();
};
