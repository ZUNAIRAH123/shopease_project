import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import ProductImage from "./ProductImage";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../utils/format";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  function handleAddToCart() {
    const result = addToCart(product.id, 1);
    if (result.success) {
      showToast(result.message, "success");
    } else {
      showToast(result.message, "error");
    }
  }

  const outOfStock = product.stock === 0;

  return (
    <div className="card flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Link to={"/products/" + product.id} className="relative block aspect-square overflow-hidden bg-gray-100">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {outOfStock && (
          <span className="absolute left-2 top-2 rounded bg-gray-900 px-2 py-1 text-xs font-medium text-white">
            Out of stock
          </span>
        )}
        {!outOfStock && product.stock <= 5 && (
          <span className="absolute left-2 top-2 rounded bg-orange-500 px-2 py-1 text-xs font-medium text-white">
            Only {product.stock} left
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs uppercase tracking-wide text-gray-400">{product.category}</p>
        <Link
          to={"/products/" + product.id}
          className="mt-1 line-clamp-2 font-medium text-gray-900 hover:text-primary-600"
        >
          {product.name}
        </Link>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="btn-primary px-3"
            aria-label={"Add " + product.name + " to cart"}
          >
            <ShoppingCart size={16} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
