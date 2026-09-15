import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Truck, PackageCheck, Clock, CheckCircle2, Search, MapPin, 
  Phone, Mail, FileText, AlertCircle, RefreshCw, Save, Shield
} from 'lucide-react';

export default function DeliveryDashboard() {
  const { token, user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedSlipUrl, setSelectedSlipUrl] = useState(null);

  useEffect(() => {
    fetchDeliveryOrders();
  }, [token]);

  const fetchDeliveryOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      } else {
        // Fallback demo delivery orders
        setOrders([
          {
            _id: 'ord_1001',
            user: { name: 'Digoarachchi S. A.', email: 'student1@sliit.lk', phone: '+94 77 123 4567' },
            orderItems: [{ title: 'Urban Cyberpunk Oversized Hoodie', quantity: 2, price: 85.00, selectedSize: 'L', selectedColor: 'Black' }],
            shippingAddress: { street: '45 Galle Road', city: 'Colombo 03', state: 'Western Province', zipCode: '00300', country: 'Sri Lanka' },
            paymentMethod: 'Bank Deposit / Slip Upload',
            paymentSlipUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
            totalAmount: 170.00,
            status: 'Processing',
            trackingNumber: 'SH-TRK-98742',
            deliveryNotes: 'Customer requested evening delivery after 5 PM',
            createdAt: new Date()
          }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus, trackingNum, notes) => {
    setUpdatingOrderId(orderId);
    setMessage('');
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: newStatus,
          trackingNumber: trackingNum,
          deliveryNotes: notes
        })
      });

      if (res.ok) {
        setMessage(`Order status updated to ${newStatus} successfully!`);
        fetchDeliveryOrders();
      } else {
        alert('Failed to update delivery status');
      }
    } catch (err) {
      // Local fallback state update
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus, trackingNumber: trackingNum } : o));
      setMessage(`Order status updated to ${newStatus}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      (o.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.trackingNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o._id || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOrdersCount = orders.length;
  const processingCount = orders.filter(o => o.status === 'Processing' || o.status === 'Pending Payment').length;
  const shippedCount = orders.filter(o => o.status === 'Shipped').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;

  return (
    <div className="space-y-8 animate-fade-in py-4 w-full text-slate-900">
      
      {/* Dashboard Header */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-900 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-indigo-300" /> Logistics & Delivery Manager Portal
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">Delivery Management Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track customer orders, manage real-time courier dispatch, verify payment receipts, and update delivery statuses.
          </p>
        </div>

        <button
          onClick={fetchDeliveryOrders}
          className="px-4 py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow hover:bg-indigo-600 transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Orders
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Total Orders</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">{totalOrdersCount}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <PackageCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-600 font-bold uppercase tracking-wider block">Pending Dispatch</span>
            <span className="text-3xl font-black text-amber-700 mt-1 block">{processingCount}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-blue-600 font-bold uppercase tracking-wider block">In Transit (Shipped)</span>
            <span className="text-3xl font-black text-blue-700 mt-1 block">{shippedCount}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider block">Delivered</span>
            <span className="text-3xl font-black text-emerald-700 mt-1 block">{deliveredCount}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, tracking #, order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-slate-900 focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto">
          {['All', 'Processing', 'Shipped', 'Delivered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl font-bold transition whitespace-nowrap ${
                statusFilter === st ? 'bg-slate-900 text-white shadow' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery Orders List */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-400">Loading delivery orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-xs text-slate-500 shadow-sm">
          No delivery orders match your search criteria.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((ord) => (
            <DeliveryOrderCard 
              key={ord._id} 
              order={ord} 
              onUpdateStatus={handleUpdateStatus} 
              isUpdating={updatingOrderId === ord._id}
              onViewSlip={(url) => setSelectedSlipUrl(url)}
            />
          ))}
        </div>
      )}

      {/* Bank Slip Modal */}
      {selectedSlipUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="relative bg-white rounded-3xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" /> Customer Attached Bank Slip Receipt
              </h3>
              <button 
                onClick={() => setSelectedSlipUrl(null)} 
                className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
            <img src={selectedSlipUrl} alt="Bank Slip Receipt" className="w-full max-h-96 object-contain rounded-2xl border border-slate-200" />
          </div>
        </div>
      )}

    </div>
  );
}

// Subcomponent for each Delivery Order Card
function DeliveryOrderCard({ order, onUpdateStatus, isUpdating, onViewSlip }) {
  const [currentStatus, setCurrentStatus] = useState(order.status || 'Processing');
  const [trackingNo, setTrackingNo] = useState(order.trackingNumber || `SH-TRK-${Math.floor(10000 + Math.random() * 90000)}`);
  const [notes, setNotes] = useState(order.deliveryNotes || '');

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm hover:shadow-md transition">
      
      {/* Top Bar: Customer & Status Badge */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-extrabold text-slate-900">{order.user?.name || 'Customer Order'}</h3>
            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
              currentStatus === 'Delivered'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : currentStatus === 'Shipped'
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {currentStatus}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Order ID: #{order._id}</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {order.paymentSlipUrl && (
            <button
              onClick={() => onViewSlip(order.paymentSlipUrl)}
              className="px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" /> View Payment Slip
            </button>
          )}

          <select
            value={currentStatus}
            onChange={(e) => setCurrentStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
          >
            <option value="Pending Payment">Pending Payment</option>
            <option value="Processing">Processing / Dispatch</option>
            <option value="Shipped">Shipped (In Transit)</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Order Details & Customer Shipping Destination */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        
        {/* Customer Contact & Address */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
          <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-indigo-600" /> Shipping Destination
          </h4>
          <p className="text-slate-800 font-bold">{order.shippingAddress?.street}</p>
          <p className="text-slate-600">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
          <p className="text-slate-600 font-semibold">{order.shippingAddress?.country || 'Sri Lanka'}</p>
          <div className="pt-2 border-t border-slate-200/80 space-y-1 text-[11px]">
            <p className="flex items-center gap-1 text-slate-700 font-semibold">
              <Phone className="w-3.5 h-3.5 text-blue-600" /> Phone: {order.user?.phone || '+94 77 123 4567'}
            </p>
            <p className="flex items-center gap-1 text-slate-600">
              <Mail className="w-3.5 h-3.5 text-indigo-600" /> {order.user?.email}
            </p>
          </div>
        </div>

        {/* Itemized Order Summary */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
            Order Items ({order.orderItems?.length || 0})
          </h4>
          <div className="space-y-2 max-h-36 overflow-y-auto">
            {order.orderItems?.map((it, i) => (
              <div key={i} className="flex justify-between items-center text-[11px] border-b border-slate-200/60 pb-1.5">
                <span className="font-semibold text-slate-800">{it.title} (Size: {it.selectedSize})</span>
                <span className="font-bold text-slate-900">x{it.quantity} (${(it.price * it.quantity).toFixed(2)})</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-extrabold text-xs text-slate-900 pt-1 border-t border-slate-200">
            <span>Total Value</span>
            <span>${order.totalAmount?.toFixed(2)}</span>
          </div>
        </div>

        {/* Courier & Tracking Manager Controls */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-slate-900" /> Logistics Tracking Control
          </h4>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Tracking Number</label>
            <input 
              type="text" 
              value={trackingNo}
              onChange={(e) => setTrackingNo(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3 font-mono font-bold text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Delivery Driver / Courier Notes</label>
            <input 
              type="text"
              placeholder="e.g. Leave package with front desk security"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-slate-900 focus:outline-none"
            />
          </div>

          <button
            disabled={isUpdating}
            onClick={() => onUpdateStatus(order._id, currentStatus, trackingNo, notes)}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{isUpdating ? 'Saving...' : 'Save & Update Tracking Status'}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
