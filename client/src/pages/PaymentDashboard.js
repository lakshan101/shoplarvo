import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CreditCard, CheckCircle2, XCircle, FileText, RefreshCw, Search, ShieldCheck, Eye, Lock } from 'lucide-react';

export default function PaymentDashboard() {
  const { token, user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusTab, setStatusTab] = useState('Pending'); // 'Pending', 'Approved', 'All'
  const [message, setMessage] = useState('');
  const [selectedSlipUrl, setSelectedSlipUrl] = useState(null);

  useEffect(() => {
    fetchPaymentOrders();
  }, [token]);

  const fetchPaymentOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      } else {
        setOrders([
          {
            _id: 'ord_1001',
            customerName: 'Digoarachchi S. A.',
            customerEmail: 'student1@sliit.lk',
            customerPhone: '+94 77 123 4567',
            paymentMethod: 'Bank Deposit / Slip Upload',
            paymentSlipUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
            totalAmount: 170.00,
            status: 'Payment Pending (Slip Uploaded)',
            createdAt: new Date(),
            orderItems: [{ title: 'Urban Cyberpunk Oversized Hoodie', quantity: 2, price: 85.00, selectedSize: 'L', selectedColor: 'Black' }]
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async (orderId, action) => {
    setMessage('');
    try {
      const res = await fetch(`/api/orders/${orderId}/approve-payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`Payment ${action.toLowerCase()}d successfully! Order automatically sent to Delivery Manager.`);
        fetchPaymentOrders();
      } else {
        alert(data.message || 'Error updating payment');
      }
    } catch (e) {
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: action === 'Approve' ? 'Payment Approved - Ready for Packing' : 'Cancelled' } : o));
      setMessage(`Payment ${action.toLowerCase()}d (Local State)`);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      (o.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customerEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o._id || '').toLowerCase().includes(searchQuery.toLowerCase());

    const isPending = o.status === 'Payment Pending (Slip Uploaded)';
    const isApproved = o.status !== 'Payment Pending (Slip Uploaded)' && o.status !== 'Cancelled';

    if (statusTab === 'Pending') return matchesSearch && isPending;
    if (statusTab === 'Approved') return matchesSearch && isApproved;
    return matchesSearch;
  });

  const pendingCount = orders.filter(o => o.status === 'Payment Pending (Slip Uploaded)').length;
  const approvedCount = orders.filter(o => o.status !== 'Payment Pending (Slip Uploaded)' && o.status !== 'Cancelled').length;

  return (
    <div className="space-y-8 animate-fade-in py-4 w-full text-slate-900">
      
      {/* Header */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#0f172a] text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Dedicated Payment Manager Portal (E03)
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">Order Payment Verification & Approval</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review customer bank deposit slip receipts and approve payments to send orders to the Delivery Manager.
          </p>
        </div>

        <button
          onClick={fetchPaymentOrders}
          className="px-4 py-2.5 rounded-2xl bg-[#0f172a] text-white font-bold text-xs shadow hover:bg-emerald-600 transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Payments
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-600 font-bold uppercase tracking-wider block">Pending Payment Slip Verification</span>
            <span className="text-3xl font-black text-amber-700 mt-1 block">{pendingCount}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider block">Approved & Verified Payments</span>
            <span className="text-3xl font-black text-emerald-700 mt-1 block">{approvedCount}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Search & Tabs */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, email, order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-slate-900 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1">
          {[
            { id: 'Pending', label: `Pending Verification (${pendingCount})` },
            { id: 'Approved', label: `Approved Payments (${approvedCount})` },
            { id: 'All', label: `All Orders (${orders.length})` }
          ].map((tb) => (
            <button
              key={tb.id}
              onClick={() => setStatusTab(tb.id)}
              className={`px-4 py-2 rounded-xl font-bold transition ${
                statusTab === tb.id ? 'bg-[#0f172a] text-white shadow' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-400">Loading payment orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-xs text-slate-500 shadow-sm">
          No orders match your filter criteria.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((ord) => (
            <div key={ord._id} className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-6 text-slate-900">
              
              {/* Header Bar */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-extrabold text-slate-900 text-base">{ord.customerName || 'Customer'}</h3>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                      ord.status === 'Payment Pending (Slip Uploaded)' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Order Ref ID: <strong>#{ord._id}</strong> | Date: {new Date(ord.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">Total Payment Amount:</span>
                  <span className="text-2xl font-black text-emerald-800">${ord.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

              {/* Grid: Customer Details, Items, Slip Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
                
                {/* Customer Details */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">Customer & Contact Info</h4>
                  <p className="text-slate-800 font-bold">{ord.customerName || 'Valued Customer'}</p>
                  <p className="text-slate-600">Email: {ord.customerEmail}</p>
                  <p className="text-slate-600">Phone: {ord.customerPhone || '+94 77 123 4567'}</p>
                  <p className="text-slate-600 font-semibold pt-1">Payment Method: {ord.paymentMethod || 'Bank Deposit / Slip Upload'}</p>
                </div>

                {/* Items Summary */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">Purchased Items ({ord.orderItems?.length || 0})</h4>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {ord.orderItems?.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px] border-b border-slate-200/60 pb-1">
                        <span className="font-semibold text-slate-800">{it.title} (Size: {it.selectedSize})</span>
                        <span className="font-bold text-slate-900">x{it.quantity} (${((it.price || 0) * it.quantity).toFixed(2)})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bank Slip Receipt Inspection */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-center">
                  <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] text-left">Attached Bank Payment Slip</h4>
                  
                  {ord.paymentSlipUrl ? (
                    <div className="space-y-2">
                      <img 
                        src={ord.paymentSlipUrl} 
                        alt="Bank Slip Receipt" 
                        onClick={() => setSelectedSlipUrl(ord.paymentSlipUrl)}
                        className="max-h-24 mx-auto rounded-xl object-contain border border-slate-300 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                      />
                      <button
                        onClick={() => setSelectedSlipUrl(ord.paymentSlipUrl)}
                        className="text-indigo-600 font-bold text-[11px] underline flex items-center justify-center gap-1 mx-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect Full Size Slip
                      </button>
                    </div>
                  ) : (
                    <div className="py-6 text-slate-400 italic">No Bank Slip Uploaded</div>
                  )}
                </div>

              </div>

              {/* Payment Manager Approval Action Bar */}
              {ord.status === 'Payment Pending (Slip Uploaded)' && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 pt-3">
                  <span className="text-xs font-bold text-emerald-950">
                    Verify that the bank slip receipt matches total amount (${ord.totalAmount?.toFixed(2)}):
                  </span>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => handleApprovePayment(ord._id, 'Approve')}
                      className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve Payment & Send to Delivery Manager
                    </button>
                    <button
                      onClick={() => handleApprovePayment(ord._id, 'Reject')}
                      className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow transition flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

      {/* Slip Full View Modal */}
      {selectedSlipUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="relative bg-white rounded-3xl border border-slate-200 p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" /> Bank Payment Slip Inspection
              </h3>
              <button 
                onClick={() => setSelectedSlipUrl(null)} 
                className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
            <img src={selectedSlipUrl} alt="Bank Slip Receipt" className="w-full max-h-[70vh] object-contain rounded-2xl border border-slate-200" />
          </div>
        </div>
      )}

    </div>
  );
}
