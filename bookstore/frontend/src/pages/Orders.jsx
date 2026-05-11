import { CheckCircle2, Package, Truck } from "lucide-react";
import { orders } from "../data/mockData";

export default function Orders() {
  return (
    <main className="container-shell mt-8">
      <h1 className="text-3xl font-black">My Orders</h1>
      <div className="mt-6 space-y-5">
        {orders.map((order) => (
          <article key={order.id} className="surface p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-black">{order.id}</h2>
                <p className="text-sm text-slate-500">{order.date} • {order.items} item(s)</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black">₹{order.total}</p>
                <p className="text-sm font-semibold text-brand-600">{order.status}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { icon: CheckCircle2, label: "Placed" },
                { icon: Package, label: "Packed" },
                { icon: Truck, label: "Delivered" }
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                    <Icon className="text-brand-600" />
                    <p className="mt-2 font-semibold">{step.label}</p>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
