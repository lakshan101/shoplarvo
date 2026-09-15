import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('stylehub_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('stylehub_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [addedNotification, setAddedNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem('stylehub_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('stylehub_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToCart = (product, selectedSize = 'M', selectedColor = 'Black', quantity = 1) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item._id === product._id && item.selectedSize === selectedSize && item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { ...product, selectedSize, selectedColor, quantity }];
      }
    });

    setAddedNotification({
      product,
      selectedSize,
      selectedColor,
      quantity,
      id: Date.now()
    });

    setTimeout(() => {
      setAddedNotification(null);
    }, 4500);
  };

  const removeFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCartItems([]);

  const toggleWishlist = (product) => {
    setWishlistItems(prev => {
      const exists = prev.some(item => item._id === product._id);
      if (exists) {
        return prev.filter(item => item._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCartItems(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index].quantity = newQuantity;
      }
      return updated;
    });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      wishlistItems, 
      selectedDepartment,
      setSelectedDepartment,
      addToCart, 
      removeFromCart, 
      updateQuantity,
      clearCart, 
      toggleWishlist, 
      isInWishlist, 
      subtotal,
      cartTotal: subtotal
    }}>
      {children}

      {/* Floating Added to Cart Popup Modal */}
      {addedNotification && (
        <div className="fixed top-24 right-4 sm:right-8 z-[9999] max-w-sm w-[90vw] sm:w-80 bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 text-slate-900 flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow">
                ✓
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">Added to Shopping Cart!</h4>
                <p className="text-[10px] text-slate-500">Item successfully added to your bag</p>
              </div>
            </div>
            <button 
              onClick={() => setAddedNotification(null)}
              className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold transition"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center gap-3">
            <img 
              src={addedNotification.product.image} 
              alt={addedNotification.product.title} 
              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
            />
            <div className="flex-1 text-xs space-y-0.5">
              <h5 className="font-bold text-slate-900 line-clamp-1">{addedNotification.product.title}</h5>
              <p className="text-slate-500 text-[10px]">
                Size: <span className="font-bold text-slate-800">{addedNotification.selectedSize}</span> | Color: <span className="font-bold text-slate-800">{addedNotification.selectedColor}</span>
              </p>
              <p className="font-black text-emerald-600 text-xs">${(addedNotification.product.price * addedNotification.quantity).toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-bold">
            <a 
              href="/cart" 
              onClick={() => setAddedNotification(null)}
              className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-center transition"
            >
              View Cart
            </a>
            <a 
              href="/cart" 
              onClick={() => setAddedNotification(null)}
              className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-center shadow transition"
            >
              Checkout Now
            </a>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};
