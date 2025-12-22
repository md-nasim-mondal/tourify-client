"use server";

import { cookies } from "next/headers";
import { serverFetch } from "@/lib/server-fetch";

export async function submitBulkBooking(bookings: any[]) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return { success: false, message: "Unauthorized. Please login." };
    }

    try {
        const results = await Promise.all(
            bookings.map(async (item) => {
                const bookingDate = new Date(item.date);
                // Ensure date is valid or handle parsing
                if (isNaN(bookingDate.getTime())) return { success: false, message: "Invalid date" };

                // createBooking standard payload
                const payload = {
                    listingId: item.listingId,
                    date: bookingDate.toISOString(),
                    groupSize: item.groupSize,
                };

                const res = await serverFetch.post("/bookings", {
                    body: JSON.stringify(payload),
                    headers: {
                        "Content-Type": "application/json",
                    },
                    accessToken // Pass explicit token to util if needed, 
                    // but serverFetch util also checks cookies if not passed.
                    // But passing it ensures it uses the one we found.
                });
                return await res.json();
            })
        );

        // Check if all failed or partial success
        const successful = results.filter(r => r.success || r.data);
        if (successful.length === 0 && bookings.length > 0) {
            return { success: false, message: "All bookings failed. Please check availability." };
        }

        return { success: true, count: successful.length, message: `Successfully requested ${successful.length} bookings!` };
    } catch (error) {
        console.error("Bulk booking error:", error);
        return { success: false, message: "Failed to process bookings." };
    }
}
