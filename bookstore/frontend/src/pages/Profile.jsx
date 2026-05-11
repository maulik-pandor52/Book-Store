import { Camera, ShieldCheck } from "lucide-react";

export default function Profile() {
  return (
    <main className="container-shell mt-8">
      <div className="surface overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-slate-950 to-brand-600" />
        <div className="p-6">
          <div className="-mt-20 flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="grid h-32 w-32 place-items-center rounded-3xl border-4 border-white bg-brand-600 text-4xl font-black text-white dark:border-slate-900">M</div>
            <div className="pb-2">
              <h1 className="text-3xl font-black">Maulik Kumar</h1>
              <p className="text-slate-500">maulik@example.com</p>
            </div>
            <button className="btn-secondary sm:ml-auto"><Camera size={18} /> Change Photo</button>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <input className="input" defaultValue="Maulik Kumar" />
            <input className="input" defaultValue="maulik@example.com" />
            <input className="input" defaultValue="9876543210" />
            <input className="input" defaultValue="Ahmedabad, Gujarat" />
          </div>
          <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-100">
            <ShieldCheck className="mb-2" /> Email verification enabled.
          </div>
        </div>
      </div>
    </main>
  );
}
