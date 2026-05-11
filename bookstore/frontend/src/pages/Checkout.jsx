import { CreditCard, MapPin, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

export default function Checkout() {
  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const response = await api.get("/payment/checkout");
        setCheckoutData(response.data);
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to load checkout data");
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();

    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [navigate]);

  const handlePayment = () => {
    if (!checkoutData) return;

    const options = {
      key: checkoutData.razorpayKeyId,
      amount: checkoutData.amountInPaise,
      currency: "INR",
      name: "Book Store",
      description: "Book Purchase",
      handler: async function (response) {
        try {
          const res = await api.post("/payment/success", {
            razorpay_payment_id: response.razorpay_payment_id,
          });
          toast.success(res.data.message);
          navigate("/payment-success");
        } catch (err) {
          toast.error("Payment verification failed");
        }
      },
      prefill: {
        name: "User",
        email: "user@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#4f46e5"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (loading) return <main className="container-shell mt-8"><p>Loading checkout...</p></main>;

  return (
    <main className="container-shell mt-8">
      <h1 className="text-3xl font-black">Checkout</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="surface p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold"><MapPin className="text-brand-600" /> Delivery Address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input className="input" placeholder="Full name" />
              <input className="input" placeholder="Phone number" />
              <input className="input sm:col-span-2" placeholder="Address line" />
              <input className="input" placeholder="City" />
              <input className="input" placeholder="Pincode" />
            </div>
          </div>
          <div className="surface p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold"><CreditCard className="text-brand-600" /> Payment</h2>
            <div className="mt-4 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-100">
              Razorpay checkout will open in a secure popup.
            </div>
          </div>
        </section>
        <aside className="surface h-fit p-6 lg:sticky lg:top-24">
          <h2 className="text-xl font-black">Payable Amount</h2>
          <p className="mt-4 text-4xl font-black">₹{checkoutData?.total}</p>
          <p className="mt-2 text-sm text-slate-500">Including delivery and discounts.</p>
          <button onClick={handlePayment} className="btn-primary mt-6 w-full"><ShieldCheck size={18} /> Pay with Razorpay</button>
        </aside>
      </div>
    </main>
  );
}
