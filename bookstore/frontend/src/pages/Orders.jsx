import { CheckCircle2, Package, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../utils/api";

export default function Orders() {
  const [orders, setOrders] = useState([]), [loading, setLoading] = useState(true), [error, setError] = useState("");
  useEffect(() => { api.get("/orders/my-orders").then(({ data }) => setOrders(data)).catch(err => setError(err.response?.data?.error || "Unable to load your orders.")).finally(() => setLoading(false)); }, []);
  if (loading) return <main className="container-shell mt-8"><p>Loading your orders...</p></main>;
  return <main className="container-shell mt-8"><h1 className="text-3xl font-black">My Orders</h1>{error ? <p className="mt-6 text-red-600">{error}</p> : orders.length === 0 ? <p className="mt-6 text-slate-500">No orders found.</p> : <div className="mt-6 space-y-5">{orders.map(order => <article key={order.id} className="surface p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-black">Order #{order.id}</h2><p className="text-sm text-slate-500">{new Date(order.orderDate).toLocaleDateString()} • {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)</p></div><div className="text-right"><p className="text-xl font-black">₹{order.totalAmount}</p><p className="text-sm font-semibold text-brand-600">{order.status}</p></div></div><div className="mt-4 space-y-1 text-sm text-slate-600 dark:text-slate-300">{order.items.map(item => <p key={item.id}>{item.bookName} × {item.quantity} — ₹{item.price}</p>)}</div><div className="mt-6 grid gap-3 sm:grid-cols-3">{[{ icon: CheckCircle2, label: "Placed" }, { icon: Package, label: "Processing" }, { icon: Truck, label: "Delivery" }].map(step => { const Icon = step.icon; return <div key={step.label} className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800"><Icon className="text-brand-600" /><p className="mt-2 font-semibold">{step.label}</p></div>; })}</div></article>)}</div>}</main>;
}
