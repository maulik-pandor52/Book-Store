import { Link, useParams } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import api from "../utils/api";

export default function ProductDetails() {
  const { id } = useParams(); const [product, setProduct] = useState(null);
  useEffect(() => { api.get("/books").then(({ data }) => setProduct(data.find(book => book.id === Number(id)) || null)).catch(() => toast.error("Unable to load book.")); }, [id]);
  const addToCart = async () => { try { await api.post(`/cart/${id}`); toast.success("Added to cart"); } catch (error) { toast.error(error.response?.data?.error || "Please login to add a book."); } };
  if (!product) return <main className="container-shell mt-8"><p>Loading book...</p></main>;
  return <main className="container-shell mt-8"><div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"><div className="surface flex min-h-[520px] items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-10 text-white"><div className="text-center"><p className="text-sm uppercase tracking-[0.25em] text-white/70">Book Store Edition</p><h1 className="mt-6 text-5xl font-black">{product.name}</h1><p className="mt-4 text-white/75">{product.author}</p></div></div><section className="surface p-8"><span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700 dark:bg-brand-500/10 dark:text-brand-100">Book</span><h1 className="mt-5 text-4xl font-black">{product.name}</h1><p className="mt-2 text-slate-500 dark:text-slate-400">by {product.author}</p><div className="mt-4 flex items-center gap-2 text-amber-500">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={20} fill="currentColor" />)}</div><div className="mt-8"><span className="text-4xl font-black">₹{product.price}</span><p className="mt-2 text-sm text-slate-500">{product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}</p></div><div className="mt-8 flex flex-wrap gap-3"><button disabled={product.quantity <= 0} onClick={addToCart} className="btn-primary disabled:opacity-50"><ShoppingCart size={18} /> Add to Cart</button><button className="btn-secondary"><Heart size={18} /> Wishlist</button><Link to="/cart" className="btn-secondary">View Cart</Link></div></section></div></main>;
}
