import { categories } from "../data/mockData";

export default function SidebarFilter({ selectedCategory, setSelectedCategory, price, setPrice }) {
  return (
    <aside className="surface h-fit p-5 lg:sticky lg:top-24">
      <h3 className="mb-4 text-lg font-bold">Filters</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <button key={category} onClick={() => setSelectedCategory(category)} className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${selectedCategory === category ? "bg-brand-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
            {category}
          </button>
        ))}
      </div>
      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm font-semibold">
          <span>Max Price</span>
          <span>₹{price}</span>
        </div>
        <input type="range" min="200" max="1300" value={price} onChange={(event) => setPrice(Number(event.target.value))} className="w-full accent-brand-600" />
      </div>
      <div className="mt-6 rounded-2xl bg-brand-50 p-4 text-sm text-brand-700 dark:bg-brand-500/10 dark:text-brand-100">
        Free delivery on orders above ₹999.
      </div>
    </aside>
  );
}
