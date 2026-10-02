import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, Boxes, LayoutDashboard, ShoppingBag, Users } from "lucide-react";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Boxes },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 }
];

export default function AdminLayout() {
  return (
    <main className="container-shell mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="surface h-fit p-4 lg:sticky lg:top-24">
        <h2 className="mb-4 px-3 text-lg font-black">Admin Panel</h2>
        <nav className="space-y-2">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink key={link.to} to={link.to} end={link.to === "/admin"} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition ${isActive ? "bg-brand-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                <Icon size={18} /> {link.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <Outlet />
    </main>
  );
}
