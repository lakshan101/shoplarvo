import React from 'react';
import { X, Printer, Truck, Package, QrCode, ShieldCheck, MapPin, Phone, Mail, Building2 } from 'lucide-react';

export default function ShippingWaybillModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const customerName = order.customerName || order.shippingAddress?.name || (typeof order.user === 'object' ? order.user?.name : null) || 'Valued Customer';
  const customerPhone = order.customerPhone || order.shippingAddress?.phone || (typeof order.user === 'object' ? order.user?.phone : null) || '+94 77 123 4567';
  const customerEmail = order.customerEmail || (typeof order.user === 'object' ? order.user?.email : null) || 'customer@larvofashion.com';
  const trackingNumber = order.trackingNumber || `SH-TRK-${order._id ? order._id.toString().slice(-5) : '27481'}`;

  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 relative print:shadow-none print:max-w-none print:w-full print:p-0">
        
        {/* Modal Header Controls (Hidden during print) */}
        <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4 print:hidden">
          <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-base sm:text-lg">
            <Truck className="w-6 h-6 text-indigo-600" />
            <span>Express Courier Shipping Label & Delivery Waybill (Daraz / Alibaba Style)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-lg transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Delivery Label / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Delivery Waybill Sheet */}
        <div id="printable-waybill" className="space-y-5 border-2 border-slate-900 p-6 rounded-2xl bg-white text-xs">
          
          {/* 1. Barcode & Courier Branding Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-slate-900 text-white px-3 py-1 rounded-md text-[11px] font-black tracking-widest uppercase">
                  SHOPLARVO LOGISTICS
                </span>
                <span className="bg-indigo-100 text-indigo-900 border border-indigo-200 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase">
                  EXPRESS PARCEL WAYBILL
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1">ORDER DISPATCH WAYBILL</h2>
              <p className="text-[10px] text-slate-500">Official Package Handling Document for Delivery Company & Recipient</p>
            </div>

            {/* Simulated Barcode Graphic */}
            <div className="text-right bg-slate-50 p-3 rounded-xl border border-slate-300 w-full sm:w-auto">
              <div className="font-mono text-2xl font-black tracking-widest text-slate-900 select-none">
                ||| | |||| | |||||| || |
              </div>
              <span className="font-mono font-bold text-xs text-indigo-700 block mt-0.5">
                TRACKING #: {trackingNumber}
              </span>
              <span className="text-[10px] text-slate-400 block">ORDER REF: #{order._id}</span>
            </div>
          </div>

          {/* 2. Three Distribution Copies Badges */}
          <div className="grid grid-cols-3 gap-2 text-center font-bold text-[10px] uppercase tracking-wider">
            <div className="p-1.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg">
              ✓ COURIER COMPANY COPY
            </div>
            <div className="p-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg">
              ✓ CUSTOMER RECEIPT COPY
            </div>
            <div className="p-1.5 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg">
              ✓ WAREHOUSE DISPATCH FILE
            </div>
          </div>

          {/* 3. Recipient (Deliver To) & Sender (Ship From) Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b-2 border-slate-900 pb-4">
            
            {/* Recipient / Customer Details */}
            <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-200 space-y-1.5">
              <span className="font-black text-indigo-950 uppercase tracking-wider text-[11px] block border-b border-indigo-200 pb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" /> DELIVER TO (RECIPIENT)
              </span>
              <p className="text-slate-900 text-sm font-extrabold">{customerName}</p>
              <p className="text-slate-700 font-bold">{order.shippingAddress?.street}</p>
              <p className="text-slate-600">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
              <p className="text-slate-700 font-bold">{order.shippingAddress?.country || 'Sri Lanka'}</p>
              <div className="pt-2 border-t border-indigo-200/60 font-mono text-xs space-y-0.5">
                <p className="font-extrabold text-slate-900 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-indigo-600" /> Phone: {customerPhone}
                </p>
                <p className="text-slate-600 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" /> Email: {customerEmail}
                </p>
              </div>
            </div>

            {/* Sender / Warehouse Details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-black text-slate-900 uppercase tracking-wider text-[11px] block border-b border-slate-200 pb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-700" /> SHIP FROM (SENDER)
              </span>
              <p className="text-slate-900 text-sm font-extrabold">ShopLarvo Executive Apparel Warehouse</p>
              <p className="text-slate-700 font-medium">100 Logistics Hub, Galle Road</p>
              <p className="text-slate-600">Colombo 03, Western Province 00300, Sri Lanka</p>
              <div className="pt-2 border-t border-slate-200 font-mono text-xs space-y-0.5">
                <p className="font-bold text-slate-900">Hotline: +94 11 888 7777</p>
                <p className="text-slate-600">Dispatch Support: logistics@larvofashion.com</p>
              </div>
            </div>

          </div>

          {/* 4. Itemized Package Contents Manifest */}
          <div className="space-y-2">
            <span className="font-black text-slate-900 uppercase tracking-wider text-[11px] block">
              PACKAGE CONTENTS MANIFEST ({order.orderItems?.length || 0} ITEMS)
            </span>
            <table className="w-full text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-black text-slate-700 uppercase">
                  <th className="p-2 border-r border-slate-300">Item Title / Description</th>
                  <th className="p-2 border-r border-slate-300 text-center">Variant</th>
                  <th className="p-2 border-r border-slate-300 text-center">Qty</th>
                  <th className="p-2 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {order.orderItems?.map((it, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2 font-bold text-slate-900 border-r border-slate-200">{it.title}</td>
                    <td className="p-2 text-center text-slate-600 border-r border-slate-200">
                      Size: <strong className="text-slate-900">{it.selectedSize}</strong> | Color: <strong className="text-slate-900">{it.selectedColor}</strong>
                    </td>
                    <td className="p-2 text-center font-black text-slate-900 border-r border-slate-200">x{it.quantity}</td>
                    <td className="p-2 text-right font-extrabold text-slate-900">${((it.price || 0) * it.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 5. Payment & Driver Notes Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-300">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Payment Details</span>
              <p className="font-extrabold text-slate-900 text-xs mt-0.5">{order.paymentMethod || 'Bank Deposit / Slip Upload'}</p>
              <p className="text-[11px] text-emerald-700 font-bold">Status: VERIFIED & APPROVED</p>
              <p className="text-base font-black text-slate-900 mt-1">Total Package Value: ${order.totalAmount?.toFixed(2)}</p>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Courier Driver Notes</span>
              <p className="font-semibold text-slate-800 text-xs mt-0.5 italic">
                {order.deliveryNotes || 'Standard express delivery. Contact customer via mobile phone prior to arrival.'}
              </p>
              <span className="text-[10px] text-slate-400 block mt-2">Dispatched Date: {orderDate}</span>
            </div>
          </div>

          {/* 6. Signature & Verification Footer */}
          <div className="pt-4 border-t border-slate-300 flex justify-between items-end text-[10px] text-slate-400 font-medium">
            <div>
              <p>Handled by: <strong>ShopLarvo Logistics System</strong></p>
              <p>Security Hash: {trackingNumber}-VERIFIED</p>
            </div>
            <div className="text-right border-t border-slate-400 pt-2 min-w-[140px]">
              <span className="block font-bold text-slate-700">Courier Driver Signature</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
