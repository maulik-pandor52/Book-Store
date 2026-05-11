import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";

export default function PaymentResult() {
  const failed = useLocation().pathname.includes("failure");
  const Icon = failed ? XCircle : CheckCircle2;

  return (
    <main className="container-shell mt-8">
      <section className="surface mx-auto max-w-2xl p-10 text-center">
        <Icon className={`mx-auto h-20 w-20 ${failed ? "text-red-500" : "text-emerald-500"}`} />
        <h1 className="mt-6 text-3xl font-black">{failed ? "Payment failed" : "Payment successful"}</h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          {failed ? "Your payment could not be completed. Please try again." : "Your order has been placed and is being prepared."}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/orders" className="btn-primary">View Orders</Link>
          <Link to="/products" className="btn-secondary">Continue Shopping</Link>
        </div>
      </section>
    </main>
  );
}
