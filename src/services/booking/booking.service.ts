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
  params: { limit?: number; page?: number; status?: string } = {}
) => {
  const query = new URLSearchParams();
  if (params.limit) query.set("limit", String(params.limit));
  if (params.page) query.set("page", String(params.page));
  if (params.status) query.set("status", params.status);

  const res = await serverFetch.get(`/bookings?${query.toString()}`);
  return await res.json();
};

export const deleteBooking = async (id: string) => {
  const res = await serverFetch.delete(`/bookings/${id}`);
  return await res.json();
};
