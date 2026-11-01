import { useSearchParams } from "react-router-dom";
import { SearchX } from "lucide-react";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { useProducts } from "../context/ProductContext";

// All the filters live in the URL (e.g. /products?search=watch&category=Fashion&min=10&sort=price-low)
// That way the navbar search, the home page category links and this page all work together.

function Products() {
  const { products, categories, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";
  const minPrice = searchParams.get("min") || "";
  const maxPrice = searchParams.get("max") || "";
  const sort = searchParams.get("sort") || "newest";

  // Change one filter and keep the others
  function updateFilter(key, value) {
    const newParams = new URLSearchParams(searchParams);
    if (value === "" || value === "All") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  }

  function clearFilters() {
    setSearchParams({});
  }

  // Apply search + category + price range, then sort
  function getVisibleProducts() {
    const searchLower = search.toLowerCase().trim();
    const result = [];

    for (const product of products) {
      if (searchLower !== "") {
        const productText = (product.name + " " + product.description + " " + product.category).toLowerCase();
        if (!productText.includes(searchLower)) {
          continue;
        }
      }
      if (category !== "All" && product.category !== category) {
        continue;
      }
      if (minPrice !== "" && product.price < Number(minPrice)) {
        continue;
      }
      if (maxPrice !== "" && product.price > Number(maxPrice)) {
        continue;
      }
      result.push(product);
    }

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else {
      // newest first
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }

  if (loading) {
    return <LoadingSpinner text="Loading products..." />;
  }

  const visibleProducts = getVisibleProducts();
  const hasFilters = search !== "" || category !== "All" || minPrice !== "" || maxPrice !== "" || sort !== "newest";

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-gray-900">All products</h1>
      <p className="mt-1 text-sm text-gray-500">
        {visibleProducts.length} {visibleProducts.length === 1 ? "product" : "products"} found
        {search !== "" && <span> for "{search}"</span>}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-4">
        {/* Filters */}
        <aside className="card h-fit space-y-5 p-5 lg:col-span-1">
          <div>
            <label className="label" htmlFor="search">Search</label>
            <input
              id="search"
              type="text"
              value={search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Search products..."
              className="input"
            />
          </div>

          <div>
            <label className="label" htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(event) => updateFilter("category", event.target.value)}
              className="input"
            >
              <option value="All">All categories</option>
              {categories.map((categoryName) => (
                <option key={categoryName} value={categoryName}>{categoryName}</option>
              ))}
            </select>
          </div>

          <div>
            <p className="label">Price range ($)</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(event) => updateFilter("min", event.target.value)}
                placeholder="Min"
                className="input"
                aria-label="Minimum price"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(event) => updateFilter("max", event.target.value)}
                placeholder="Max"
                className="input"
                aria-label="Maximum price"
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="sort">Sort by</label>
            <select
              id="sort"
              value={sort}
              onChange={(event) => updateFilter("sort", event.target.value)}
              className="input"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </div>

          <button onClick={clearFilters} disabled={!hasFilters} className="btn-secondary w-full">
            Clear filters
          </button>
        </aside>

        {/* Product grid */}
        <section className="lg:col-span-3">
          {visibleProducts.length === 0 ? (
            <div className="card flex flex-col items-center px-4 py-16 text-center">
              <SearchX size={40} className="text-gray-400" />
              <h2 className="mt-4 text-lg font-semibold text-gray-900">No products found</h2>
              <p className="mt-1 text-sm text-gray-500">Try a different search or change your filters.</p>
              <button onClick={clearFilters} className="btn-primary mt-5">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 lg:gap-6">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Products;
