'use client';
import { useEffect, useState } from 'react';
import { getProducts, getStats, createProduct, Product, CategoryStat } from './lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle, Package, Plus, X } from 'lucide-react';

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Electronics',
    price: 0,
    quantity: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, statsData] = await Promise.all([getProducts(), getStats()]);
      setProducts(productsData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct(newProduct);
      setIsModalOpen(false);
      setNewProduct({ name: '', category: 'Electronics', price: 0, quantity: 0 });
      fetchData(); // Refresh data to show new product & updated stats
      alert("Product added successfully!");
    } catch (error) {
      console.error("Failed to create product", error);
      alert("Error creating product");
    }
  };

  // Helper for "Enterprise" Status Colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_STOCK': return 'bg-green-100 text-green-800 border-green-200';
      case 'LOW_STOCK': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'OUT_OF_STOCK': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'CRITICAL') return <AlertCircle className="w-5 h-5 text-red-600" />;
    if (priority === 'HIGH') return <AlertCircle className="w-5 h-5 text-orange-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  if (loading) return <div className="p-10 text-center">Loading Nexus Suite...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans relative">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-8 h-8 text-blue-600" /> Nexus Inventory Suite
          </h1>
          <p className="text-slate-500 mt-1">Warehouse Overview & Health</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </header>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Inventory Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center items-center">
            <div className="text-center">
                <span className="text-5xl font-bold text-slate-800">{products.length}</span>
                <p className="text-slate-500 mt-2">Total SKUs Managed</p>
            </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Product List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Qty</th>
                <th className="px-6 py-4">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                      {product.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">{product.quantity}</td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    {getPriorityIcon(product.priority)}
                    <span className="text-xs font-semibold">{product.priority}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-semibold text-slate-800">Add New Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateProduct} className="p-6 space-y-4 text-slate-600">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. Wireless Mouse"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newProduct.category}
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Appliances">Appliances</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newProduct.quantity}
                    onChange={e => setNewProduct({...newProduct, quantity: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                  Confirm Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}