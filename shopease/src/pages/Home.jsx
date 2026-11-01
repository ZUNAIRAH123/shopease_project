import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Laptop, Shirt, Watch, Home as HomeIcon, Tag } from "lucide-react";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useProducts } from "../context/ProductContext";
import { FREE_SHIPPING_MINIMUM, formatPrice } from "../utils/format";

// An icon for each category. New categories get the default "Tag" icon.
const categoryIcons = {
  Electronics: Laptop,
  Fashion: Shirt,
  Accessories: Watch,
  "Home & Living": HomeIcon,
};

function Home() {
  const { products, categories, loading } = useProducts();

  if (loading) {
    return <LoadingSpinner text="Loading store..." />;
  }

  // Featured = the first 4 products that are in stock
  const featuredProducts = [];
  for (const product of products) {
    if (product.stock > 0 && featuredProducts.length < 4) {
      featuredProducts.push(product);
    }
  }

  // New arrivals = the 4 newest products
  const newestFirst = [...products].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const newArrivals = newestFirst.slice(0, 4);

  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-500 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-100">
              New season, new arrivals
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
              Everything you need, delivered to your door
            </h1>
            <p className="mt-4 max-w-lg text-primary-100">
              Shop electronics, fashion, accessories and home essentials. Free shipping on orders
              over {formatPrice(FREE_SHIPPING_MINIMUM)}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="btn bg-white px-6 py-3 text-primary-700 hover:bg-primary-50">
                Shop now <ArrowRight size={18} />
              </Link>
              <Link
                to="/products?sort=newest"
                className="btn border border-white/60 px-6 py-3 text-white hover:bg-white/10"
              >
                See what's new
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-4">
              {newestFirst.slice(0, 4).map((product) => (
                <Link
                  key={product.id}
                  to={"/products/" + product.id}
                  className="overflow-hidden rounded-xl bg-white/10 p-2 transition hover:bg-white/20"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="aspect-square w-full rounded-lg object-cover"
                    onError={(event) => {
                      event.target.style.visibility = "hidden";
                    }}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Truck className="text-primary-600" />
            <p className="text-sm text-gray-600">Free shipping over {formatPrice(FREE_SHIPPING_MINIMUM)}</p>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-primary-600" />
            <p className="text-sm text-gray-600">Secure shopping experience</p>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw className="text-primary-600" />
            <p className="text-sm text-gray-600">Easy order tracking</p>
          </div>
        </div>
      </section>

      <div className="page-container space-y-14">
        {/* Categories */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900">Shop by category</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((category) => {
              const Icon = categoryIcons[category] || Tag;
              return (
                <Link
                  key={category}
                  to={"/products?category=" + encodeURIComponent(category)}
                  className="card flex flex-col items-center gap-3 p-6 text-center transition hover:border-primary-500 hover:shadow-md"
                >
                  <span className="rounded-full bg-primary-50 p-3 text-primary-600">
                    <Icon size={26} />
                  </span>
                  <span className="font-medium text-gray-900">{category}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured products */}
        <section>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Featured products</h2>
            <Link to="/products" className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* New arrivals */}
        <section>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-gray-900">New arrivals</h2>
            <Link to="/products?sort=newest" className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline">
              See more <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
