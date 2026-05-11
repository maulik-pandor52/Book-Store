import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get("/cart");
      setCartItems(response.data.items);
      setSubtotal(response.data.total);
    } catch (err) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      fetchCart();
      toast.success("Removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const delivery = subtotal > 999 ? 0 : 60;

  if (loading) return <main className="container-shell mt-8"><p>Loading cart...</p></main>;

  return (
    <main className="container-shell mt-8">
      <h1 className="text-3xl font-black">Shopping cart</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-4">
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="surface flex flex-col gap-4 p-4 sm:flex-row">
                <div className="h-32 w-full rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 sm:w-28" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <p className="text-sm text-slate-500">{item.author}</p>
                  <p className="mt-3 text-xl font-black">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => removeFromCart(item.id)} className="rounded-xl border border-red-200 p-2 text-red-600 dark:border-red-500/30">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
        <aside className="surface h-fit p-6 lg:sticky lg:top-24">
          <h2 className="text-xl font-black">Order Summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{delivery && subtotal > 0 ? `₹${delivery}` : "Free"}</span></div>
            <div className="border-t pt-3 text-lg font-black dark:border-slate-800 flex justify-between"><span>Total</span><span>₹{subtotal > 0 ? subtotal + delivery : 0}</span></div>
          </div>
          <Link to="/checkout" className={`btn-primary mt-6 w-full ${cartItems.length === 0 ? 'pointer-events-none opacity-50' : ''}`}>Proceed to Checkout</Link>
        </aside>
      </div>
    </main>
  );
}
