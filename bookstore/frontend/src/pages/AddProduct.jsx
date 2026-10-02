import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-toastify";

export default function AddProduct() {
  const [book, setBook] = useState({ name: "", author: "", category: "", description: "", price: "", quantity: "" }); const navigate = useNavigate();
  const submit = async event => { event.preventDefault(); try { await api.post("/books", { ...book, price: Number(book.price), quantity: Number(book.quantity) }); toast.success("Book added successfully"); navigate("/admin/products"); } catch (error) { toast.error(error.response?.data?.error || "Unable to add book."); } };
  return <main className="container-shell mt-8"><section className="surface mx-auto max-w-3xl p-6"><h1 className="text-3xl font-black">Add Book</h1><form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2"><input className="input" value={book.name} onChange={e => setBook({ ...book, name: e.target.value })} required placeholder="Book name"/><input className="input" value={book.author} onChange={e => setBook({ ...book, author: e.target.value })} required placeholder="Author"/><input className="input" value={book.category} onChange={e => setBook({ ...book, category: e.target.value })} placeholder="Category"/><input className="input" value={book.price} onChange={e => setBook({ ...book, price: e.target.value })} type="number" min="0" step="0.01" required placeholder="Price"/><input className="input" value={book.quantity} onChange={e => setBook({ ...book, quantity: e.target.value })} type="number" min="0" required placeholder="Quantity"/><textarea className="input sm:col-span-2" value={book.description} onChange={e => setBook({ ...book, description: e.target.value })} placeholder="Description"/><button className="btn-primary sm:col-span-2">Save Book</button></form></section></main>;
}
