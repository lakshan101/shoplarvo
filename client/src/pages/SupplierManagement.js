import React, { useState, useEffect } from 'react';
import { Truck, Plus, Search, Star, Package, Check, RefreshCw, FileText, AlertCircle } from 'lucide-react';

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('suppliers'); // 'suppliers' or 'purchaseOrders'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showPOModal, setShowPOModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);

  // New Supplier Form State
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    categoriesSupplied: 'Shirts, Hoodies, Pants',
    rating: 5
  });

  // Purchase Order Form State
  const [poForm, setPoForm] = useState({
    supplierId: '',
    productTitle: 'Urban Oversized Hoodie',
    quantityOrdered: 20,
    unitCost: 35.00,
    expectedDeliveryDate: ''
  });

  useEffect(() => {
    fetchSupplierData();
  }, []);

  const fetchSupplierData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch suppliers
      const supRes = await fetch('/api/suppliers', { headers });
      if (supRes.ok) {
        const supData = await supRes.json();
        setSuppliers(supData.data || []);
      } else {
        // Fallback demo data if offline/mock
        setSuppliers([
          {
            _id: 'sup_101',
            name: 'TexStyle Apparel Manufacturers',
            contactPerson: 'Kavinda Perera',
            email: 'sales@texstyle.lk',
            phone: '+94 77 123 4567',
            categoriesSupplied: ['Hoodies', 'Jackets'],
            rating: 5,
            status: 'Active'
          },
          {
            _id: 'sup_102',
            name: 'Lanka Garments & Fabrics',
            contactPerson: 'Nimali Silva',
            email: 'info@lankagarments.com',
            phone: '+94 11 987 6543',
            categoriesSupplied: ['Shirts', 'Pants'],
            rating: 4,
            status: 'Active'
          }
        ]);
      }

      // Fetch Purchase Orders
      const poRes = await fetch('/api/suppliers/purchase-orders', { headers });
      if (poRes.ok) {
        const poData = await poRes.json();
        setPurchaseOrders(poData.data || []);
      } else {
        setPurchaseOrders([
          {
            _id: 'po_5001',
            poNumber: 'PO-984712',
            supplier: { name: 'TexStyle Apparel Manufacturers' },
            totalCost: 700.00,
            status: 'Ordered',
            createdAt: new Date(),
            items: [{ productTitle: 'Urban Oversized Hoodie', quantityOrdered: 20, quantityReceived: 0, unitCost: 35.00 }]
          }
        ]);
      }
    } catch (err) {
      console.error('Error loading supplier data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newSupplier,
          categoriesSupplied: newSupplier.categoriesSupplied.split(',').map(c => c.trim())
        })
      });

      if (res.ok) {
        alert('Supplier added successfully!');
        setShowAddSupplierModal(false);
        fetchSupplierData();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to add supplier');
      }
    } catch (err) {
      alert('Error creating supplier');
    }
  };

  const handleCreatePO = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/suppliers/purchase-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          supplierId: poForm.supplierId || suppliers[0]?._id,
          items: [
            {
              productId: '660000000000000000000001', // demo item id
              quantityOrdered: Number(poForm.quantityOrdered),
              unitCost: Number(poForm.unitCost)
            }
          ],
          expectedDeliveryDate: poForm.expectedDeliveryDate || new Date(Date.now() + 7 * 86400000)
        })
      });

      if (res.ok) {
        alert('Purchase Order created successfully!');
        setShowPOModal(false);
        fetchSupplierData();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to create Purchase Order');
      }
    } catch (err) {
      alert('Error creating PO');
    }
  };

  const handleReceiveStock = async (poId) => {
    try {
      const token = localStorage.getItem('token');
      const po = purchaseOrders.find(p => p._id === poId);
      if (!po || !po.items) return;

      const itemsReceived = po.items.map(item => ({
        itemId: item._id,
        quantityReceived: item.quantityOrdered - item.quantityReceived
      }));

      const res = await fetch(`/api/suppliers/purchase-orders/${poId}/receive`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemsReceived })
      });

      if (res.ok) {
        alert('Delivery received! Inventory stock has been automatically updated.');
        setShowReceiveModal(false);
        fetchSupplierData();
      } else {
        alert('Failed to update stock delivery');
      }
    } catch (err) {
      alert('Error receiving delivery');
    }
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Truck className="w-8 h-8 text-indigo-400" />
            <span>Supplier Management (E04)</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Maintain supplier relationships, generate formal Purchase Orders (PO), and receive incoming stock deliveries.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowAddSupplierModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Supplier</span>
          </button>
          <button
            onClick={() => setShowPOModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg shadow-emerald-600/30"
          >
            <FileText className="w-4 h-4" />
            <span>Create Purchase Order</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 mb-6">
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`pb-3 px-6 font-semibold text-sm border-b-2 transition ${
            activeTab === 'suppliers'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Suppliers Directory ({suppliers.length})
        </button>
        <button
          onClick={() => setActiveTab('purchaseOrders')}
          className={`pb-3 px-6 font-semibold text-sm border-b-2 transition ${
            activeTab === 'purchaseOrders'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Purchase Orders & Deliveries ({purchaseOrders.length})
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'suppliers' ? (
        <div>
          {/* Search bar */}
          <div className="relative max-w-md mb-6">
            <Search className="w-5 h-5 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search suppliers by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-white"
            />
          </div>

          {/* Supplier Table */}
          <div className="bg-slate-800/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-800 text-slate-400 font-semibold text-xs uppercase border-b border-slate-700">
                  <th className="p-4">Supplier Name</th>
                  <th className="p-4">Contact Person</th>
                  <th className="p-4">Email & Phone</th>
                  <th className="p-4">Categories</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredSuppliers.map((sup) => (
                  <tr key={sup._id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-bold text-white">{sup.name}</td>
                    <td className="p-4 text-slate-300">{sup.contactPerson || 'N/A'}</td>
                    <td className="p-4">
                      <div className="font-medium text-indigo-300">{sup.email}</div>
                      <div className="text-xs text-slate-400">{sup.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(sup.categoriesSupplied)
                          ? sup.categoriesSupplied.map((c, i) => (
                              <span key={i} className="bg-slate-700 text-slate-200 text-xs px-2 py-0.5 rounded-md">
                                {c}
                              </span>
                            ))
                          : 'General'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span className="font-bold">{sup.rating || 5}.0</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-500/20">
                        {sup.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Purchase Orders View */
        <div className="space-y-4">
          <div className="bg-slate-800/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-800 text-slate-400 font-semibold text-xs uppercase border-b border-slate-700">
                  <th className="p-4">PO Number</th>
                  <th className="p-4">Supplier</th>
                  <th className="p-4">Total Cost</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {purchaseOrders.map((po) => (
                  <tr key={po._id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-bold text-indigo-400">{po.poNumber}</td>
                    <td className="p-4 font-medium text-white">{po.supplier?.name || 'Main Supplier'}</td>
                    <td className="p-4 font-bold text-emerald-400">${po.totalCost?.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                        po.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {po.status !== 'Completed' && (
                        <button
                          onClick={() => handleReceiveStock(po._id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ml-auto transition"
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>Receive Stock Delivery (US42)</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-lg w-full text-slate-100 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Truck className="w-6 h-6 text-indigo-400" />
              <span>Add New Apparel Supplier (US34)</span>
            </h2>
            <form onSubmit={handleAddSupplier} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Company / Supplier Name</label>
                <input
                  type="text"
                  required
                  value={newSupplier.name}
                  onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={newSupplier.contactPerson}
                    onChange={e => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newSupplier.phone}
                    onChange={e => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newSupplier.email}
                  onChange={e => setNewSupplier({ ...newSupplier, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Categories Supplied (Comma separated)</label>
                <input
                  type="text"
                  value={newSupplier.categoriesSupplied}
                  onChange={e => setNewSupplier({ ...newSupplier, categoriesSupplied: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowAddSupplierModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PO Modal */}
      {showPOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-lg w-full text-slate-100 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-emerald-400" />
              <span>Generate Purchase Order PO (US41)</span>
            </h2>
            <form onSubmit={handleCreatePO} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Select Supplier</label>
                <select
                  value={poForm.supplierId}
                  onChange={e => setPoForm({ ...poForm, supplierId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {suppliers.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Item Title</label>
                <input
                  type="text"
                  value={poForm.productTitle}
                  onChange={e => setPoForm({ ...poForm, productTitle: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Quantity</label>
                  <input
                    type="number"
                    value={poForm.quantityOrdered}
                    onChange={e => setPoForm({ ...poForm, quantityOrdered: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Unit Cost ($)</label>
                  <input
                    type="number"
                    value={poForm.unitCost}
                    onChange={e => setPoForm({ ...poForm, unitCost: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowPOModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition"
                >
                  Generate PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SupplierManagement;
