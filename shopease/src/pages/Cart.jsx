import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import ProductImage from "../components/ProductImage";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { FREE_SHIPPING_MINIMUM, formatPrice } from "../utils/format";

function Cart() {
  const { cartItems, subtotal, shipping, total, updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function handleQuantityChange(productId, newQuantity) {
    const result = updateQuantity(productId, newQuantity);
    if (!result.success) {
      showToast(result.message, "error");
    }
  }

  function handleRemove(item) {
    removeFromCart(item.product.id);
    showToast(item.product.name + " removed from cart");
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="page-container">
        <div className="card flex flex-col items-center px-4 py-20 text-center">
          <ShoppingCart size={48} className="text-gray-300" />
          <h1 className="mt-4 text-xl font-semibold text-gray-900">Your cart is empty</h1>
          <p className="mt-1 text-sm text-gray-500">Looks like you have not added anything yet.</p>
          <Link to="/products" className="btn-primary mt-6">Start shopping</Link>
        </div>
      </div>
    );
  }

  const amountToFreeShipping = FREE_SHIPPING_MINIMUM - subtotal;

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-gray-900">Shopping cart</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          {cartItems.map((item) => (
            <div key={item.product.id} className="card flex gap-4 p-4">
              <Link to={"/products/" + item.product.id} className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <ProductImage src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-2">
                  <div>
                    <Link to={"/products/" + item.product.id} className="font-medium text-gray-900 hover:text-primary-600">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-gray-400">{item.product.category}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(item)}
                    className="h-fit text-gray-400 hover:text-red-600"
                    aria-label={"Remove " + item.product.name}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
                  <div className="flex items-center rounded-lg border border-gray-300">
                    <button
                      onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-2 text-gray-600 hover:text-primary-600 disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="p-2 text-gray-600 hover:text-primary-600 disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="font-semibold text-gray-900">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))}

          <Link to="/products" className="inline-block text-sm font-medium text-primary-600 hover:underline">
            &larr; Continue shopping
          </Link>
        </div>

        {/* Summary */}
        <aside className="card h-fit space-y-3 p-5">
          <h2 className="text-lg font-semibold">Order summary</h2>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          {amountToFreeShipping > 0 && (
            <p className="rounded-lg bg-primary-50 p-2 text-xs text-primary-700">
              Add {formatPrice(amountToFreeShipping)} more to get free shipping!
            </p>
          )}

          <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button onClick={() => navigate("/checkout")} className="btn-primary w-full py-3">
            Proceed to checkout
          </button>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
