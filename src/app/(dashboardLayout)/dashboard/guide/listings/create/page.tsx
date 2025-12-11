import CreateListingForm from "@/components/modules/listing/CreateListingForm";
import { serverFetch } from "@/lib/server-fetch";
export const dynamic = "force-dynamic";

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

export default async function GuideCreateListingPage() {
  const categories = await getCategories();
  const languages = await getLanguages();

  return (
    <div className='max-w-4xl mx-auto py-8 px-4'>
      <div className='border rounded-lg p-6'>
        <h1 className='text-2xl font-semibold mb-6'>
          Create a New Tour Listing
        </h1>
        <CreateListingForm categories={categories} languages={languages} />
      </div>
    </div>
  );
}
