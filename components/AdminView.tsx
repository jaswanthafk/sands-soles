
import React, { useEffect, useState } from 'react';
import { Order, Product } from '../types';
import { PRODUCTS } from '../constants';
import { getAllOrders } from '../services/authService';
import { Package, DollarSign, ShoppingBag, TrendingUp, Search, Loader2, AlertCircle, CheckCircle, XCircle, Save } from 'lucide-react';

interface AdminViewProps {
    inventory?: Record<string, number>;
    onUpdateStock?: (productId: string, stock: number) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ inventory = {}, onUpdateStock }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editStock, setEditStock] = useState<Record<string, string | number>>({});

  useEffect(() => {
    const fetchData = async () => {
        const data = await getAllOrders();
        setOrders(data);
        setLoading(false);
    };
    fetchData();
  }, []);

  // Sync editStock with props when inventory changes
  useEffect(() => {
      setEditStock(inventory);
  }, [inventory]);

  // Stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = PRODUCTS.length;

  // Filter Inventory
  const filteredProducts = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.includes(searchQuery)
  );

  const handleStockChange = (id: string, val: string) => {
      setEditStock(prev => ({ ...prev, [id]: val }));
  };

  const handleSaveStock = (id: string) => {
      const val = editStock[id];
      const num = val === '' ? 0 : typeof val === 'string' ? parseInt(val) : val;
      
      if (!isNaN(num) && num >= 0 && onUpdateStock) {
          onUpdateStock(id, num);
      }
  };

  const toggleAvailability = (id: string) => {
      const current = inventory[id] || 0;
      const newVal = current > 0 ? 0 : 10; // Toggle to 0 or restore a default/previous
      if (onUpdateStock) {
          onUpdateStock(id, newVal);
          setEditStock(prev => ({ ...prev, [id]: newVal }));
      }
  };

  if (loading) {
      return (
          <div className="h-screen flex items-center justify-center bg-[#EBEBE9]">
              <Loader2 size={32} className="animate-spin text-gray-400" />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-24 pb-12 font-sans">
      <div className="container mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="mb-12">
            <h1 className="text-3xl font-display font-bold uppercase text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Store overview and management.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-black text-accent rounded-full flex items-center justify-center">
                        <DollarSign size={20} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Revenue</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">KWD {totalRevenue.toFixed(3)}</p>
                <div className="mt-4 flex items-center gap-2 text-green-600 text-xs font-bold">
                    <TrendingUp size={14} /> +12% this week
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-gray-100 text-black rounded-full flex items-center justify-center">
                        <Package size={20} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Orders</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-gray-100 text-black rounded-full flex items-center justify-center">
                        <ShoppingBag size={20} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Products</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
            </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg">Recent Orders</h3>
                <button className="text-xs font-bold text-gray-500 hover:text-black">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-bold tracking-wider">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.length > 0 ? (
                            orders.slice(0, 5).map(order => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-mono font-bold">{order.id}</td>
                                    <td className="p-4 text-gray-500">{order.date}</td>
                                    <td className="p-4 font-bold">{order.shippingDetails?.fullName || 'Guest'}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold">KWD {order.total.toFixed(3)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-400">No orders yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Inventory Management */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="font-bold text-lg">Product Inventory</h3>
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search inventory..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-black"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-bold tracking-wider">
                        <tr>
                            <th className="p-4">Product</th>
                            <th className="p-4">Brand</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4 w-32">Stock</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map(product => {
                             const editVal = editStock[product.id];
                             const currentStock = editVal !== undefined ? editVal : (inventory[product.id] ?? 0);
                             const dbStock = inventory[product.id] ?? 0;
                             
                             // Determine if changed (handle string vs number comparison)
                             const isChanged = editVal != dbStock; // loose equality for string/number
                             
                             const numericStock = typeof currentStock === 'string' ? parseInt(currentStock) : currentStock;
                             const isLowStock = numericStock > 0 && numericStock < 5;
                             const isOut = numericStock === 0;

                             return (
                                 <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg p-1">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                                            </div>
                                            <span className="font-bold">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-500">{product.brand}</td>
                                    <td className="p-4">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold uppercase">{product.category}</span>
                                    </td>
                                    <td className="p-4 font-bold">KWD {product.price}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="number" 
                                                value={currentStock}
                                                onChange={(e) => handleStockChange(product.id, e.target.value)}
                                                className={`w-16 bg-white border rounded px-2 py-1 text-center font-bold focus:outline-none ${isChanged ? 'border-accent ring-1 ring-accent' : 'border-gray-200'}`}
                                            />
                                            {isChanged && (
                                                <button onClick={() => handleSaveStock(product.id)} className="text-green-600 hover:scale-110 transition-transform">
                                                    <Save size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => toggleAvailability(product.id)}
                                                className={`flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
                                                    isOut 
                                                        ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' 
                                                        : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'
                                                }`}
                                            >
                                                {isOut ? <XCircle size={14} /> : <CheckCircle size={14} />}
                                                <span className="text-[10px] font-bold uppercase">{isOut ? 'Out of Stock' : 'Available'}</span>
                                            </button>
                                            {isLowStock && (
                                                <div className="flex items-center gap-1 text-orange-500 text-[10px] font-bold uppercase" title="Low Stock">
                                                    <AlertCircle size={14} /> Low
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                 </tr>
                             );
                        })}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AdminView;
