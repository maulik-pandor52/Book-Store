import { Link, useParams } from "react-router-dom";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { toast } from "react-toastify";
import { products } from "../data/mockData";
import { backendPath } from "../utils/backend";

export default function ProductDetails() {
  const { id } = useParams();
  const product = products.find((item) => item.id === Number(id)) || products[0];

  return (
    <main className="container-shell mt-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className={`surface flex min-h-[520px] items-center justify-center bg-gradient-to-br ${product.color} p-10 text-white`}>
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-white/70">Book Store Edition</p>
            <h1 className="mt-6 text-5xl font-black">{product.name}</h1>
            <p className="mt-4 text-white/75">{product.author}</p>
          </div>
        </div>
        <section className="surface p-8">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700 dark:bg-brand-500/10 dark:text-brand-100">{product.category}</span>
          <h1 className="mt-5 text-4xl font-black">{product.name}</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">by {product.author}</p>
          <div className="mt-4 flex items-center gap-2 text-amber-500">
            {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={20} fill="currentColor" />)}
            <span className="ml-2 text-sm font-semibold text-slate-500">{product.rating} rating</span>
          </div>
          <div className="mt-8 flex items-end gap-4">
            <span className="text-4xl font-black">₹{product.price}</span>
            <span className="text-lg text-slate-400 line-through">₹{product.oldPrice}</span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">{product.discount}% off</span>
          </div>
          <p className="mt-6 leading-8 text-slate-600 dark:text-slate-300">
            A carefully selected title for students and readers. This page is ready for your backend product-detail API when you add one.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={backendPath(`/cart/${product.id}`)} onClick={() => toast.success("Added to cart")} className="btn-primary"><ShoppingCart size={18} /> Add to Cart</a>
            <button className="btn-secondary"><Heart size={18} /> Wishlist</button>
            <a href={backendPath("/checkout")} className="btn-secondary">Buy Now</a>
          </div>
        </section>
      </div>
    </main>
  );
}
