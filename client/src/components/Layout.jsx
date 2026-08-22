import { Link, NavLink, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

function navClass({ isActive }) {
  return isActive
    ? "font-semibold text-indigo-700"
    : "text-slate-600 hover:text-indigo-700";
}

export default function Layout() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid size-10 place-items-center rounded-xl bg-indigo-600 font-bold text-white">
              M
            </div>
            <div>
              <div className="text-xl font-black tracking-tight">MarketHub</div>
              <div className="text-xs text-slate-500">Everything in one marketplace</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <NavLink to="/" className={navClass}>Home</NavLink>
            <NavLink to="/products" className={navClass}>Products</NavLink>
            {user?.role === "customer" && (
              <NavLink to="/orders" className={navClass}>My Orders</NavLink>
            )}
            {user?.role === "vendor" && (
              <NavLink to="/vendor/products" className={navClass}>Vendor Dashboard</NavLink>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/cart"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:border-indigo-300 hover:text-indigo-700"
            >
              Cart ({count})
            </Link>

            {user ? (
              <>
                <span className="hidden text-sm text-slate-600 lg:inline">
                  Hi, {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={logout}
                  className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-500">
          © {new Date().getFullYear()} MarketHub — CA 02 Interim Development
        </div>
      </footer>
    </div>
  );
}
