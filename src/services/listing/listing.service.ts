"use server";

import { serverFetch } from "@/lib/server-fetch";

interface GetListingsParams {
  searchTerm?: string;
  location?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  language?: string;
  page?: string;
  limit?: string;
}

export async function getListings(params: GetListingsParams = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.set(key, value);
    });

    const res = await serverFetch.get(`/listings?${queryParams.toString()}`);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch listings: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching listings:", error);
    return {
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 12,
      },
    };
  }
}

export async function getSingleListing(id: string) {
  try {
    const res = await serverFetch.get(`/listings/${id}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch listing: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching listing:", error);
    return null;
  }
}

export async function getCategories() {
  try {
    const res = await serverFetch.get("/listings/categories/list", {
      next: { revalidate: 86400 }, // Cache for 1 day
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getLanguages() {
  try {
    const res = await serverFetch.get("/listings/languages/list", {
      next: { revalidate: 86400 }, // Cache for 1 day
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch languages: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching languages:", error);
    return [];
  }
}