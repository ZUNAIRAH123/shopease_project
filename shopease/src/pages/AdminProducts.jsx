import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import AdminNav from "../components/AdminNav";
import ProductForm from "../components/ProductForm";
import ProductImage from "../components/ProductImage";
import { useProducts } from "../context/ProductContext";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../utils/format";

function AdminProducts() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useProducts();
  const { showToast } = useToast();

  // showForm: is the add/edit form visible?  editingProduct: null = adding a new product
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  function openAddForm() {
    setEditingProduct(null);
    setShowForm(true);
    window.scrollTo(0, 0);
  }

  function openEditForm(product) {
    setEditingProduct(product);
    setShowForm(true);
    window.scrollTo(0, 0);
  }

  function closeForm() {
    setShowForm(false);
    setEditingProduct(null);
  }

  function handleSave(formData) {
    if (editingProduct === null) {
      addProduct(formData);
      showToast("Product added");
    } else {
      updateProduct(editingProduct.id, formData);
      showToast("Product updated");
    }
    closeForm();
  }

  function handleDelete(product) {
    const confirmed = window.confirm('Delete "' + product.name + '"? This cannot be undone.');
    if (confirmed) {
      deleteProduct(product.id);
      showToast("Product deleted");
    }
  }

  return (
    <div className="page-container">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-gray-900">Manage products</h1>
        <button onClick={openAddForm} className="btn-primary">
          <Plus size={16} /> Add product
        </button>
      </div>
      <div className="mt-6">
        <AdminNav />
      </div>

      {/* key makes the form reset when switching between products */}
      {showForm && (
        <ProductForm
          key={editingProduct ? editingProduct.id : "new"}
          product={editingProduct}
          categories={categories}
          onSave={handleSave}
          onCancel={closeForm}
        />
      )}

      {products.length === 0 ? (
        <div className="card py-16 text-center text-sm text-gray-500">
          There are no products yet. Click "Add product" to create one.
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ProductImage src={product.image} alt={product.name} className="h-10 w-10 rounded-md object-cover" />
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.category}</td>
                  <td className="px-4 py-3">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">
                    <span className={product.stock === 0 ? "font-medium text-red-600" : product.stock <= 5 ? "font-medium text-orange-600" : ""}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditForm(product)} className="btn-secondary px-3 py-1.5" aria-label={"Edit " + product.name}>
                        <Pencil size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(product)} className="btn-danger px-3 py-1.5" aria-label={"Delete " + product.name}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
