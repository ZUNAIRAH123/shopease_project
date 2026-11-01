import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <ShoppingBag className="text-primary-600" size={22} />
            ShopEase
          </Link>
          <p className="mt-3 text-sm text-gray-500">
            A demo online store built with React. Quality products, simple shopping.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900">Shop</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-500">
            <li>
              <Link to="/products" className="hover:text-primary-600">All products</Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-primary-600">Your cart</Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-primary-600">Your orders</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900">Account</h3>
          <ul className="mt-3 space-y-2 text-sm text-gray-500">
            <li>
              <Link to="/login" className="hover:text-primary-600">Log in</Link>
            </li>
            <li>
              <Link to="/signup" className="hover:text-primary-600">Create account</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        &copy; {year} ShopEase. Demo project - no real payments are processed.
      </div>
    </footer>
  );
}

export default Footer;
