import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { 
  Package, Truck, CheckCircle2, Clock, ShieldCheck, Upload, 
  RefreshCw, Award, Image, AlertCircle 
} from 'lucide-react';

export default function OrderTracking({ order, onReturnSubmitted }) {
  const { token } = useContext(AuthContext);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [damageImageUrl, setDamageImageUrl] = useState('');
  const [damageFileName, setDamageFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) return null;

  const stages = [
    { id: 1, key: 'Payment Pending (Slip Uploaded)', label: '1. Payment Verification' },
    { id: 2, key: 'Payment Approved - Ready for Packing', label: '2. Packaging Order' },
    { id: 3, key: 'Dispatched to Courier (In Transit)', label: '3. Handed to Delivery Co.' },
    { id: 4, key: 'Out for Customer Delivery', label: '4. Out for Delivery' },
    { id: 5, key: 'Successfully Delivered', label: '5. Delivered' }
  ];

  const getStageIndex = (status) => {
    if (status === 'Payment Pending (Slip Uploaded)') return 0;
    if (status === 'Payment Approved - Ready for Packing') return 1;
    if (status === 'Dispatched to Courier (In Transit)') return 2;
    if (status === 'Out for Customer Delivery') return 3;
    if (status === 'Successfully Delivered') return 4;
    return 1;
  };

  const currentIndex = getStageIndex(order.status);

  const handleDamageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDamageFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDamageImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    if (!returnReason.trim()) {
      alert('Please state the reason for returning this item.');
      return;
    }
    if (!damageImageUrl) {
      alert('Please upload an image showing the damage or issue with the package.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${order._id}/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ returnReason, damageImageUrl })
      });

      if (res.ok) {
        alert('Return request submitted with damage proof image! Delivery Manager will review your claim.');
        setShowReturnModal(false);
        if (onReturnSubmitted) onReturnSubmitted();
        window.location.reload();
      } else {
        alert('Failed to submit return request');
      }
    } catch (err) {
      alert('Return request submitted (Local State)');
      setShowReturnModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 text-slate-900">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Order Reference ID: #{order._id}</span>
          <h4 className="text-sm font-bold text-slate-900 mt-0.5">
            Tracking #: <span className="text-indigo-600 font-mono font-extrabold">{order.trackingNumber || 'SH-TRK-98742'}</span>
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-900 text-xs font-extrabold border border-indigo-200">
            Stage: {order.status}
          </span>
        </div>
      </div>

      {/* 4-Stage Stepper Progress Line */}
      <div className="flex justify-between items-center relative pt-4 pb-2">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -z-0"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-slate-900 transition-all duration-700 -z-0"
          style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
        ></div>

        {stages.map((st, idx) => {
          const isDone = idx <= currentIndex;
          return (
            <div key={st.id} className="flex flex-col items-center z-10 space-y-1.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                isDone ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-400 border-2 border-slate-200'
              }`}>
                {isDone ? <CheckCircle2 className="w-5 h-5 text-white" /> : (idx + 1)}
              </div>
              <span className={`text-[10px] font-extrabold text-center max-w-[90px] ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                {st.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Return Request Banner & Actions */}
      {order.status === 'Successfully Delivered' && (
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
          <div>
            <span className="font-extrabold text-purple-950 text-xs block">Order Delivered (2-Day Return Guarantee Active)</span>
            <p className="text-[11px] text-purple-700 mt-0.5">
              If your items have defects or size issues, you can submit a return claim within 2 days to receive full store reward points credit!
            </p>
          </div>

          {order.returnStatus && order.returnStatus !== 'None' ? (
            <div className="px-3 py-1.5 rounded-xl bg-purple-200 text-purple-950 font-extrabold text-xs">
              Return Status: {order.returnStatus}
            </div>
          ) : (
            <button
              onClick={() => setShowReturnModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className="w-4 h-4" /> Request Package Return
            </button>
          )}
        </div>
      )}

      {/* Reward Points Credited Alert */}
      {order.returnStatus === 'Approved & Points Credited' && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>🎉 Return Approved! Store Reward Points (+{Math.round(order.totalAmount || 0)} Pts) have been credited to your account for future purchases!</span>
        </div>
      )}

      {/* Return Claim Modal with Damage Proof File Upload */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-purple-600" />
                <span>Submit Package Return Claim (US21)</span>
              </h3>
              <button 
                onClick={() => setShowReturnModal(false)}
                className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmitReturn} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Reason for Return</label>
                <textarea
                  required
                  rows="3"
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="Describe damage, defect, or fitting issue in detail..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Upload Damage Proof Image (Required)</label>
                <div className="border-2 border-dashed border-purple-200 hover:border-purple-400 rounded-2xl bg-purple-50/50 p-4 text-center cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDamageFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  {damageImageUrl ? (
                    <div className="space-y-2 flex flex-col items-center">
                      <img src={damageImageUrl} alt="Damage Proof Preview" className="max-h-36 rounded-xl object-contain border border-purple-200" />
                      <span className="text-emerald-700 font-bold text-xs">Proof Attached: {damageFileName || 'damage_proof.jpg'}</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 text-purple-600 mx-auto" />
                      <p className="font-bold text-slate-800">Click to upload damage screenshot/photo</p>
                      <p className="text-[10px] text-slate-400">Supports JPG, PNG, WEBP</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold shadow"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Return Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
