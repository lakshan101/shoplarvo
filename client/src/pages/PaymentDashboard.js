import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CreditCard, CheckCircle2, XCircle, FileText, RefreshCw, Search, ShieldCheck } from 'lucide-react';

export default function PaymentDashboard() {
  const { token, user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [selectedSlipUrl, setSelectedSlipUrl] = useState(null);

  useEffect(() => {
    fetchPendingPaymentOrders();
  }, [token]);

  const fetchPendingPaymentOrders = async () => {
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
            orderItems: [{ title: 'Urban Cyberpunk Oversized Hoodie', quantity: 2, price: 85.00 }]
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
        setMessage(`Payment ${action.toLowerCase()}d successfully! Order sent to Delivery Manager.`);
        fetchPendingPaymentOrders();
      } else {
        alert(data.message || 'Error updating payment');
      }
    } catch (e) {
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: action === 'Approve' ? 'Payment Approved - Ready for Packing' : 'Cancelled' } : o));
      setMessage(`Payment ${action.toLowerCase()}d (Local State)`);
    }
  };

  const filteredOrders = orders.filter(o => 
    (o.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.customerEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o._id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = orders.filter(o => o.status === 'Payment Pending (Slip Uploaded)').length;
  const approvedCount = orders.filter(o => o.status !== 'Payment Pending (Slip Uploaded)' && o.status !== 'Cancelled').length;

  return (
    <div className="space-y-8 animate-fade-in py-4 w-full text-slate-900">
      
      {/* Header */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-900 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-emerald-300" /> Payment Manager Portal
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">Payment Verification Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review customer bank deposit slips and approve payments to send orders to the Delivery Manager.
          </p>
        </div>

        <button
          onClick={fetchPendingPaymentOrders}
          className="px-4 py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow hover:bg-emerald-600 transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Payments
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-600 font-bold uppercase tracking-wider block">Pending Payment Verification</span>
            <span className="text-3xl font-black text-amber-700 mt-1 block">{pendingCount}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider block">Approved Payments</span>
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

      {/* Search */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white shadow-sm flex justify-between items-center text-xs">
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
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-400">Loading pending payments...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-xs text-slate-500 shadow-sm">
          No pending payment verification orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => (
            <div key={ord._id} className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-extrabold text-slate-900 text-base">{ord.customerName || 'Customer'}</h3>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                    ord.status === 'Payment Pending (Slip Uploaded)' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {ord.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  Email: <strong>{ord.customerEmail}</strong> | Phone: <strong>{ord.customerPhone}</strong>
                </p>

                <p className="text-xs text-slate-800 font-bold">
                  Total Order Amount: <span className="text-emerald-700 font-extrabold text-sm">${ord.totalAmount?.toFixed(2)}</span>
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                {ord.paymentSlipUrl ? (
                  <button
                    onClick={() => setSelectedSlipUrl(ord.paymentSlipUrl)}
                    className="px-4 py-2.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" /> View Payment Slip
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 font-bold italic">No Slip Uploaded</span>
                )}

                {ord.status === 'Payment Pending (Slip Uploaded)' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprovePayment(ord._id, 'Approve')}
                      className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve Payment
                    </button>
                    <button
                      onClick={() => handleApprovePayment(ord._id, 'Reject')}
                      className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow transition flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Slip Modal */}
      {selectedSlipUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="relative bg-white rounded-3xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl space-y-4">
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
            <img src={selectedSlipUrl} alt="Bank Slip Receipt" className="w-full max-h-96 object-contain rounded-2xl border border-slate-200" />
          </div>
        </div>
      )}

    </div>
  );
}
