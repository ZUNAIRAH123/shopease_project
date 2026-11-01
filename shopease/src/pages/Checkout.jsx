import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Banknote, CreditCard, Loader2, ShoppingCart } from "lucide-react";
import ProductImage from "../components/ProductImage";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../utils/format";
import { validateCheckout } from "../utils/validation";

function Checkout() {
  const { user } = useAuth();
  const { cartItems, subtotal, shipping, total, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user ? user.name : "",
    email: user ? user.email : "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "Cash on Delivery",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });
  const [errors, setErrors] = useState({});
  const [placingOrder, setPlacingOrder] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: undefined });
  }

  function handlePlaceOrder(event) {
    event.preventDefault();

    const newErrors = validateCheckout(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Please fix the errors in the form", "error");
      return;
    }

    // Save only what the order needs from each cart item
    const orderItems = [];
    for (const item of cartItems) {
      orderItems.push({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        quantity: item.quantity,
      });
    }

    // For the simulated card payment we keep ONLY the last 4 digits
    let cardLast4 = "";
    if (form.paymentMethod === "Card") {
      cardLast4 = form.cardNumber.replace(/\s/g, "").slice(-4);
    }

    setPlacingOrder(true);
    // Short delay to simulate processing
    setTimeout(() => {
      const newOrder = createOrder({
        userEmail: user.email,
        customer: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
        },
        paymentMethod: form.paymentMethod,
        cardLast4: cardLast4,
        items: orderItems,
        subtotal: subtotal,
        shipping: shipping,
        total: total,
      });

      clearCart();
      showToast("Order placed successfully!");
      navigate("/order-confirmation/" + newOrder.id, { replace: true });
    }, 800);
  }

  // Empty cart (and not in the middle of placing an order)
  if (cartItems.length === 0 && !placingOrder) {
    return (
      <div className="page-container">
        <div className="card flex flex-col items-center px-4 py-20 text-center">
          <ShoppingCart size={48} className="text-gray-300" />
          <h1 className="mt-4 text-xl font-semibold text-gray-900">Your cart is empty</h1>
          <p className="mt-1 text-sm text-gray-500">Add some products before checking out.</p>
          <Link to="/products" className="btn-primary mt-6">Browse products</Link>
        </div>
      </div>
    );
  }

  function inputClass(fieldName) {
    return errors[fieldName] ? "input input-error" : "input";
  }

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>

      <form onSubmit={handlePlaceOrder} noValidate className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Customer details */}
          <section className="card p-5">
            <h2 className="text-lg font-semibold">Customer details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="name">Full name</label>
                <input id="name" name="name" value={form.name} onChange={handleChange} className={inputClass("name")} />
                {errors.name && <p className="error-text">{errors.name}</p>}
              </div>
              <div>
                <label className="label" htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className={inputClass("email")} />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="phone">Phone number</label>
                <input id="phone" name="phone" value={form.phone} onChange={handleChange} className={inputClass("phone")} placeholder="+1 555 123 4567" />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>
            </div>
          </section>

          {/* Shipping */}
          <section className="card p-5">
            <h2 className="text-lg font-semibold">Shipping address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="address">Address</label>
                <input id="address" name="address" value={form.address} onChange={handleChange} className={inputClass("address")} placeholder="Street, house number" />
                {errors.address && <p className="error-text">{errors.address}</p>}
              </div>
              <div>
                <label className="label" htmlFor="city">City</label>
                <input id="city" name="city" value={form.city} onChange={handleChange} className={inputClass("city")} />
                {errors.city && <p className="error-text">{errors.city}</p>}
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="card p-5">
            <h2 className="text-lg font-semibold">Payment method</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label
                className={
                  "flex cursor-pointer items-center gap-3 rounded-lg border p-4 " +
                  (form.paymentMethod === "Cash on Delivery" ? "border-primary-500 bg-primary-50" : "border-gray-300")
                }
              >
                <input type="radio" name="paymentMethod" value="Cash on Delivery" checked={form.paymentMethod === "Cash on Delivery"} onChange={handleChange} />
                <Banknote size={20} className="text-gray-600" />
                <span className="text-sm font-medium">Cash on Delivery</span>
              </label>

              <label
                className={
                  "flex cursor-pointer items-center gap-3 rounded-lg border p-4 " +
                  (form.paymentMethod === "Card" ? "border-primary-500 bg-primary-50" : "border-gray-300")
                }
              >
                <input type="radio" name="paymentMethod" value="Card" checked={form.paymentMethod === "Card"} onChange={handleChange} />
                <CreditCard size={20} className="text-gray-600" />
                <span className="text-sm font-medium">Card (simulated)</span>
              </label>
            </div>

            {form.paymentMethod === "Card" && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <p className="rounded-lg bg-yellow-50 p-3 text-xs text-yellow-800 sm:col-span-2">
                  This is a simulation. No real payment is processed. Enter any 16 digits, e.g. 4242 4242 4242 4242.
                </p>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="cardNumber">Card number</label>
                  <input id="cardNumber" name="cardNumber" value={form.cardNumber} onChange={handleChange} className={inputClass("cardNumber")} placeholder="4242 4242 4242 4242" inputMode="numeric" />
                  {errors.cardNumber && <p className="error-text">{errors.cardNumber}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="cardExpiry">Expiry (MM/YY)</label>
                  <input id="cardExpiry" name="cardExpiry" value={form.cardExpiry} onChange={handleChange} className={inputClass("cardExpiry")} placeholder="12/29" />
                  {errors.cardExpiry && <p className="error-text">{errors.cardExpiry}</p>}
                </div>
                <div>
                  <label className="label" htmlFor="cardCvc">CVC</label>
                  <input id="cardCvc" name="cardCvc" value={form.cardCvc} onChange={handleChange} className={inputClass("cardCvc")} placeholder="123" inputMode="numeric" />
                  {errors.cardCvc && <p className="error-text">{errors.cardCvc}</p>}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Order summary */}
        <aside className="card h-fit space-y-3 p-5">
          <h2 className="text-lg font-semibold">Order summary</h2>

          <ul className="divide-y divide-gray-100">
            {cartItems.map((item) => (
              <li key={item.product.id} className="flex items-center gap-3 py-3">
                <ProductImage src={item.product.image} alt={item.product.name} className="h-12 w-12 rounded-md object-cover" />
                <div className="flex-1 text-sm">
                  <p className="line-clamp-1 font-medium text-gray-900">{item.product.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button type="submit" disabled={placingOrder} className="btn-primary w-full py-3">
            {placingOrder ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Placing order...
              </>
            ) : (
              "Place order"
            )}
          </button>
          <Link to="/cart" className="block text-center text-sm text-gray-500 hover:text-primary-600">
            Back to cart
          </Link>
        </aside>
      </form>
    </div>
  );
}

export default Checkout;
