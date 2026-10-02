import { useMemo, useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import SidebarFilter from "../components/SidebarFilter";
import { ProductSkeleton } from "../components/Skeletons";
import api from "../utils/api";
import { toast } from "react-toastify";

export default function Products() {
  const [category, setCategory] = useState("All");
  const [price, setPrice] = useState(1300);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/books");
        setProducts(response.data);
      } catch (err) {
        toast.error("Failed to load books");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filtered = useMemo(() => products.filter((product) => {
    const categoryMatch = category === "All" || product.category === category;
    const priceMatch = product.price <= price;
    const searchMatch = `${product.name} ${product.author}`.toLowerCase().includes(query.toLowerCase());
    return categoryMatch && priceMatch && searchMatch;
  }), [category, price, query, products]);

  return (
    <main className="container-shell mt-8">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="font-semibold text-brand-600">Book Collection</p>
          <h1 className="text-3xl font-black">Explore books</h1>
        </div>
        <input className="input max-w-md" placeholder="Search by book or author..." value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <SidebarFilter selectedCategory={category} setSelectedCategory={setCategory} price={price} setPrice={setPrice} />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? [1, 2, 3].map((item) => <ProductSkeleton key={item} />) : 
           filtered.length ? filtered.map((product) => <ProductCard key={product.id} product={product} />) : 
           <p className="col-span-full text-center text-slate-500">No books found matching your criteria.</p>}
        </div>
      </div>
    </main>
  );
}
