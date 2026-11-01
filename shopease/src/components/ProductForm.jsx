import { useState } from "react";
import ProductImage from "./ProductImage";
import { validateProduct } from "../utils/validation";

// Form used by the admin to add or edit a product.
// - product: the product being edited (or null when adding a new one)
// - categories: existing category names (shown as suggestions)
// - onSave(formData): called when the form is valid
// - onCancel(): called when the admin closes the form
function ProductForm({ product, categories, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: product ? product.name : "",
    price: product ? String(product.price) : "",
    category: product ? product.category : "",
    stock: product ? String(product.stock) : "",
    image: product ? product.image : "",
    description: product ? product.description : "",
  });
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    // Clear the error for the field being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const newErrors = validateProduct(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return; // stop, there are errors
    }
    onSave(form);
  }

  function inputClass(fieldName) {
    return errors[fieldName] ? "input input-error" : "input";
  }

  return (
    <form onSubmit={handleSubmit} className="card mb-6 space-y-4 p-5" noValidate>
      <h2 className="text-lg font-semibold">{product ? "Edit product" : "Add new product"}</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="name">Product name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} className={inputClass("name")} />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        <div>
          <label className="label" htmlFor="price">Price ($)</label>
          <input id="price" name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} className={inputClass("price")} />
          {errors.price && <p className="error-text">{errors.price}</p>}
        </div>

        <div>
          <label className="label" htmlFor="stock">Stock</label>
          <input id="stock" name="stock" type="number" min="0" step="1" value={form.stock} onChange={handleChange} className={inputClass("stock")} />
          {errors.stock && <p className="error-text">{errors.stock}</p>}
        </div>

        <div>
          <label className="label" htmlFor="category">Category</label>
          <input id="category" name="category" list="category-options" value={form.category} onChange={handleChange} className={inputClass("category")} placeholder="Pick one or type a new one" />
          <datalist id="category-options">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
          {errors.category && <p className="error-text">{errors.category}</p>}
        </div>

        <div>
          <label className="label" htmlFor="image">Image URL</label>
          <input id="image" name="image" value={form.image} onChange={handleChange} className={inputClass("image")} placeholder="https://..." />
          {errors.image && <p className="error-text">{errors.image}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" name="description" rows="3" value={form.description} onChange={handleChange} className={inputClass("description")} />
          {errors.description && <p className="error-text">{errors.description}</p>}
        </div>
      </div>

      {form.image.trim() !== "" && (
        <div>
          <p className="label">Image preview</p>
          <ProductImage src={form.image.trim()} alt="Preview" className="h-24 w-24 rounded-lg border border-gray-200 object-cover" />
        </div>
      )}

      <div className="flex gap-3">
        <button type="submit" className="btn-primary">
          {product ? "Save changes" : "Add product"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
}

export default ProductForm;
