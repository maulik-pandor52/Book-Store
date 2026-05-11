import { backendPath } from "../utils/backend";

export default function AddProduct() {
  return (
    <main className="container-shell mt-8">
      <section className="surface mx-auto max-w-3xl p-6">
        <h1 className="text-3xl font-black">Add Product</h1>
        <p className="mt-2 text-slate-500">This form posts to your existing Spring Boot `/save` endpoint.</p>
        <form method="post" action={backendPath("/save")} className="mt-6 grid gap-4 sm:grid-cols-2">
          <input className="input" name="name" required placeholder="Book name" />
          <input className="input" name="author" required placeholder="Author" />
          <input className="input" name="price" type="number" required placeholder="Price" />
          <input className="input" name="quantity" type="number" required placeholder="Quantity" />
          <textarea className="input sm:col-span-2" rows="4" placeholder="Description for UI preview" />
          <button className="btn-primary sm:col-span-2">Save Product</button>
        </form>
      </section>
    </main>
  );
}
