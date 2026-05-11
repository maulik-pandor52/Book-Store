import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { BookOpen, Heart, Menu, Moon, Search, ShoppingCart, Sun, UserRound, X, LogOut } from "lucide-react";
import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Books" },
  { to: "/orders", label: "Orders" },
  { to: "/admin", label: "Admin" }
];

export default function Layout({ darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="container-shell flex h-20 items-center gap-4">
          <Link to="/" className="flex items-center gap-3 font-bold">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-600 text-white shadow-lg">
              <BookOpen size={24} />
            </span>
            <span className="text-xl">Book Store</span>
          </Link>

          <div className="hidden flex-1 items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900 lg:flex">
            <Search size={20} className="text-slate-400" />
            <input className="ml-3 w-full bg-transparent text-sm outline-none" placeholder="Search books, authors, categories..." />
          </div>

          <nav className="ml-auto hidden items-center gap-2 lg:flex">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => `rounded-xl px-4 py-2 text-sm font-semibold transition ${isActive ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-100" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"}`}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link to="/cart" className="relative rounded-xl p-3 hover:bg-slate-100 dark:hover:bg-slate-900" aria-label="Cart">
              <ShoppingCart size={20} />
            </Link>
            
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="rounded-xl p-3 hover:bg-slate-100 dark:hover:bg-slate-900" aria-label="Profile">
                  <UserRound size={20} />
                </Link>
                <button onClick={handleLogout} className="rounded-xl p-3 hover:bg-slate-100 dark:hover:bg-slate-900 text-red-500">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm px-4 py-2">Login</Link>
            )}

            <button onClick={() => setDarkMode((value) => !value)} className="rounded-xl p-3 hover:bg-slate-100 dark:hover:bg-slate-900" aria-label="Toggle theme">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <button onClick={() => setMenuOpen((value) => !value)} className="ml-auto rounded-xl p-3 hover:bg-slate-100 dark:hover:bg-slate-900 lg:hidden" aria-label="Open menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="container-shell pb-5 lg:hidden">
            <div className="surface p-3">
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800">
                  {link.label}
                </NavLink>
              ))}
              <div className="grid grid-cols-3 gap-2 pt-3">
                <Link to="/cart" className="btn-secondary">Cart</Link>
                {user ? (
                  <>
                    <Link to="/profile" className="btn-secondary">Profile</Link>
                    <button onClick={handleLogout} className="btn-secondary text-red-500">Logout</button>
                  </>
                ) : (
                  <Link to="/login" className="btn-secondary">Login</Link>
                )}
                <button onClick={() => setDarkMode((value) => !value)} className="btn-secondary">Theme</button>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      <Outlet />
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container-shell grid gap-8 py-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="mb-3 flex items-center gap-3 font-bold">
            <BookOpen className="text-brand-600" /> Book Store
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
            A modern bookstore experience with curated books, fast checkout, order tracking, and a clean MERN-style architecture.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Shop</h4>
          <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <p>Programming</p>
            <p>Business</p>
            <p>Exam Prep</p>
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-semibold">Support</h4>
          <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <p>Help Center</p>
            <p>Returns</p>
            <p>Contact</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
