import UpdateListingForm from "@/components/modules/listing/UpdateListingForm";
import { serverFetch } from "@/lib/server-fetch";
import { notFound } from "next/navigation";

async function getListingDetails(id: string) {
  const res = await serverFetch.get(`/listings/${id}`);
  const result = await res.json();

  console.log(result, "from line 9: ");
  if (result?.success) {
    return result.data;
  }
  return notFound();
}

async function getCategories() {
  const res = await serverFetch.get("/listings/categories/list");
  const result = await res.json();
  if (result.success) {
    return result.data;
  }
  return [];
}

async function getLanguages() {
  const res = await serverFetch.get("/listings/languages/list");
  const result = await res.json();
  if (result.success) {
    return result.data;
  }
  return [];
}

export default async function GuideEditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const listing = await getListingDetails((await params).id);
  const categories = await getCategories();
  const languages = await getLanguages();

  return (
    <div className='max-w-4xl mx-auto py-8 px-4'>
      <div className='border rounded-lg p-6'>
        <h1 className='text-2xl font-semibold mb-6'>Edit Your Tour Listing</h1>
        <UpdateListingForm
          listing={listing}
          categories={categories}
          languages={languages}
        />
      </div>
    </div>
  );
}
