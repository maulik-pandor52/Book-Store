import { Camera, Save, ShieldCheck } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

export default function Profile() {
  const { user, login } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", phoneNumber: "", address: "" }); const [saving, setSaving] = useState(false);
  useEffect(() => { setForm({ name: user?.name || "", email: user?.email || "", phoneNumber: user?.phoneNumber || "", address: user?.address || "" }); }, [user]);
  const initial = form.name.trim().charAt(0)?.toUpperCase() || "U";
  const save = async event => { event.preventDefault(); setSaving(true); try { const { data } = await api.put("/auth/me", form); login(data, localStorage.getItem("token")); toast.success("Profile updated successfully"); } catch (error) { toast.error(error.response?.data?.error || "Unable to update profile."); } finally { setSaving(false); } };
  return <main className="container-shell mt-8">
    <div className="surface overflow-hidden">
      <div className="h-40 bg-gradient-to-r from-slate-950 via-slate-900 to-brand-600"/>
      <form onSubmit={save} className="p-6">
        <div className="-mt-20 flex flex-col gap-5 sm:flex-row sm:items-end">
          <div className="grid h-32 w-32 shrink-0 place-items-center rounded-3xl border-4 border-white bg-brand-600 text-4xl font-black text-white shadow-lg dark:border-slate-900">{initial}</div>
          <div className="sm:translate-y-8">
            <h1 className="text-3xl font-black">{form.name || "Account"}</h1>
            <p className="mt-1 text-slate-500">{form.email || form.phoneNumber || "No contact information"}</p>
            <p className="mt-1 text-sm font-semibold text-brand-600">{user?.role}</p>
          </div>
          <button type="button" className="btn-secondary sm:ml-auto" disabled title="Photo upload is not configured yet"><Camera size={18}/> Change Photo</button>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Full name"/>
          <input className="input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="Email address"/>
          <input className="input" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} placeholder="Phone number"/>
          <input className="input" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Address"/>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-100"><ShieldCheck className="mb-2"/>Your name, contact details, and address can be updated. Role and password are protected.</div>
          <button className="btn-primary" disabled={saving}><Save size={18}/>{saving ? "Saving..." : "Save Details"}</button>
        </div>
      </form>
    </div>
  </main>;
}
