import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, ShieldCheck, Truck } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import api from "../utils/api";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/books");
        setProducts(response.data);
      } catch (err) {
        console.error("Failed to load books for home page");
      }
    };
    fetchBooks();
  }, []);

  return (
    <main>
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-brand-700 text-white">
        <div className="container-shell grid min-h-[560px] items-center gap-10 py-14 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">Portfolio-ready bookstore UI</span>
            <h1 className="mt-6 text-4xl font-black leading-tight sm:text-6xl">Find your next favorite book faster.</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/75">
              A professional e-commerce experience with smart search, modern cards, smooth checkout, and a clean admin panel.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary bg-white text-slate-950 hover:bg-slate-100">Shop Books <ArrowRight size={18} /></Link>
              <Link to="/admin" className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/20">View Admin</Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-2 gap-4">
            {products.slice(0, 4).map((book) => (
              <div key={book.id} className={`rounded-3xl bg-gradient-to-br ${book.color || "from-blue-500 to-indigo-600"} p-5 shadow-2xl`}>
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">Featured</p>
                <h3 className="mt-8 text-xl font-black">{book.name}</h3>
                <p className="mt-2 text-sm text-white/75">{book.author}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="container-shell -mt-10 grid gap-4 md:grid-cols-3">
        {[
          { icon: Truck, title: "Fast Delivery", text: "Quick doorstep delivery for every order." },
          { icon: ShieldCheck, title: "Secure Checkout", text: "Razorpay-ready payment experience." },
          { icon: BadgeCheck, title: "Verified Accounts", text: "OTP enabled login and registration." }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="surface p-6">
              <Icon className="text-brand-600" />
              <h3 className="mt-4 font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.text}</p>
            </div>
          );
        })}
      </section>

      <section className="container-shell mt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-semibold text-brand-600">Trending Now</p>
            <h2 className="text-3xl font-black">Best selling books</h2>
          </div>
          <Link to="/products" className="font-semibold text-brand-600">View all</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </main>
  );
}
