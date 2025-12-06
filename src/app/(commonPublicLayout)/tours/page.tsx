const API_URL =
  `${process.env.NEXT_PUBLIC_API_URL}/api/v1` || "http://localhost:5000/api/v1";

type Listing = { id: string; title: string; location: string; price: number };

export default async function ToursPage({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const normalized = Object.fromEntries(
    Object.entries(searchParams || {}).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
  );
  const qs = new URLSearchParams(normalized).toString();
  const res = await fetch(`${API_URL}/listings${qs ? `?${qs}` : ""}`, {
    cache: "no-store",
  });
  const json = await res.json();
  const items: Listing[] = json?.data || [];

  return (
    <div className='max-w-6xl mx-auto py-8 px-4'>
      <h1 className='text-2xl font-semibold mb-4'>Explore Tours</h1>
      <form method='GET' className='grid grid-cols-1 md:grid-cols-4 gap-3 mb-6'>
        <input
          name='searchTerm'
          placeholder='Search'
          className='rounded border px-3 py-2'
        />
        <input
          name='location'
          placeholder='Location'
          className='rounded border px-3 py-2'
        />
        <input
          name='minPrice'
          placeholder='Min Price'
          className='rounded border px-3 py-2'
        />
        <input
          name='maxPrice'
          placeholder='Max Price'
          className='rounded border px-3 py-2'
        />
        <button
          type='submit'
          className='md:col-span-4 rounded bg-black text-white py-2'>
          Filter
        </button>
      </form>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {items.map((it) => (
          <a
            key={it.id}
            href={`/tours/${it.id}`}
            className='border rounded overflow-hidden'>
            <div className='aspect-video bg-zinc-100' />
            <div className='p-3'>
              <h3 className='font-semibold'>{it.title}</h3>
              <p className='text-sm text-zinc-600'>{it.location}</p>
              <p className='mt-2 font-medium'>${it.price}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
