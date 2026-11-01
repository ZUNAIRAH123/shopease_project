import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ShoppingCart, Search, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSearch(event) {
    event.preventDefault();
    const text = searchText.trim();
    if (text === "") {
      navigate("/products");
    } else {
      navigate("/products?search=" + encodeURIComponent(text));
    }
    setMenuOpen(false);
  }

  function handleLogout() {
    logout();
    showToast("You have been logged out");
    setMenuOpen(false);
    navigate("/");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  const linkClass = "text-sm font-medium text-gray-600 hover:text-primary-600";

  // The search form is used twice (desktop bar and mobile menu)
  const searchForm = (
    <form onSubmit={handleSearch} className="relative w-full">
      <input
        type="text"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="Search products..."
        className="input pr-10"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600"
      >
        <Search size={18} />
      </button>
    </form>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <ShoppingBag className="text-primary-600" size={24} />
          ShopEase
        </Link>

        {/* Search (desktop) */}
        <div className="mx-4 hidden max-w-md flex-1 md:block">{searchForm}</div>

        <div className="ml-auto flex items-center gap-4">
          {/* Desktop links */}
          <nav className="hidden items-center gap-5 md:flex">
            <Link to="/products" className={linkClass}>Products</Link>
            {user !== null && <Link to="/orders" className={linkClass}>My Orders</Link>}
            {isAdmin && (
              <Link to="/admin" className={linkClass + " flex items-center gap-1"}>
                <LayoutDashboard size={16} /> Admin
              </Link>
            )}
            {user === null ? (
              <>
                <Link to="/login" className={linkClass}>Login</Link>
                <Link to="/signup" className="btn-primary">Sign up</Link>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-500">Hi, {user.name.split(" ")[0]}</span>
                <button onClick={handleLogout} className={linkClass + " flex items-center gap-1"}>
                  <LogOut size={16} /> Logout
                </button>
              </>
            )}
          </nav>

          {/* Cart icon with item count */}
          <Link to="/cart" className="relative text-gray-700 hover:text-primary-600" aria-label="Cart">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary-600 px-1 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            className="text-gray-700 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="space-y-4 border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          {searchForm}
          <nav className="flex flex-col gap-3">
            <Link to="/products" className={linkClass} onClick={closeMenu}>Products</Link>
            {user !== null && (
              <Link to="/orders" className={linkClass} onClick={closeMenu}>My Orders</Link>
            )}
            {isAdmin && (
              <Link to="/admin" className={linkClass} onClick={closeMenu}>Admin Panel</Link>
            )}
            {user === null ? (
              <>
                <Link to="/login" className={linkClass} onClick={closeMenu}>Login</Link>
                <Link to="/signup" className={linkClass} onClick={closeMenu}>Sign up</Link>
              </>
            ) : (
              <button onClick={handleLogout} className={linkClass + " text-left"}>
                Logout ({user.name})
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
