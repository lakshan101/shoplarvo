import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { ShoppingBag, Heart, LogOut, Shield, Sparkles, Search, Tag, Menu, X, Gem, LogIn } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems, wishlistItems, selectedDepartment, setSelectedDepartment } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hiddenNav, setHiddenNav] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  // Ultra-Smooth Scroll to Hide Navbar behavior (700ms ease-in-out gliding)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY) {
          setHiddenNav(true); // Hide when scrolling down
        } else if (currentScrollY < 250) {
          setHiddenNav(false); // Only reappear near the top area of the site
        }
      } else {
        setHiddenNav(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-sm w-full transition-all duration-700 ease-in-out ${hiddenNav ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
      
      {/* 1. Midnight Slate Top Announcement Ticker */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-[#f8fafc] text-[11px] py-2 overflow-hidden border-b border-slate-800">
        <div className="animate-marquee whitespace-nowrap font-medium flex items-center gap-12 tracking-widest uppercase">
          <span>✨ <strong className="text-white">COMPLIMENTARY EXPRESS WORLDWIDE SHIPPING</strong> ON ORDERS OVER $100</span>
          <span>💎 <strong className="text-white">USE CODE: <span className="bg-white/20 text-[#38bdf8] px-2 py-0.5 rounded font-mono font-bold">STYLE25</span></strong> FOR 25% OFF NEW COLLECTION</span>
          <span>🔄 <strong className="text-white">EASY 30-DAY COMPLIMENTARY RETURNS</strong></span>
          <span>🤖 <strong className="text-white">AI OUTFIT STYLIST ADVISOR</strong> NOW ACTIVE</span>
          <span>✨ <strong className="text-white">COMPLIMENTARY EXPRESS WORLDWIDE SHIPPING</strong> ON ORDERS OVER $100</span>
        </div>
      </div>

      {/* 2. Department Selector Bar */}
      <div className="bg-[#f1f5f9] border-b border-slate-200/80 px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-none flex items-center justify-between text-xs font-bold">
          
          <div className="flex items-center gap-1">
            {['ALL', 'WOMEN', 'MEN'].map((dept) => (
              <button
                key={dept}
                onClick={() => { setSelectedDepartment(dept); navigate('/shop'); }}
                className={`py-2.5 px-6 tracking-[0.12em] transition-all border-b-2 ${
                  selectedDepartment === dept 
                    ? 'border-[#0f172a] text-[#0f172a] bg-white font-extrabold shadow-sm' 
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {dept} FASHION
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6 text-slate-600 font-semibold text-[11px] tracking-wider uppercase">
            <Link to="/about" className="hover:text-[#0f172a] transition-colors">About StyleHub</Link>
            <Link to="/contact" className="hover:text-[#0f172a] transition-colors">Client Services</Link>
            {user && (user.role === 'admin' || user.role === 'staff') && (
              <Link to="/admin" className="flex items-center gap-1 text-[#0f172a] font-bold hover:underline bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                <Shield className="w-3.5 h-3.5 text-blue-600" /> Admin Portal
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* 3. Main Professional Header Bar */}
      <div className="w-full max-w-none px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-20 gap-6">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#0f172a] p-0.5 shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform flex items-center justify-center text-white">
              <Gem className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                STYLE<span className="text-slate-600">HUB</span>
              </span>
              <span className="text-[9px] font-bold tracking-[0.2em] text-slate-500 uppercase -mt-1">
                EXECUTIVE EDITION
              </span>
            </div>
          </Link>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-2xl relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clothes, streetwear, hoodies, suits, luxury accessories..."
              className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl py-2.5 pl-11 pr-24 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0f172a] focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all shadow-inner"
            />
            <button type="submit" className="absolute right-2 top-1.5 px-4 py-1.5 rounded-xl gradient-button text-xs shadow-md hover:shadow-lg transition-all font-bold">
              Search
            </button>
          </form>

          {/* Right Actions & SINGLE Sign In Button */}
          <div className="flex items-center gap-4 shrink-0">
            
            {/* Wishlist Icon */}
            <Link to="/shop" className="relative p-2 text-slate-700 hover:text-slate-900 transition-colors">
              <Heart className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Icon */}
            <Link to="/cart" className="relative p-2 text-slate-700 hover:text-slate-900 transition-colors">
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Single Sign In Header Button */}
            {user ? (
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                <Link to="/profile" className="flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-slate-900 transition-colors bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl">
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                </Link>
                <button 
                  onClick={() => { logout(); navigate('/login'); }}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                <Link 
                  to="/login" 
                  className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-blue-600 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-800">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* 4. Secondary Ribbon Nav */}
      <nav className="hidden md:block bg-slate-50 border-t border-slate-200 px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-none flex items-center justify-between text-xs font-bold tracking-wider text-slate-700 py-3 uppercase overflow-x-auto">
          <Link to="/shop" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-slate-900" /> New Season
          </Link>
          <Link to="/shop" className="hover:text-blue-600 transition-colors">Trending Now</Link>
          <Link to="/shop" className="hover:text-blue-600 transition-colors">Streetwear & Hoodies</Link>
          <Link to="/shop" className="hover:text-blue-600 transition-colors">Suits & Tailoring</Link>
          <Link to="/shop" className="hover:text-blue-600 transition-colors">Casual Denim</Link>
          <Link to="/shop" className="hover:text-blue-600 transition-colors">Footwear</Link>
          <Link to="/shop" className="hover:text-blue-600 transition-colors">Accessories</Link>
          <Link to="/shop" className="text-red-600 font-extrabold hover:underline flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-red-600" /> Outlet Sale %
          </Link>
        </div>
      </nav>

    </header>
  );
}
