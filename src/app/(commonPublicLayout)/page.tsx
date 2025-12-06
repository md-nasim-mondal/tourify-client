export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="bg-linear-to-b from-zinc-100 to-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold">Explore with Local Guides</h1>
          <p className="mt-2 text-zinc-600">Find authentic experiences from locals.</p>
          <form action="/tours" method="GET" className="mt-6 flex gap-2">
            <input name="searchTerm" placeholder="Where are you going?" className="flex-1 rounded border px-4 py-3" />
            <button className="rounded bg-black text-white px-6">Search</button>
          </form>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Discover", "Request", "Enjoy"].map((t) => (
              <div key={t} className="border rounded p-4">
                <h3 className="font-medium">{t}</h3>
                <p className="text-sm text-zinc-600">Lorem ipsum dolor sit amet.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">Popular Destinations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Paris", "Tokyo", "Istanbul", "New York"].map((c) => (
              <div key={c} className="h-28 rounded bg-zinc-200 flex items-center justify-center font-medium">{c}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">Top-Rated Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map((i) => (
              <div key={i} className="border rounded p-4">
                <div className="h-32 bg-zinc-100 rounded mb-3" />
                <p className="font-medium">Guide Name {i}</p>
                <p className="text-sm text-zinc-600">⭐⭐⭐⭐☆</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map((i) => (
              <div key={i} className="border rounded p-4">
                <p className="text-sm text-zinc-600">“Amazing experience!”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {["Food", "Art", "Adventure", "History", "Nightlife", "Shopping"].map((c) => (
              <div key={c} className="h-20 rounded bg-zinc-200 flex items-center justify-center text-sm">{c}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold">Become a Guide</h2>
          <p className="mt-2 text-zinc-300">Share your city and earn.</p>
          <a href="/register" className="mt-6 inline-block rounded bg-white text-black px-6 py-3">Get Started</a>
        </div>
      </section>
    </div>
  );
}
