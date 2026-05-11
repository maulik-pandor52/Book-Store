import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Boxes, IndianRupee, ShoppingBag, Users } from "lucide-react";
import { orders, products, salesData, users } from "../data/mockData";

export function AdminDashboard() {
  return (
    <section>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Revenue", value: "₹31,000", icon: IndianRupee },
          { label: "Orders", value: "128", icon: ShoppingBag },
          { label: "Products", value: products.length, icon: Boxes },
          { label: "Users", value: users.length, icon: Users }
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="surface p-5">
              <Icon className="text-brand-600" />
              <p className="mt-4 text-sm text-slate-500">{card.label}</p>
              <p className="text-2xl font-black">{card.value}</p>
            </div>
          );
        })}
      </div>
      <div className="surface mt-6 p-6">
        <h2 className="mb-4 text-xl font-black">Sales Analytics</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#ea580c" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export function AdminProducts() {
  return (
    <section className="surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
        <h1 className="text-xl font-black">Product Management</h1>
        <Link to="/add-product" className="btn-primary py-2">Add Product</Link>
      </div>
      <Table headers={["Book", "Category", "Price", "Stock", "Status"]} rows={products.map((item) => [item.name, item.category, `₹${item.price}`, item.stock, "Active"])} />
    </section>
  );
}

export function AdminUsers() {
  return (
    <section className="surface overflow-hidden">
      <div className="border-b border-slate-200 p-5 dark:border-slate-800">
        <h1 className="text-xl font-black">User Management</h1>
      </div>
      <Table headers={["Name", "Email", "Role", "Status"]} rows={users.map((user) => [user.name, user.email, user.role, user.status])} />
    </section>
  );
}

export function AdminOrders() {
  return (
    <section className="surface overflow-hidden">
      <div className="border-b border-slate-200 p-5 dark:border-slate-800">
        <h1 className="text-xl font-black">Order Tracking</h1>
      </div>
      <Table headers={["Order ID", "Date", "Items", "Total", "Status"]} rows={orders.map((order) => [order.id, order.date, order.items, `₹${order.total}`, order.status])} />
    </section>
  );
}

export function AdminAnalytics() {
  return (
    <section className="surface p-6">
      <h1 className="text-xl font-black">Analytics</h1>
      <p className="mt-2 text-slate-500">Monthly sales chart and summary cards for presentation.</p>
      <div className="mt-6 h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="#0f172a" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          <tr>{headers.map((header) => <th key={header} className="px-5 py-4 font-bold">{header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((row, index) => (
            <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-900">
              {row.map((cell, cellIndex) => <td key={cellIndex} className="px-5 py-4 font-semibold">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
