import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Edit2, Trash2, X, Upload, Check, AlertCircle, Sparkles } from 'lucide-react';
import api, { getErrorMessage } from '../services/api';
import Spinner from '../components/Spinner';
import { useToast } from '../context/ToastContext';

const AdminProducts = () => {
  const { addToast } = useToast();

  // API states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form Editor modes
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null means "Add Mode"

  // Form Fields State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [featured, setFeatured] = useState(false);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Query filter
  const [query, setQuery] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/products?pageSize=100'); // Load large set for lists
      setProducts(data.products || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setEditingProduct(null);
    setTitle('');
    setPrice('');
    setCategory('');
    setStock('');
    setDescription('');
    setImage('');
    setFeatured(false);
    setUploadError(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setTitle(prod.title);
    setPrice(prod.price);
    setCategory(prod.category);
    setStock(prod.stock);
    setDescription(prod.description);
    setImage(prod.image);
    setFeatured(prod.featured || false);
    setUploadError(null);
    setShowModal(true);
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    setUploadError(null);

    try {
      const { data } = await api.post('/api/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImage(data);
      addToast('Image uploaded successfully!');
    } catch (err) {
      setUploadError(getErrorMessage(err));
      addToast('Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      price: Number(price),
      category,
      stock: Number(stock),
      description,
      image,
      featured,
    };

    try {
      if (editingProduct) {
        // Edit Mode
        await api.put(`/api/products/${editingProduct._id}`, payload);
        addToast(`${title} updated successfully`);
      } else {
        // Create Mode
        await api.post('/api/products', payload);
        addToast(`${title} created successfully`);
      }
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    }
  };

  const handleDelete = async (prodId, prodTitle) => {
    if (window.confirm(`Are you sure you want to delete ${prodTitle}?`)) {
      try {
        await api.delete(`/api/products/${prodId}`);
        addToast('Product deleted successfully');
        fetchProducts();
      } catch (err) {
        addToast(getErrorMessage(err), 'error');
      }
    }
  };

  // Filter products by search query
  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen space-y-6">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase flex items-center gap-3">
            <ShoppingBag size={28} className="text-indigo-650" />
            Manage Products
          </h1>
          <p className="text-xs text-gray-505 font-bold">Admin Inventory Catalog Controller</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow hover:scale-[1.01] flex items-center gap-2"
        >
          <Plus size={16} />
          Add New Product
        </button>
      </div>

      {/* Search filters */}
      <div className="bg-white dark:bg-darkCard p-4 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm">
        <input
          type="text"
          placeholder="Search products by title or category..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-4 pr-4 py-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-100"
        />
      </div>

      {/* Grid listing products */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-500 rounded-xl text-xs">{error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-darkCard border border-gray-100 dark:border-zinc-800 rounded-3xl text-gray-400">
          No products matched the filter query.
        </div>
      ) : (
        <div className="bg-white dark:bg-darkCard border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-55 dark:bg-zinc-900/60 text-gray-400 uppercase font-extrabold border-b border-gray-100 dark:border-zinc-800 tracking-wider">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Product ID</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-850 font-medium">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/20 dark:hover:bg-zinc-900/10">
                    <td className="px-6 py-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 dark:border-zinc-800">
                        <img src={p.image} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-3 font-bold text-gray-500 truncate max-w-[100px]">{p._id}</td>
                    <td className="px-6 py-3 font-bold text-gray-800 dark:text-gray-250 truncate max-w-[180px]">{p.title}</td>
                    <td className="px-6 py-3 text-indigo-650 dark:text-indigo-400">{p.category}</td>
                    <td className="px-6 py-3 font-extrabold text-gray-900 dark:text-white">${p.price.toFixed(2)}</td>
                    <td className="px-6 py-3 font-semibold">
                      <span className={p.stock === 0 ? 'text-red-500 font-bold' : 'text-gray-600 dark:text-gray-400'}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 border border-gray-150 hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-900 text-gray-650 rounded-lg hover:text-indigo-650 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id, p.title)}
                          className="p-1.5 border border-red-100 hover:bg-red-50 dark:border-red-950/20 dark:hover:bg-red-950/40 text-red-500 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Editor Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-xl bg-white dark:bg-darkCard rounded-3xl border border-gray-100 dark:border-zinc-850 p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-zinc-800">
              <h2 className="text-base font-extrabold uppercase tracking-wide flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-600 animate-pulse" />
                {editingProduct ? 'Update Product Details' : 'Create New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500">
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="iPhone 15, Sony Headphones..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="99.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="Electronics, Apparel..."
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Stock Count</label>
                  <input
                    type="number"
                    placeholder="15"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900"
                    required
                  />
                </div>
                
                {/* Featured checkbox */}
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 text-indigo-650 bg-gray-50 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="featured" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Mark as Featured Product
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Detail specification info..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-gray-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900"
                  required
                ></textarea>
              </div>

              {/* Image Input & File Upload */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-505 mb-1">Product Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Image URL or upload a file below"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 dark:border-zinc-850 dark:bg-zinc-900"
                    required
                  />
                </div>
                
                {/* File Upload zone */}
                <div className="relative border border-dashed border-gray-200 dark:border-zinc-800 p-4 rounded-xl flex items-center justify-center gap-2 bg-gray-50/50 dark:bg-zinc-900/40">
                  {uploading ? (
                    <div className="flex items-center gap-2 text-xs text-indigo-650 font-bold"><Loader2 size={16} className="animate-spin" /> Uploading image...</div>
                  ) : (
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 cursor-pointer hover:text-indigo-600 transition-colors">
                      <Upload size={15} />
                      Choose Local Image File
                      <input type="file" onChange={handleUploadFile} className="hidden" accept="image/*" />
                    </label>
                  )}
                </div>
                {uploadError && (
                  <p className="text-[10px] text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {uploadError}</p>
                )}
                {image && (
                  <p className="text-[10px] text-green-600 flex items-center gap-1 font-bold"><Check size={12} /> Ready: {image.substring(0, 45)}...</p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-[2] py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center shadow"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
