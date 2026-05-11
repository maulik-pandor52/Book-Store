import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { toast } from "react-toastify";
import api from "../utils/api";

export default function ProductCard({ product }) {
  const handleAddToCart = async () => {
    try {
      await api.post(`/cart/${product.id}`);
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add to cart. Please login.");
    }
  };

  // Provide fallback colors if they are not from DB
  const color = product.color || "from-blue-500 to-indigo-600";

  return (
    <motion.article whileHover={{ y: -6 }} className="surface overflow-hidden">
      <Link to={`/products/${product.id}`} className={`relative flex h-56 items-center justify-center bg-gradient-to-br ${color} p-6 text-white`}>
        <span className="absolute left-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">
          {product.discount || 10}% OFF
        </span>
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-white/75">Book Store</p>
          <h3 className="mt-3 text-2xl font-black leading-tight">{product.name}</h3>
          <p className="mt-2 text-sm text-white/80">{product.author}</p>
        </div>
      </Link>
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {product.category || "General"}
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-amber-500">
            <Star size={16} fill="currentColor" /> {product.rating || 4.5}
          </span>
        </div>
        <Link to={`/products/${product.id}`} className="line-clamp-1 text-lg font-bold hover:text-brand-600">
          {product.name}
        </Link>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{product.author}</p>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-2xl font-black">₹{product.price}</p>
            {product.oldPrice && <p className="text-sm text-slate-400 line-through">₹{product.oldPrice}</p>}
          </div>
          <button onClick={handleAddToCart} className="btn-primary px-4 py-3">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
