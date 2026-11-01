import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart, Minus, Plus, ArrowLeft } from "lucide-react";
import ProductImage from "../components/ProductImage";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../utils/format";

function ProductDetails() {
  const { id } = useParams();
  const { products, getProductById } = useProducts();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);

  // Reset the quantity when the customer opens a different product
  useEffect(() => {
    setQuantity(1);
  }, [id]);

  const product = getProductById(id);

  if (product === null) {
    return (
      <div className="page-container text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-2 text-gray-500">This product does not exist or was removed.</p>
        <Link to="/products" className="btn-primary mt-6">Back to products</Link>
      </div>
    );
  }

  const outOfStock = product.stock === 0;

  // Related products = same category, but not this product
  const relatedProducts = [];
  for (const item of products) {
    if (item.category === product.category && item.id !== product.id && relatedProducts.length < 4) {
      relatedProducts.push(item);
    }
  }

  function decreaseQuantity() {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  function increaseQuantity() {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      showToast("Only " + product.stock + " in stock", "error");
    }
  }

  function handleAddToCart() {
    const result = addToCart(product.id, quantity);
    if (result.success) {
      showToast(result.message, "success");
      setQuantity(1);
    } else {
      showToast(result.message, "error");
    }
  }

  return (
    <div className="page-container">
      <Link to="/products" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600">
        <ArrowLeft size={16} /> Back to products
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="card overflow-hidden">
          <ProductImage src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
        </div>

        {/* Details */}
        <div>
          <Link
            to={"/products?category=" + encodeURIComponent(product.category)}
            className="text-xs font-semibold uppercase tracking-wide text-primary-600 hover:underline"
          >
            {product.category}
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-4 text-3xl font-bold text-gray-900">{formatPrice(product.price)}</p>

          <p className="mt-4 leading-relaxed text-gray-600">{product.description}</p>

          <div className="mt-5">
            {outOfStock ? (
              <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">Out of stock</span>
            ) : product.stock <= 5 ? (
              <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                Only {product.stock} left in stock
              </span>
            ) : (
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                In stock ({product.stock} available)
              </span>
            )}
          </div>

          {!outOfStock && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {/* Quantity selector */}
              <div className="flex items-center rounded-lg border border-gray-300 bg-white">
                <button onClick={decreaseQuantity} className="p-3 text-gray-600 hover:text-primary-600" aria-label="Decrease quantity">
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button onClick={increaseQuantity} className="p-3 text-gray-600 hover:text-primary-600" aria-label="Increase quantity">
                  <Plus size={16} />
                </button>
              </div>

              <button onClick={handleAddToCart} className="btn-primary px-6 py-3">
                <ShoppingCart size={18} /> Add to cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">Related products</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetails;
