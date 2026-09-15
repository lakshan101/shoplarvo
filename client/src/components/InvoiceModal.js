import React from 'react';
import { X, Printer, CheckCircle, Package } from 'lucide-react';

const InvoiceModal = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${order._id ? order._id.toString().slice(-6).toUpperCase() : '1001'}`;
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white text-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full p-8 relative print:shadow-none print:max-w-none print:w-full print:p-0">
        
        {/* Modal Controls (Hidden when printing) */}
        <div className="flex justify-between items-center mb-6 border-b pb-4 print:hidden">
          <div className="flex items-center space-x-2 text-indigo-600 font-bold text-lg">
            <Package className="w-6 h-6" />
            <span>ShopLarvo Printable Invoice (US33)</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Content */}
        <div id="printable-invoice" className="space-y-6">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-indigo-900">Larvo Fashion (Pvt) Ltd</h1>
              <p className="text-sm text-gray-500 mt-1">ShopLarvo Smart Clothing Management</p>
              <p className="text-xs text-gray-400">Colombo, Sri Lanka | support@larvofashion.com</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                Official Invoice
              </span>
              <h2 className="text-xl font-bold text-gray-800 mt-2">{invoiceNumber}</h2>
              <p className="text-xs text-gray-500">Date: {orderDate}</p>
            </div>
          </div>

          {/* Billing & Shipping Details */}
          <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl text-sm">
            <div>
              <h3 className="font-bold text-gray-700 uppercase text-xs tracking-wider mb-2">Billed To</h3>
              <p className="font-semibold text-gray-900">{order.user?.name || 'Valued Customer'}</p>
              <p className="text-gray-600 text-xs">{order.user?.email}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-700 uppercase text-xs tracking-wider mb-2">Shipping Destination</h3>
              <p className="text-gray-700">{order.shippingAddress?.street}</p>
              <p className="text-gray-700">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
              <p className="text-gray-700 font-semibold">{order.shippingAddress?.country || 'Sri Lanka'}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-xs font-bold text-gray-500 uppercase bg-gray-100">
                  <th className="py-3 px-4">Item Description</th>
                  <th className="py-3 px-4 text-center">Variant</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {order.orderItems?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-4 font-medium text-gray-900">{item.title}</td>
                    <td className="py-3 px-4 text-center text-xs text-gray-600">
                      Size: <span className="font-bold">{item.selectedSize}</span> | Color: <span className="font-bold">{item.selectedColor}</span>
                    </td>
                    <td className="py-3 px-4 text-center">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">${item.price?.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Calculation & Slip Receipt Preview */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 text-green-600 text-xs font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>Payment Method: {order.paymentMethod || 'Bank Deposit / Slip Upload'}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 block">Total Amount</span>
                <span className="text-2xl font-black text-indigo-900">${order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>

            {order.paymentSlipUrl && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <span className="font-bold text-slate-700 block">Attached Bank Deposit Payment Slip Receipt:</span>
                <img 
                  src={order.paymentSlipUrl} 
                  alt="Bank Deposit Slip Receipt" 
                  className="max-h-48 rounded-lg border border-slate-300 shadow-sm object-contain"
                />
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-center pt-6 border-t text-xs text-gray-400">
            Thank you for shopping with Larvo Fashion! For return claims within 2 days, please visit your user profile dashboard.
          </div>
        </div>

      </div>
    </div>
  );
};

export default InvoiceModal;
