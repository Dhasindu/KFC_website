/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Menu as MenuIcon, 
  X, 
  MapPin, 
  Phone, 
  Clock, 
  ChevronRight, 
  Plus, 
  Minus,
  Check,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Music,
  Search,
  Bike,
  Store,
  Package,
  Truck,
  CheckCircle2,
  AlertCircle,
  LogIn
} from 'lucide-react';
import { MENU_ITEMS, CATEGORIES, MenuItem } from './constants';
import { SRI_LANKA_LOCATIONS } from './locations';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom KFC Marker Icon
const kfcIcon = new L.Icon({
  iconUrl: 'https://images.seeklogo.com/logo-png/16/2/kfc-logo-png_seeklogo-168461.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  className: 'bg-white rounded-full p-1 border-2 border-kfc-red shadow-lg'
});

// --- Components ---

const PROMOTIONS = [
  {
    id: 1,
    title: "BOGO FREE 6PC H&C BUCKET",
    description: "Buy one 6pc Hot & Crispy bucket and get another one absolutely FREE! Double the crunch, double the joy.",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/bogofree6pchcbucket1ae0ccee4f9540c8ae7990550a609221.jpg",
    price: "Rs. 3,750",
    tag: "BOGO Offer"
  },
  {
    id: 2,
    title: "BOGO FREE 8PC H&C BUCKET",
    description: "The ultimate sharing deal! Buy an 8pc Hot & Crispy bucket and get another 8pc bucket for FREE.",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/bogofree8pchcbucket897e0e917fd346af8dfb48c3b47ae7cb.jpg",
    price: "Rs. 4,950",
    tag: "Limited Time"
  },
  {
    id: 3,
    title: "2 BBQ MAYO BURGER + 6PC NUGGETS",
    description: "A smoky feast! Two delicious BBQ Mayo Burgers paired with 6 pieces of our signature golden nuggets.",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/2bbqmayoburger6pcnuggets080ac6952bf7475da1ee31640010e2e3.jpg",
    price: "Rs. 1,490",
    tag: "Combo Deal"
  },
  {
    id: 4,
    title: "2 KOCHCHI MAYO BURGER + 6PC NUGGETS",
    description: "Spicy & Satisfying! Two Kochchi Mayo Burgers with 6pc Nuggets for that perfect Sri Lankan kick.",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/2kochchimayoburger6pcnuggetsa148bd8e249a479583485e5a075d39e8.jpg",
    price: "Rs. 1,490",
    tag: "Spicy Combo"
  },
  {
    id: 5,
    title: "BBQ MAYO BURGER",
    description: "Our classic burger with a smoky BBQ twist and creamy mayo. Simple, yet incredibly flavorful.",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/bbqmayoburgeraaeae182ad7349e3a1a29631e1da7ff4.jpg",
    price: "Rs. 790",
    tag: "Individual"
  },
  {
    id: 6,
    title: "KOCHCHI MAYO BURGER",
    description: "Experience the heat! A crispy chicken fillet topped with our signature spicy Kochchi mayo.",
    image: "https://admin-kfc-web.azurewebsites.net/images/mainmenu/kochchimayoburger13e5d8a83f6c47ec9cb9464cfec909f2.jpg",
    price: "Rs. 790",
    tag: "Spicy"
  }
];

const PromotionsPage: React.FC<{ 
  onAddToCart: (item: any) => void,
  cartItems: { item: MenuItem, quantity: number }[],
  onUpdateQuantity: (id: string, delta: number) => void
}> = ({ onAddToCart, cartItems, onUpdateQuantity }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-32 pb-24 bg-kfc-gray min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black mb-4">Current <span className="text-kfc-red">Promotions</span></h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Check out our latest deals and special offers. Grab them before they're gone!
          </p>
          <div className="w-24 h-2 bg-kfc-red mx-auto mt-8"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {PROMOTIONS.map((promo) => {
            const promoId = `promo-${promo.id}`;
            const cartItem = cartItems.find(ci => ci.item.id === promoId);
            
            return (
              <motion.div 
                key={promo.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row group"
              >
                <div className="md:w-1/2 relative overflow-hidden">
                  <img 
                    src={promo.image} 
                    alt={promo.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-kfc-red text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                    {promo.tag}
                  </div>
                </div>
                <div className="md:w-1/2 p-8 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-black mb-3 group-hover:text-kfc-red transition-colors">{promo.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                      {promo.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-black text-kfc-black">{promo.price}</span>
                    {cartItem ? (
                      <div className="flex items-center gap-3 bg-gray-100 rounded-2xl p-1">
                        <button 
                          onClick={() => onUpdateQuantity(promoId, -1)}
                          className="p-2 bg-white rounded-xl hover:bg-gray-50 shadow-sm"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-sm w-4 text-center">
                          {cartItem.quantity}
                        </span>
                        <button 
                          onClick={() => onUpdateQuantity(promoId, 1)}
                          className="p-2 bg-white rounded-xl hover:bg-gray-50 shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => onAddToCart({
                          id: promoId,
                          name: promo.title,
                          description: promo.description,
                          price: parseInt(promo.price.replace(/[^0-9]/g, '')),
                          category: 'Promotions',
                          image: promo.image
                        })}
                        className="bg-kfc-black text-white p-3 rounded-xl hover:bg-kfc-red transition-all shadow-md flex items-center justify-center"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-20 bg-kfc-red rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-4">Want More Deals?</h2>
            <p className="text-red-100 mb-8 max-w-xl mx-auto">
              Sign up for our newsletter to receive exclusive offers and the latest news directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-white/20 border border-white/30 rounded-2xl px-6 py-4 text-white placeholder:text-red-200 outline-none focus:ring-2 focus:ring-white transition-all"
              />
              <button className="bg-white text-kfc-red px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-100 transition-all shadow-xl">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DeliveryOrderDetails = ({ isOpen, onClose, onOpenAddressModal }: { isOpen: boolean, onClose: () => void, onOpenAddressModal: () => void }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const formattedTime = currentTime.toLocaleString('en-US', {
    timeZone: 'Asia/Colombo',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  });

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] bg-kfc-gray flex items-center justify-center p-4 sm:p-8"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-kfc-red transition-colors z-20"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-8 sm:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black uppercase tracking-widest text-kfc-black">Delivery Order Details</h2>
              <div className="w-full h-px bg-gray-100 mt-6"></div>
            </div>

            {/* Section 1 - Order Time */}
            <div className="mb-10">
              <p className="text-gray-800 font-bold text-center mb-6">When would you like to place your order?</p>
              
              <button className="w-full bg-kfc-red text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-red-200 hover:bg-red-700 transition-all group">
                <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="font-black uppercase tracking-widest">Now</span>
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-kfc-red">
                <AlertCircle className="w-4 h-4" />
                <p className="text-xs font-bold uppercase tracking-wide">Please note Timed Orders are currently disabled</p>
              </div>

              <p className="text-center text-gray-500 text-xs mt-4 font-medium">
                Current time Sri Lanka ({formattedTime})
              </p>
            </div>

            <div className="w-full h-px bg-gray-100 mb-10"></div>

            {/* Section 2 - Delivery Address */}
            <div>
              <p className="text-gray-800 font-bold text-center mb-6">Where would you like your order be delivered to?</p>
              
              <div className="space-y-4">
                <button 
                  onClick={onOpenAddressModal}
                  className="w-full border-2 border-kfc-red text-kfc-red py-4 rounded-full flex items-center justify-center gap-3 font-black uppercase tracking-widest hover:bg-red-50 transition-all"
                >
                  <MapPin className="w-5 h-5" />
                  Select Address
                </button>

                <button 
                  onClick={onOpenAddressModal}
                  className="w-full bg-kfc-red text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                >
                  Continue to menu
                </button>

                <button disabled className="w-full bg-gray-100 text-gray-400 py-4 rounded-2xl font-black uppercase tracking-widest cursor-not-allowed">
                  Change order type to pickup
                </button>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-10 text-center">
              <p className="text-[10px] text-gray-400 font-medium italic">
                * Delivery times can change according to your delivery location.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const AuthPage: React.FC<{ onBack: () => void, onRegister: () => void, onLogin: (username: string) => void }> = ({ onBack, onRegister, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    // Mock login
    console.log('Logging in with:', { username, password, rememberMe });
    setError('');
    onLogin(username);
    onBack(); // Go back to home after "login"
  };

  return (
    <div className="min-h-[90vh] bg-gray-50 pt-32 pb-20 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-10">
          <h2 className="text-3xl font-black text-kfc-black text-center mb-6 uppercase tracking-tight">Sign in or Register</h2>
          <div className="w-full h-px bg-gray-100 mb-8"></div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Username *</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Mobile (Ex: 777123456) / Email *"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-kfc-red/20 focus:border-kfc-red transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Password *</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password *"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-kfc-red/20 focus:border-kfc-red transition-all"
              />
            </div>

            {error && (
              <p className="text-kfc-red text-xs font-bold ml-1">{error}</p>
            )}

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div 
                  className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${rememberMe ? 'bg-kfc-red border-kfc-red' : 'border-gray-200 group-hover:border-kfc-red'}`} 
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  {rememberMe && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm font-bold text-gray-500">Remember me</span>
              </label>
            </div>

            {/* Mock reCAPTCHA */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-gray-300 rounded bg-white flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                  {/* Empty checkbox for mock */}
                </div>
                <span className="text-sm font-medium text-gray-700">I'm not a robot</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" className="w-8 h-8 opacity-70" />
                <span className="text-[8px] font-bold text-gray-400">reCAPTCHA</span>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-kfc-red text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-200 flex items-center justify-center gap-3"
            >
              <LogIn className="w-5 h-5" />
              Log in with KFC
            </button>

            <div className="text-center">
              <button type="button" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-kfc-red transition-colors">
                Forgot your password ?
              </button>
            </div>
          </form>

          <div className="mt-10 space-y-4">
            <button 
              onClick={onBack}
              className="w-full bg-[#1DB954] text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#19a34a] transition-all shadow-xl shadow-green-100"
            >
              Continue as guest
            </button>
            <button 
              onClick={onRegister}
              className="w-full border-2 border-kfc-red text-kfc-red py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-50 transition-all"
            >
              Create an account
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const VerificationPage = ({ 
  mobileNumber, 
  email,
  onVerify, 
  onBack 
}: { 
  mobileNumber: string, 
  email: string,
  onVerify: () => void, 
  onBack: () => void 
}) => {
  const [code, setCode] = useState('');
  const [isEmailVerification, setIsEmailVerification] = useState(false);
  const [inputValue, setInputValue] = useState(mobileNumber);

  useEffect(() => {
    setInputValue(isEmailVerification ? email : mobileNumber);
  }, [isEmailVerification, email, mobileNumber]);

  return (
    <div className="min-h-screen bg-gray-100 pt-32 pb-20 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-10">
          <h2 className="text-3xl font-black text-kfc-black text-center mb-6 uppercase tracking-tight">Verification Codes</h2>
          <div className="w-full h-px bg-gray-100 mb-8"></div>

          <div className="mb-8 text-center">
            <p className="text-sm font-bold text-gray-500 leading-relaxed">
              {isEmailVerification 
                ? "Please enter the verification code sent to your email address to complete your registration."
                : "Please enter the verification code sent to your mobile number to complete your registration."
              }
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                {isEmailVerification ? "Email Address" : "Mobile Number"}
              </label>
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isEmailVerification ? "Enter your email" : "Enter your mobile number"}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-kfc-red/20 focus:border-kfc-red transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Verification Code</label>
              <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-800 tracking-[0.5em] text-center focus:outline-none focus:ring-2 focus:ring-kfc-red/20 focus:border-kfc-red transition-all"
                maxLength={6}
              />
            </div>

            <div className="pt-4 space-y-4">
              <button 
                onClick={onVerify}
                className="w-full bg-kfc-red text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-200"
              >
                {isEmailVerification ? "Verify Email" : "Verify Mobile"}
              </button>
              
              <button 
                onClick={() => setIsEmailVerification(!isEmailVerification)}
                className="w-full bg-gray-100 text-gray-600 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
              >
                {isEmailVerification ? "Switch to Verify Mobile" : "Switch to Verify Email"}
              </button>

              <button 
                onClick={onBack}
                className="w-full text-xs font-black text-gray-400 uppercase tracking-widest hover:text-kfc-red transition-colors"
              >
                Back to Registration
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const RegisterPage = ({ onBack, onRegisterSuccess }: { onBack: () => void, onRegisterSuccess: (mobile: string, email: string) => void }) => {
  const [formData, setFormData] = useState({
    title: 'Mr.',
    firstName: '',
    lastName: '',
    country: 'Sri Lanka',
    phoneCode: '94',
    phoneNo: '',
    email: '',
    password: '',
    confirmPassword: '',
    useEmailAsUsername: false,
    useMobileAsUsername: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.phoneNo) newErrors.phoneNo = 'Phone Number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.useEmailAsUsername && !formData.useMobileAsUsername) {
      newErrors.usernameOption = 'Please select one or more username options';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Registering:', formData);
      onRegisterSuccess(formData.phoneNo, formData.email);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-100 pt-32 pb-20 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-12 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-kfc-black mb-2 uppercase tracking-tight">Registration Successful!</h2>
          <p className="text-gray-500 font-medium mb-10">Welcome to the KFC family, {formData.firstName}!</p>
          
          <div className="bg-gray-50 rounded-3xl p-8 text-left space-y-4 mb-10">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Account Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</p>
                <p className="font-bold text-gray-800">{formData.title} {formData.firstName} {formData.lastName}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Country</p>
                <p className="font-bold text-gray-800">{formData.country}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</p>
                <p className="font-bold text-gray-800">+{formData.phoneCode} {formData.phoneNo}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</p>
                <p className="font-bold text-gray-800">{formData.email || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onBack}
            className="w-full bg-kfc-red text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-200"
          >
            Continue to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-32 pb-20 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-black text-kfc-black text-center mb-6 uppercase tracking-tight">Become a Member</h2>
          <div className="w-full h-px bg-gray-100 mb-10"></div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Title *</label>
                <select 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-kfc-red/20 focus:border-kfc-red transition-all appearance-none"
                >
                  <option>Mr.</option>
                  <option>Mrs.</option>
                  <option>Ms.</option>
                  <option>Dr.</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">First Name *</label>
                <input 
                  type="text" 
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className={`w-full bg-gray-50 border ${errors.firstName ? 'border-kfc-red' : 'border-gray-100'} rounded-2xl px-6 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-kfc-red/20 focus:border-kfc-red transition-all`}
                />
                {errors.firstName && <p className="text-kfc-red text-[10px] font-bold mt-1 ml-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Last Name *</label>
                <input 
                  type="text" 
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className={`w-full bg-gray-50 border ${errors.lastName ? 'border-kfc-red' : 'border-gray-100'} rounded-2xl px-6 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-kfc-red/20 focus:border-kfc-red transition-all`}
                />
                {errors.lastName && <p className="text-kfc-red text-[10px] font-bold mt-1 ml-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Country *</label>
                <select 
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-kfc-red/20 focus:border-kfc-red transition-all appearance-none"
                >
                  <option>Sri Lanka</option>
                  <option>India</option>
                  <option>United Kingdom</option>
                  <option>USA</option>
                </select>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Code</label>
                  <input 
                    type="text" 
                    value={formData.phoneCode}
                    readOnly
                    className="w-full bg-gray-100 border border-gray-100 rounded-2xl px-4 py-4 font-medium text-gray-400 cursor-not-allowed text-center"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Phone No *</label>
                  <input 
                    type="text" 
                    placeholder="Phone No *"
                    value={formData.phoneNo}
                    onChange={(e) => setFormData({...formData, phoneNo: e.target.value})}
                    className={`w-full bg-gray-50 border ${errors.phoneNo ? 'border-kfc-red' : 'border-gray-100'} rounded-2xl px-6 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-kfc-red/20 focus:border-kfc-red transition-all`}
                  />
                  {errors.phoneNo && <p className="text-kfc-red text-[10px] font-bold mt-1 ml-1">{errors.phoneNo}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Email</label>
                <input 
                  type="email" 
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-kfc-red/20 focus:border-kfc-red transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Password *</label>
                <input 
                  type="password" 
                  placeholder="Password *"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`w-full bg-gray-50 border ${errors.password ? 'border-kfc-red' : 'border-gray-100'} rounded-2xl px-6 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-kfc-red/20 focus:border-kfc-red transition-all`}
                />
                {errors.password && <p className="text-kfc-red text-[10px] font-bold mt-1 ml-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Confirm Password *</label>
                <input 
                  type="password" 
                  placeholder="Confirm Password *"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className={`w-full bg-gray-50 border ${errors.confirmPassword ? 'border-kfc-red' : 'border-gray-100'} rounded-2xl px-6 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-kfc-red/20 focus:border-kfc-red transition-all`}
                />
                {errors.confirmPassword && <p className="text-kfc-red text-[10px] font-bold mt-1 ml-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div 
                  className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${formData.useEmailAsUsername ? 'bg-kfc-red border-kfc-red' : 'border-gray-200 group-hover:border-kfc-red'}`} 
                  onClick={() => setFormData({...formData, useEmailAsUsername: !formData.useEmailAsUsername})}
                >
                  {formData.useEmailAsUsername && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm font-bold text-gray-500">Use email as username</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div 
                  className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${formData.useMobileAsUsername ? 'bg-kfc-red border-kfc-red' : 'border-gray-200 group-hover:border-kfc-red'}`} 
                  onClick={() => setFormData({...formData, useMobileAsUsername: !formData.useMobileAsUsername})}
                >
                  {formData.useMobileAsUsername && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm font-bold text-gray-500">Use mobile number as username</span>
              </label>
            </div>

            {errors.usernameOption && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-kfc-red" />
                <p className="text-xs font-bold text-kfc-red">{errors.usernameOption}</p>
              </div>
            )}

            <div className="pt-6">
              <button 
                type="submit"
                className="w-full bg-kfc-red text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-200"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const Navbar = ({ 
  cartCount, 
  onOpenCart, 
  onOpenMap, 
  onPageChange, 
  currentPage, 
  activeNav,
  setActiveNav,
  onCategoryChange,
  onOpenOrderDetails,
  user,
  onLogout
}: { 
  cartCount: number, 
  onOpenCart: () => void, 
  onOpenMap: () => void, 
  onPageChange: (page: string) => void, 
  currentPage: string, 
  activeNav: string,
  setActiveNav: (nav: string) => void,
  onCategoryChange?: (category: string) => void,
  onOpenOrderDetails: () => void,
  user: string | null,
  onLogout: () => void
}) => {
  const navItems = ['MAINS', 'MEALS & BEVERAGES', 'PROMOTIONS', 'OUR RESTAURANTS'];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Left Side: Stripes, Logo, and Navigation Links */}
          <div className="flex items-center h-full">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => {
              onPageChange('home');
              setActiveNav('MAINS');
              onCategoryChange?.('All');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}>
              <div className="flex gap-1 h-8">
                <div className="w-1.5 h-full bg-kfc-red transform skew-x-[-15deg]"></div>
                <div className="w-1.5 h-full bg-kfc-red transform skew-x-[-15deg]"></div>
                <div className="w-1.5 h-full bg-kfc-red transform skew-x-[-15deg]"></div>
              </div>
              <img 
                src="https://images.seeklogo.com/logo-png/16/2/kfc-logo-png_seeklogo-168461.png" 
                alt="KFC Logo" 
                className="h-12 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Creative Separator */}
            <div className="hidden lg:block w-0.5 h-8 bg-gray-200 transform skew-x-[-15deg] ml-8 mr-6"></div>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-8 h-full">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveNav(item);
                    if (item === 'OUR RESTAURANTS') {
                      onOpenMap();
                    } else if (item === 'PROMOTIONS') {
                      onPageChange('promotions');
                    } else if (item === 'MEALS & BEVERAGES' || item === 'MAINS') {
                      onPageChange('home');
                      if (item === 'MAINS') {
                        // @ts-ignore - we'll handle the prop passing in App
                        onCategoryChange?.('MAINS');
                      } else {
                        // @ts-ignore - we'll handle the prop passing in App
                        onCategoryChange?.('All');
                      }
                      setTimeout(() => {
                        const targetId = item === 'MAINS' ? 'hero' : 'menu';
                        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }
                  }}
                  className={`h-full flex items-center text-sm font-semibold tracking-wide transition-colors relative group ${
                    activeNav === item ? 'text-kfc-red' : 'text-gray-700 hover:text-kfc-red'
                  }`}
                >
                  {item}
                  {activeNav === item && (
                    <motion.div 
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-kfc-red rounded-t-md"
                    />
                  )}
                  {/* Subtle hover underline */}
                  {activeNav !== item && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-t-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Right Side: Order Button, Auth, and Cart */}
          <div className="flex items-center justify-end gap-3 sm:gap-4">
            <button 
              onClick={onOpenOrderDetails}
              className="hidden xl:flex items-center bg-gray-100 text-gray-800 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              Let's Start Your Order Now
            </button>
            
            <div className="hidden sm:flex items-center gap-4 text-sm font-bold xl:ml-2">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-kfc-red">Hi, {user}</span>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <button 
                    onClick={onLogout}
                    className="text-gray-700 hover:text-kfc-red transition-colors whitespace-nowrap"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => onPageChange('auth')}
                    className="text-gray-700 hover:text-kfc-red transition-colors whitespace-nowrap"
                  >
                    Sign in
                  </button>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <button 
                    onClick={() => onPageChange('register')}
                    className="text-gray-700 hover:text-kfc-red transition-colors whitespace-nowrap"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
            
            <button 
              onClick={onOpenCart}
              className="relative flex items-center justify-center bg-kfc-red text-white p-3 rounded-full hover:bg-red-700 transition-colors shadow-md sm:ml-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-white text-kfc-red text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-kfc-red">
                {cartCount}
              </span>
            </button>
            
            <button className="lg:hidden p-2 text-gray-700">
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

const Hero = ({ onOpenAddressModal, onOpenPickupModal, selectedAddress }: { 
  onOpenAddressModal: () => void, 
  onOpenPickupModal: () => void,
  selectedAddress: string | null 
}) => {
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');

  const handleAction = () => {
    if (orderType === 'delivery') {
      onOpenAddressModal();
    } else {
      onOpenPickupModal();
    }
  };

  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-white min-h-[90vh] flex flex-col justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none flex">
        <div className="w-full lg:w-1/2 bg-white"></div>
        <div className="hidden lg:block w-1/2 bg-kfc-red relative overflow-hidden">
          {/* Vertical white stripes on the right */}
          <div className="absolute top-0 right-0 w-full h-full flex justify-end opacity-20 transform skew-x-12 translate-x-20">
            <div className="w-20 h-full bg-white mx-3"></div>
            <div className="w-20 h-full bg-white mx-3"></div>
            <div className="w-20 h-full bg-white mx-3"></div>
          </div>
        </div>
      </div>

      {/* Creative Blurred Image Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-10 mix-blend-multiply">
        <img 
          src="https://www.hatchwise.com/wp-content/uploads/2024/05/image-25.png" 
          alt="Background Pattern" 
          className="w-full h-full object-cover blur-sm scale-110"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Side: Logo and Tagline */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <img 
              src="https://images.seeklogo.com/logo-png/40/1/kfc-kentucky-fried-chicken-black-logo-png_seeklogo-401809.png" 
              alt="KFC Logo" 
              className="h-32 sm:h-48 w-auto object-contain mb-8 drop-shadow-xl"
              referrerPolicy="no-referrer"
            />
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-kfc-black uppercase tracking-tighter leading-none mb-4">
              It's Finger <br className="hidden lg:block" />
              <span className="text-kfc-red">Lickin' Good</span>
            </h1>
            <p className="text-lg text-gray-600 font-medium max-w-md mt-4">
              Freshly prepared, hand-breaded chicken, burgers, and sides. Order now for delivery or pickup.
            </p>
          </motion.div>

          {/* Right Side: Food Imagery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative w-full max-w-2xl mx-auto lg:mt-0"
          >
            {/* Mobile Red Background since split is hidden on mobile */}
            <div className="absolute inset-0 bg-kfc-red rounded-full blur-3xl opacity-10 lg:hidden"></div>
            
            <img 
              src="https://resizer.ladbiblegroup.com/unsafe/rs:fit:3840:0:0:0/g:sm/q:70/aHR0cHM6Ly9ldS1pbWFnZXMuY29udGVudHN0YWNrLmNvbS92My9hc3NldHMvYmx0NDMxMzVjMWYwNjAxNzhkYS9ibHQxNjEzMmNjMTNjMDkyNThmLzY4NzhiNTdjNGM0YTVhNjg2NTVmZjNlMC9LRkMucG5nP2Nyb3A9MTg5NiwxMDY3LHgxMix5MA.webp" 
              alt="KFC Feast" 
              className="w-full h-auto object-cover rounded-[2rem] shadow-2xl relative z-10 border-8 border-white lg:border-none lg:bg-transparent lg:shadow-none lg:drop-shadow-2xl"
              referrerPolicy="no-referrer"
            />

            {/* Floating Extra Image */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 30, rotate: -15 }}
              animate={{ opacity: 1, x: 0, y: [0, -15, 0], rotate: -15 }}
              transition={{ 
                opacity: { duration: 0.8, delay: 0.6 },
                x: { duration: 0.8, delay: 0.6, type: "spring" },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.4 },
                rotate: { duration: 0.8, delay: 0.6 }
              }}
              className="absolute -bottom-10 -left-4 sm:-left-12 z-20"
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMF8JA_wEyJZzDTKAeoCxxMCg0XsucTQzRTQ&s"
                alt="KFC Special"
                className="w-32 sm:w-48 h-32 sm:h-48 object-cover rounded-full border-4 sm:border-8 border-white shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Second Floating Extra Image */}
            <motion.div
              initial={{ opacity: 0, x: 30, y: -30, rotate: 10 }}
              animate={{ opacity: 1, x: 0, y: [0, 15, 0], rotate: 10 }}
              transition={{ 
                opacity: { duration: 0.8, delay: 0.8 },
                x: { duration: 0.8, delay: 0.8, type: "spring" },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.6 },
                rotate: { duration: 0.8, delay: 0.8 }
              }}
              className="absolute -top-8 -right-4 sm:-right-8 z-20"
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSomPfkhk4bHyTaUjbUahlJIff7WvRdOnWOBg&s"
                alt="KFC Burger"
                className="w-28 sm:w-40 h-28 sm:h-40 object-cover rounded-full border-4 sm:border-8 border-white shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Order Card at Bottom Center */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-4xl mx-auto mt-16 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-4 sm:p-6 relative z-20 border border-gray-100"
        >
          {/* Toggle Buttons */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-4 max-w-sm mx-auto">
            <button 
              onClick={() => setOrderType('delivery')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm sm:text-base transition-all ${orderType === 'delivery' ? 'bg-white text-kfc-red shadow-md' : 'text-gray-500 hover:text-kfc-black'}`}
            >
              <Bike className="w-5 h-5" />
              Delivery
            </button>
            <button 
              onClick={() => {
                setOrderType('pickup');
                onOpenPickupModal();
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm sm:text-base transition-all ${orderType === 'pickup' ? 'bg-white text-kfc-red shadow-md' : 'text-gray-500 hover:text-kfc-black'}`}
            >
              <Store className="w-5 h-5" />
              Pickup
            </button>
          </div>

          {/* Input and Search Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                value={selectedAddress || ''}
                readOnly
                onClick={handleAction}
                placeholder={orderType === 'delivery' ? "Enter your delivery location" : "Enter your pickup location"}
                className="w-full bg-gray-50 border border-gray-200 text-kfc-black rounded-xl py-4 pl-12 pr-4 font-medium focus:outline-none focus:ring-2 focus:ring-kfc-red/50 focus:border-kfc-red transition-all cursor-pointer"
              />
            </div>
            <button 
              onClick={() => {
                if (selectedAddress) {
                  document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleAction();
                }
              }}
              className="bg-kfc-red text-white px-10 py-4 rounded-xl font-black uppercase tracking-wider hover:bg-red-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const MenuSection = ({ 
  onAddToCart, 
  cartItems, 
  onUpdateQuantity,
  activeCategory,
  setActiveCategory
}: { 
  onAddToCart: (item: MenuItem) => void, 
  cartItems: { item: MenuItem, quantity: number }[], 
  onUpdateQuantity: (id: string, delta: number) => void,
  activeCategory: string,
  setActiveCategory: (category: string) => void
}) => {
  const filteredItems = activeCategory === "All" 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="py-24 bg-kfc-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-5xl font-black mb-4">Explore Our Menu</h2>
            <div className="w-24 h-2 bg-kfc-red"></div>
          </div>
          
          <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar w-full md:w-auto">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                  activeCategory === category 
                    ? "bg-kfc-red text-white shadow-lg shadow-red-500/20" 
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-black/5"
              >
                <div className="relative h-48 overflow-hidden bg-white p-6">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                    {item.calories} kcal
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{item.name}</h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 h-10">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-kfc-red">Rs. {item.price.toLocaleString()}</span>
                    {cartItems.some(cartItem => cartItem.item.id === item.id) ? (
                      <div className="flex items-center gap-3 bg-gray-100 rounded-2xl p-1">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-2 bg-white rounded-xl hover:bg-gray-50 shadow-sm"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-sm w-4 text-center">
                          {cartItems.find(cartItem => cartItem.item.id === item.id)?.quantity}
                        </span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-2 bg-white rounded-xl hover:bg-gray-50 shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => onAddToCart(item)}
                        className="bg-kfc-black text-white p-3 rounded-2xl hover:bg-kfc-red transition-colors shadow-lg flex items-center justify-center"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity,
  onCheckout
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  cartItems: { item: MenuItem, quantity: number }[],
  onUpdateQuantity: (id: string, delta: number) => void,
  onCheckout: () => void
}) => {
  const total = cartItems.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase">Your Bucket</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">Your bucket is empty.</p>
                  <div className="flex flex-col gap-3 mt-6 w-full">
                    <button 
                      onClick={onClose}
                      className="text-kfc-red font-bold uppercase text-sm hover:underline"
                    >
                      Start Ordering
                    </button>
                    <button 
                      onClick={() => {
                        onClose();
                        onCheckout();
                      }}
                      className="bg-gray-100 text-gray-600 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-gray-200 transition-all"
                    >
                      Go to Checkout
                    </button>
                  </div>
                </div>
              ) : (
                cartItems.map(({ item, quantity }) => (
                  <div key={item.id} className="flex gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-2xl flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">{item.name}</h4>
                      <p className="text-kfc-red font-black mb-3">Rs. {(item.price * quantity).toLocaleString()}</p>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 border rounded-lg hover:bg-gray-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-sm w-4 text-center">{quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 border rounded-lg hover:bg-gray-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-bold uppercase text-sm">Total</span>
                  <span className="text-3xl font-black text-kfc-red">Rs. {total.toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => {
                    onClose();
                    onCheckout();
                  }}
                  className="w-full bg-kfc-red text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-500/20"
                >
                  Checkout Now
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [trackingStatus, setTrackingStatus] = useState<'idle' | 'loading' | 'found' | 'error'>('idle');

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    setTrackingStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      if (orderId.length > 4) {
        setTrackingStatus('found');
      } else {
        setTrackingStatus('error');
      }
    }, 1500);
  };

  return (
    <section id="tracking" className="py-24 bg-kfc-gray">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 text-center">
            <h2 className="text-4xl font-black mb-4">Track Your Order</h2>
            <p className="text-gray-500 mb-8 max-w-lg mx-auto">
              Enter your order ID below to get real-time updates on your delicious KFC meal.
            </p>
            
            <form onSubmit={handleTrackOrder} className="max-w-md mx-auto relative">
              <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. KFC-123456" 
                  className="w-full bg-gray-50 border border-gray-200 text-kfc-black rounded-xl py-4 pl-12 pr-32 font-medium focus:outline-none focus:ring-2 focus:ring-kfc-red/50 focus:border-kfc-red transition-all"
                />
                <button 
                  type="submit"
                  disabled={trackingStatus === 'loading'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-kfc-red text-white px-6 py-2 rounded-lg font-bold uppercase tracking-wider hover:bg-red-700 transition-all disabled:opacity-70"
                >
                  {trackingStatus === 'loading' ? '...' : 'Track'}
                </button>
              </div>
            </form>

            <AnimatePresence mode="wait">
              {trackingStatus === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-8 p-4 bg-red-50 text-kfc-red rounded-xl flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Order not found. Please check your ID and try again.</span>
                </motion.div>
              )}

              {trackingStatus === 'found' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-12 text-left"
                >
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute left-8 top-8 bottom-8 w-1 bg-gray-100 rounded-full md:left-1/2 md:-ml-0.5 md:top-12 md:bottom-12 md:w-full md:h-1 md:bg-gray-100"></div>
                    <div className="absolute left-8 top-8 h-1/2 w-1 bg-kfc-red rounded-full md:left-1/2 md:-ml-0.5 md:top-12 md:w-1/2 md:h-1 md:bg-kfc-red transition-all duration-1000"></div>

                    <div className="space-y-8 md:space-y-0 md:flex md:justify-between relative z-10">
                      {/* Step 1 */}
                      <div className="flex md:flex-col items-center gap-4 md:gap-2">
                        <div className="w-16 h-16 rounded-full bg-kfc-red text-white flex items-center justify-center shadow-lg shadow-red-500/30 flex-shrink-0">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div className="md:text-center">
                          <h4 className="font-bold text-lg">Order Placed</h4>
                          <p className="text-sm text-gray-500">10:42 AM</p>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="flex md:flex-col items-center gap-4 md:gap-2">
                        <div className="w-16 h-16 rounded-full bg-kfc-red text-white flex items-center justify-center shadow-lg shadow-red-500/30 flex-shrink-0">
                          <Store className="w-8 h-8" />
                        </div>
                        <div className="md:text-center">
                          <h4 className="font-bold text-lg">Preparing</h4>
                          <p className="text-sm text-gray-500">10:45 AM</p>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="flex md:flex-col items-center gap-4 md:gap-2">
                        <div className="w-16 h-16 rounded-full bg-white border-4 border-kfc-red text-kfc-red flex items-center justify-center shadow-lg flex-shrink-0 relative">
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-kfc-red rounded-full animate-ping"></span>
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-kfc-red rounded-full"></span>
                          <Truck className="w-7 h-7" />
                        </div>
                        <div className="md:text-center">
                          <h4 className="font-bold text-lg">On the Way</h4>
                          <p className="text-sm text-kfc-red font-medium">Arriving in 15 mins</p>
                        </div>
                      </div>

                      {/* Step 4 */}
                      <div className="flex md:flex-col items-center gap-4 md:gap-2">
                        <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 border-4 border-white flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-7 h-7" />
                        </div>
                        <div className="md:text-center">
                          <h4 className="font-bold text-lg text-gray-400">Delivered</h4>
                          <p className="text-sm text-gray-400">Pending</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ onPageChange }: { onPageChange: (page: string) => void }) => {
  return (
    <footer className="bg-[#0a0a0a] text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <img 
                src="https://images.seeklogo.com/logo-png/40/1/kfc-kentucky-fried-chicken-black-logo-png_seeklogo-401809.png" 
                alt="KFC Logo" 
                className="h-12 w-auto invert"
              />
              <div className="flex gap-0.5">
                <div className="w-1.5 h-6 bg-kfc-red transform skew-x-[-15deg]"></div>
                <div className="w-1.5 h-6 bg-kfc-red transform skew-x-[-15deg]"></div>
                <div className="w-1.5 h-6 bg-kfc-red transform skew-x-[-15deg]"></div>
              </div>
            </div>
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">About</h4>
            <ul className="space-y-4 text-white text-sm font-medium">
              <li><button onClick={() => { onPageChange('about'); window.scrollTo(0,0); }} className="hover:text-kfc-red transition-colors">Our Story</button></li>
              <li><button onClick={() => { onPageChange('contact'); window.scrollTo(0,0); }} className="hover:text-kfc-red transition-colors">Contact Us</button></li>
              <li><button onClick={() => { onPageChange('feedback'); window.scrollTo(0,0); }} className="hover:text-kfc-red transition-colors">Feedback</button></li>
            </ul>
          </div>
          
          {/* Column 2: Order Now */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8">Order Now</h4>
            <ul className="space-y-4 text-white text-sm font-medium">
              <li><button onClick={() => { onPageChange('home'); setTimeout(() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-kfc-red transition-colors">Mains</button></li>
              <li><button onClick={() => { onPageChange('home'); setTimeout(() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-kfc-red transition-colors">Meals & Beverages</button></li>
              <li><button onClick={() => { onPageChange('promotions'); window.scrollTo(0,0); }} className="hover:text-kfc-red transition-colors">Promotions</button></li>
            </ul>
          </div>
          
          {/* Column 3: Policy */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8">Policy</h4>
            <ul className="space-y-4 text-white text-sm font-medium">
              <li><button onClick={() => { onPageChange('terms'); window.scrollTo(0,0); }} className="hover:text-kfc-red transition-colors">Terms & Conditions</button></li>
              <li><button onClick={() => { onPageChange('privacy'); window.scrollTo(0,0); }} className="hover:text-kfc-red transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => { onPageChange('terms'); setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100); }} className="hover:text-kfc-red transition-colors">WhatsApp Broadcast Terms And Conditions</button></li>
            </ul>
          </div>
          
          {/* Column 4: My Account */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-8">My Account</h4>
            <ul className="space-y-4 text-white text-sm font-medium mb-8">
              <li><button onClick={() => { onPageChange('auth'); window.scrollTo(0,0); }} className="hover:text-kfc-red transition-colors">Sign In</button></li>
              <li><button onClick={() => { onPageChange('register'); window.scrollTo(0,0); }} className="hover:text-kfc-red transition-colors">Register</button></li>
              <li><button onClick={() => { onPageChange('order-history'); window.scrollTo(0,0); }} className="hover:text-kfc-red transition-colors">Order History</button></li>
              <li><button onClick={() => { onPageChange('home'); setTimeout(() => document.getElementById('tracking')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="hover:text-kfc-red transition-colors">Track Order</button></li>
            </ul>
            
            {/* Social Media Icons */}
            <div className="flex gap-3">
              <a href="https://twitter.com/kfcsrilanka" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-kfc-red rounded-full flex items-center justify-center hover:bg-white hover:text-kfc-red transition-all shadow-lg">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/kfcsrilanka/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-kfc-red rounded-full flex items-center justify-center hover:bg-white hover:text-kfc-red transition-all shadow-lg">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/KFCSriLanka/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-kfc-red rounded-full flex items-center justify-center hover:bg-white hover:text-kfc-red transition-all shadow-lg">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@kfcsrilanka" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-kfc-red rounded-full flex items-center justify-center hover:bg-white hover:text-kfc-red transition-all shadow-lg">
                <Music className="w-5 h-5" /> {/* TikTok Placeholder */}
              </a>
              <a href="https://www.youtube.com/channel/UC-T-v_190tW3L7D54Wz7r7Q" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-kfc-red rounded-full flex items-center justify-center hover:bg-white hover:text-kfc-red transition-all shadow-lg">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-12 border-t border-white/5 text-center">
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
            © 2026 KFC Digital Experience. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const AboutPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24 bg-white min-h-screen"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tighter mb-4">About Us</h1>
          <div className="w-24 h-2 bg-kfc-red mx-auto rounded-full"></div>
        </div>

        {/* Locally Sourced Chicken Highlight */}
        <div className="bg-red-50 border-l-8 border-kfc-red p-8 mb-16 rounded-r-3xl shadow-sm">
          <p className="text-xl md:text-2xl font-bold text-kfc-red italic leading-relaxed">
            "We are proud to serve 100% locally sourced chicken, supporting our Sri Lankan farmers and ensuring the freshest quality in every bite."
          </p>
        </div>

        {/* Main Headline */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none mb-4">
            Hand-Breaded, Freshly Prepared & <span className="text-kfc-red">Finger Lickin’ Good!</span>
          </h2>
          <p className="text-2xl font-bold text-kfc-red uppercase tracking-widest">A Taste You Can Trust!</p>
        </div>

        {/* Content Paragraphs */}
        <div className="space-y-8 text-gray-700 text-lg leading-relaxed font-medium">
          <p>
            The story of KFC began with one man's dream and a secret recipe of 11 herbs and spices. Colonel Harland Sanders perfected his unique pressure-frying method in 1939, creating a flavor that would soon conquer the world. Today, his legacy lives on in every piece of chicken we serve, prepared with the same dedication to quality and taste that he pioneered over 80 years ago.
          </p>

          <p>
            KFC made its grand entry into Sri Lanka in 1995, bringing the world-famous "Finger Lickin' Good" experience to the island. Since then, we have grown into a beloved household name, with restaurants spanning across the country, from the bustling streets of Colombo to the historic city of Kandy and beyond. Our expansion is a testament to the trust and love our Sri Lankan customers have shown us over the decades.
          </p>

          <p>
            What makes KFC truly special is our commitment to freshness. Unlike others, our chicken is hand-breaded and freshly prepared in-store by our trained cooks throughout the day. This ensures that every piece is crispy on the outside and juicy on the inside, delivering that signature crunch that our fans crave.
          </p>

          <p>
            While we stay true to the Colonel's original recipe, we also embrace the rich culinary heritage of Sri Lanka. Our local menu adaptations, such as the spicy KFC Briyani and the fiery Hot Drumlets, are specially crafted to suit the vibrant palates of our local fans. We believe in offering a menu that feels both global and local.
          </p>

          <p>
            At the heart of our operations is a deep-rooted commitment to the community. We work closely with local poultry farmers, sourcing our chicken from trusted local suppliers. This not only guarantees the highest standards of food safety and quality but also contributes to the growth of the local agricultural sector, empowering Sri Lankan farmers and their families.
          </p>
        </div>

        {/* Accents/Decorative Elements */}
        <div className="mt-20 flex justify-center gap-4">
          <div className="w-4 h-12 bg-kfc-red transform skew-x-[-15deg]"></div>
          <div className="w-4 h-12 bg-orange-500 transform skew-x-[-15deg]"></div>
          <div className="w-4 h-12 bg-kfc-red transform skew-x-[-15deg]"></div>
        </div>
      </div>
    </motion.div>
  );
};

const ContactUsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24 bg-white min-h-screen"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Contact Us</h1>
          <div className="w-24 h-2 bg-kfc-red mx-auto rounded-full mb-8"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Delivery Hotline */}
          <div className="bg-red-50 p-10 rounded-3xl border-2 border-kfc-red text-center transform transition-transform hover:-translate-y-2 shadow-lg">
            <div className="w-16 h-16 bg-kfc-red rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-2">Delivery Hotline</h2>
            <p className="text-3xl font-black text-kfc-red tracking-wider">
              <a href="tel:+94115532532" className="hover:underline">+94 115 532 532</a>
            </p>
          </div>

          {/* Corporate Head Office */}
          <div className="bg-white p-10 rounded-3xl border border-gray-100 text-center transform transition-transform hover:-translate-y-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(228,0,43,0.1)]">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-4">Corporate Head Office</h2>
            <div className="text-gray-600 font-medium space-y-1 mb-6">
              <p>No. 40, York Street,</p>
              <p>Colombo 01</p>
              <p>Sri Lanka</p>
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold text-gray-900">
                <a href="tel:+94112427777" className="hover:text-kfc-red transition-colors">+94 112 427 777</a>
              </p>
              <p className="text-xl font-bold text-gray-900">
                <a href="tel:+94112427500" className="hover:text-kfc-red transition-colors">+94 112 427 500</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const OrderHistoryPage: React.FC<{ orders: { orderId: string, items: { item: MenuItem, quantity: number }[], total: number, date: string }[] }> = ({ orders }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24 bg-gray-50 min-h-screen"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Order History</h1>
          <div className="w-24 h-2 bg-kfc-red mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 font-medium">View your past orders and reorder your favorites.</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-4">No Orders Yet</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Once you order some delicious KFC, your history will appear here.
            </p>
            <button 
              onClick={() => { window.location.href = '/'; }}
              className="bg-kfc-red text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-200 hover:shadow-red-300 transform hover:-translate-y-1"
            >
              Start Ordering
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div key={index} className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Order #{order.orderId}</p>
                    <p className="text-gray-900 font-bold">{new Date(order.date).toLocaleString()}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold">
                    Completed
                  </div>
                </div>
                <div className="space-y-4 mb-6">
                  {order.items.map((cartItem, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={cartItem.item.image} alt={cartItem.item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{cartItem.item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {cartItem.quantity}</p>
                        </div>
                      </div>
                      <p className="font-bold text-gray-900">Rs {cartItem.item.price * cartItem.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <p className="text-gray-500 font-medium">Total Amount</p>
                  <p className="text-2xl font-black text-kfc-red">Rs {order.total}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    inquiryType: '',
    title: 'mr',
    firstName: '',
    lastName: '',
    country: 'LK',
    phone: '',
    email: '',
    confirmEmail: '',
    invoiceNumber: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.inquiryType) newErrors.inquiryType = 'Inquiry type is required';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (formData.email !== formData.confirmEmail) newErrors.confirmEmail = 'Emails do not match';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Simulate API call
    console.log('Feedback submitted:', formData);
    setIsSubmitted(true);
    setFormData({
      inquiryType: '',
      title: 'mr',
      firstName: '',
      lastName: '',
      country: 'LK',
      phone: '',
      email: '',
      confirmEmail: '',
      invoiceNumber: '',
      message: ''
    });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24 bg-white min-h-screen"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Feedback</h1>
          <div className="w-24 h-2 bg-kfc-red mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 font-medium">We'd love to hear from you! Please fill out the form below.</p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 relative overflow-hidden">
          <AnimatePresence>
            {isSubmitted && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-0 left-0 right-0 bg-green-500 text-white p-4 text-center font-bold z-10"
              >
                Thank you for your feedback! We will get back to you soon.
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className={`space-y-6 ${isSubmitted ? 'mt-8' : ''}`}>
            {/* Inquiry Type */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Inquiry Type *</label>
              <select 
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${errors.inquiryType ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-kfc-red'} focus:ring-2 outline-none transition-all bg-gray-50 text-gray-900 font-medium appearance-none`}
              >
                <option value="">Select Inquiry Type</option>
                <option value="complaint">Complaint</option>
                <option value="compliment">Compliment</option>
                <option value="suggestion">Suggestion</option>
                <option value="inquiry">General Inquiry</option>
              </select>
              {errors.inquiryType && <p className="text-red-500 text-xs mt-1 font-medium">{errors.inquiryType}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Title */}
              <div className="md:col-span-3">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Title *</label>
                <select 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-kfc-red focus:border-kfc-red outline-none transition-all bg-gray-50 text-gray-900 font-medium appearance-none"
                >
                  <option value="mr">Mr.</option>
                  <option value="mrs">Mrs.</option>
                  <option value="ms">Ms.</option>
                  <option value="dr">Dr.</option>
                  <option value="rev">Rev.</option>
                </select>
              </div>

              {/* First Name */}
              <div className="md:col-span-4">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">First Name *</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-kfc-red'} focus:ring-2 outline-none transition-all bg-gray-50 text-gray-900 font-medium`}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div className="md:col-span-5">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Last Name *</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-kfc-red'} focus:ring-2 outline-none transition-all bg-gray-50 text-gray-900 font-medium`}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Country */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Country *</label>
                <select 
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-kfc-red focus:border-kfc-red outline-none transition-all bg-gray-50 text-gray-900 font-medium appearance-none"
                >
                  <option value="LK">Sri Lanka</option>
                  {/* Add more countries if needed */}
                </select>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Phone Number *</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value="+94"
                    readOnly
                    className="w-20 px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-600 font-bold text-center outline-none"
                  />
                  <div className="flex-1">
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="7X XXX XXXX"
                      className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-kfc-red'} focus:ring-2 outline-none transition-all bg-gray-50 text-gray-900 font-medium`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-kfc-red'} focus:ring-2 outline-none transition-all bg-gray-50 text-gray-900 font-medium`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
              </div>

              {/* Re-enter Email */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Re-enter Email *</label>
                <input 
                  type="email" 
                  name="confirmEmail"
                  value={formData.confirmEmail}
                  onChange={handleChange}
                  placeholder="Confirm Email"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.confirmEmail ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-kfc-red'} focus:ring-2 outline-none transition-all bg-gray-50 text-gray-900 font-medium`}
                />
                {errors.confirmEmail && <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmEmail}</p>}
              </div>
            </div>

            {/* Invoice Number */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Invoice Number (Optional)</label>
              <input 
                type="text" 
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                placeholder="e.g. INV-123456"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-kfc-red focus:border-kfc-red outline-none transition-all bg-gray-50 text-gray-900 font-medium"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Message *</label>
              <textarea 
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your feedback here..."
                className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-kfc-red'} focus:ring-2 outline-none transition-all bg-gray-50 text-gray-900 font-medium resize-none`}
              ></textarea>
              {errors.message && <p className="text-red-500 text-xs mt-1 font-medium">{errors.message}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit"
                className="w-full bg-kfc-red text-white py-4 rounded-xl font-black uppercase tracking-widest text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-200 hover:shadow-red-300 transform hover:-translate-y-1"
              >
                Send Feedback
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

const PrivacyPolicyPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24 bg-white min-h-screen"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Privacy Policy</h1>
          <div className="w-24 h-2 bg-kfc-red mx-auto rounded-full mb-8"></div>
          <h3 className="text-2xl font-bold text-kfc-red mb-6">Welcome to KFC Srilanka Online!</h3>
          <div className="text-lg text-gray-600 font-medium space-y-4 text-left bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <p>Cargills Food Processors (Private) Limited ('Cargills') owns and operates the website and the mobile application. We at Cargills, respect your privacy and values the trust you place in it. We strongly believe in transparency and are committed towards being upfront about our privacy practices while improving your shopping experience.</p>
            <p>Mentioned herein under is our Privacy Policy which details the manner in which information relating to you is collected, used and/or disclosed. The Privacy Policy further explains your rights/options regarding the collection, use and disclosure of your personal information.</p>
            <p>We shall only collect such information which is required and shall only use your personal information as clearly stated in this policy as your privacy is of utmost importance to us.</p>
            <p>By accessing, downloading or using our website or mobile application you agree to be bound by our Privacy Policy. Do not use our Website, the mobile application and/or related online services if you disagree with our Privacy Policy.</p>
            <p>You may visit the website/mobile application and browse without providing any personal information unless otherwise you choose to create an account by entering requested information with an intention to transact with our ecommerce platform.</p>
            <p>The Privacy Policy is subject to change from time to time without prior notice, therefore it is strongly recommended that you periodically review the Privacy Policy posted on the website/ mobile application.</p>
            <p className="font-bold text-kfc-black">Should you have any clarifications with regard to the Privacy Policy, please do not hesitate to contact us at <a href="tel:0112427777" className="text-kfc-red hover:underline">0112427777</a></p>
          </div>
        </div>

        <div className="space-y-12 text-gray-700">
          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 hover:shadow-[0_8px_30px_rgb(228,0,43,0.1)] transition-shadow">
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-kfc-red transform skew-x-[-15deg]"></div>
              What information do we collect?
            </h2>
            <p className="mb-4">We may collect personal information including but not limited to the following about you, however not all information will be collected about every individual.</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-kfc-red mt-2 flex-shrink-0"></div><span>Personal identifiers such as name and address (location/postal code)</span></li>
              <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-kfc-red mt-2 flex-shrink-0"></div><span>Online identifiers such as mobile number and email address</span></li>
              <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-kfc-red mt-2 flex-shrink-0"></div><span>Government identifiers such as National ID card number or driver's license</span></li>
              <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-kfc-red mt-2 flex-shrink-0"></div><span>Demographic information such as age and date of birth</span></li>
              <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-kfc-red mt-2 flex-shrink-0"></div><span>Internet, application and network activity such as cookie IDs and browser visits</span></li>
              <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-kfc-red mt-2 flex-shrink-0"></div><span>Purchase history, products bought in the past</span></li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 hover:shadow-[0_8px_30px_rgb(228,0,43,0.1)] transition-shadow">
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-kfc-red transform skew-x-[-15deg]"></div>
              How do we collect the Information?
            </h2>
            <div className="space-y-4">
              <p><strong className="text-kfc-black">Information you disclose:</strong> We may collect information if you wish to create an account with us or when you modify your account with us, through surveys and opinion polls.</p>
              <p><strong className="text-kfc-black">Automatic Information:</strong> We automatically collect and store certain types of information about your use of our ecommerce services, including information about your interaction with content and services. Like many websites, we use "cookies" and other unique identifiers, and we obtain certain types of information when your web browser or device accesses our services.</p>
              <div className="bg-red-50 p-4 rounded-xl border-l-4 border-kfc-red text-sm font-medium text-kfc-red">
                We are not responsible for privacy practices of the websites which is not owned, managed or controlled by us.
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 hover:shadow-[0_8px_30px_rgb(228,0,43,0.1)] transition-shadow">
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-kfc-red transform skew-x-[-15deg]"></div>
              How do we use the Information?
            </h2>
            <div className="space-y-4">
              <p>We will use your information to process your request orders and to provide you with the services and information offered through our website/ mobile application. We will use the same information to administer your account with us; verify and facilitate financial transactions, complete the selected payments you make; improve/customize the layout and/or content of the pages of our website; identify inbound visitors on our website; facilitate research on our users'; send the information which you have requested and we think that may find useful for you, including information about our products, services and promotions, provided you have indicated that you have not objected to being contacted for these purposes. If you prefer not to receive any direct marketing communications from us, you can opt out at any time.</p>
              <p>We may use your information for opinion and market research. Your details will be anonymized and will only be used for statistical purposes.</p>
              <p className="text-sm text-gray-500 italic">
                * If you would prefer not to receive any of this additional information, please click the 'unsubscribe' link in any email that we send to you. Within 7 working days (days which are neither (i) a Sunday, nor (ii) a public holiday anywhere in Sri Lanka) of receipt of your instruction we will cease to send you information as requested. If your instruction is not clear, we will contact you for clarification.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 hover:shadow-[0_8px_30px_rgb(228,0,43,0.1)] transition-shadow">
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-kfc-red transform skew-x-[-15deg]"></div>
              How we share your information?
            </h2>
            <div className="space-y-4">
              <p>We shall share your information in order to comply with the legal obligations.</p>
              <p>We may share your information within our company and our subsidiaries and affiliated companies for the purposes of decision making, reporting, management, analysis, administer programs, promote service offerings and other business purposes. We may send you information related to the Cargills, KFC or related to our other websites, products, sales promotions, newsletters, anything relating to other companies in our group or our business partners.</p>
              <p>We may share your name and address on to a third-party delivery agent in order to complete the delivery of the purchased product. In order to facilitate this function, you shall maintain the updated / accurate information at all times.</p>
              <p>We may exchange information with third parties for the purposes of providing a superior delivery service, fraud protection and credit risk reduction. We may transfer our databases containing your personal information if we sell our business or part of it. Other than as set out in this Privacy Policy, we shall NOT sell or disclose your personal data to third parties without obtaining your prior consent unless this is necessary for the purposes set out in this Privacy Policy or unless we are required to do so by law. The website/ mobile application may contain advertising of third parties and links to other sites or frames of other sites. Please be aware that we are not responsible for the privacy practices or content of those third parties or other sites, nor for any third party to whom we transfer your data in accordance with our Privacy Policy.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 hover:shadow-[0_8px_30px_rgb(228,0,43,0.1)] transition-shadow">
              <h2 className="text-2xl font-black uppercase text-kfc-black mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-kfc-red transform skew-x-[-15deg]"></div>
                How to access your Data?
              </h2>
              <p>You may access and change your data including your personal data, purchase history by logging to the website/mobile application. There you can view the details of your orders that have been completed, those which are open and those which are shortly to be dispatched. You shall undertake to treat the personal access data confidentially and not make it available to unauthorized third parties. We cannot assume any liability for misuse of passwords unless this misuse is caused due to our internal fault.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 hover:shadow-[0_8px_30px_rgb(228,0,43,0.1)] transition-shadow">
              <h2 className="text-2xl font-black uppercase text-kfc-black mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-kfc-red transform skew-x-[-15deg]"></div>
                Cookies
              </h2>
              <div className="space-y-4">
                <p>The acceptance of cookies is not a requirement for visiting the website/mobile application.</p>
                <p>Cookies can be used to recognize your Internet Protocol address, saving you time while you are on, or want to enter, the Site. We only use cookies for your convenience in using the Site (for example to remember who you are when you want to amend your shopping cart without having to re-enter your email address). Your browser can be set to not accept cookies, but this would restrict your use of the website/ mobile application. Please accept our assurance that our use of cookies does not contain any personal or private details and are free from viruses.</p>
                <p>Please visit <a href="http://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-kfc-red hover:underline font-bold">http://www.allaboutcookies.org</a>, if you wish to obtain more information about cookies.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 hover:shadow-[0_8px_30px_rgb(228,0,43,0.1)] transition-shadow">
              <h2 className="text-2xl font-black uppercase text-kfc-black mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-kfc-red transform skew-x-[-15deg]"></div>
                Security measures
              </h2>
              <p>We have established appropriate firewalls and other security control measures to prevent unauthorized or unlawful access to or accidental loss of or destruction or damage to your information We will update our systems, controls and operating procedures to offer you the maximum possible security controls in our Site. However, you shall be responsible to create and maintain a suitable password to the Site.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 hover:shadow-[0_8px_30px_rgb(228,0,43,0.1)] transition-shadow">
              <h2 className="text-2xl font-black uppercase text-kfc-black mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-kfc-red transform skew-x-[-15deg]"></div>
                What are your rights?
              </h2>
              <p>If you are concerned about your data, you have the right to request access to the personal data which we may hold or process about you. You have the right to require us to correct any inaccuracies in your data anytime without any cost. Also, you have the right to ask us to refrain using your personal data for direct marketing purposes.</p>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

const TermsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-24 bg-white min-h-screen"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">GENERAL TERMS & CONDITIONS</h1>
          <div className="w-24 h-2 bg-kfc-red mx-auto rounded-full mb-8"></div>
          <p className="text-lg text-gray-600 font-medium">
            Welcome to KFC eCommerce Website! These terms and conditions govern the usage of our eCommerce website and the mobile app. If you wish to create an account with us to use our eCommerce platforms and delivery services, you are required to agree with our terms and conditions.
          </p>
        </div>

        <div className="space-y-12 text-gray-700">
          <section>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-4 flex items-center gap-3">
              <span className="bg-kfc-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Acceptance of Terms and Conditions
            </h2>
            <div className="pl-11 space-y-4">
              <p>It is the responsibility of all users to read and understand the terms and conditions outlined hereunder, we therefore kindly request all users to carefully read this agreement as the use of services provided by our Company represents full consent of provisions of this agreement.</p>
              <p>By accessing, downloading or using our website or mobile application you agree to be bound by these terms of use and all terms incorporated by reference. Please do not use our website, the mobile application and/or related online services if you disagree with any of these terms and conditions.</p>
              <p>These terms and conditions (hereinafter referred to as "terms") apply exclusively to your access to, and use of, the website and mobile application of kfc.lk web (hereinafter referred to as "online store") of Cargills Food Processors (Private) Limited (hereinafter referred to as "Cargills"). These terms do not alter or replace in any way the terms and conditions of any other agreement you may have with Cargills for products and services or otherwise (for example: Terms and Conditions of Cargills Rewards Program, Cargills Gift Vouchers or Cargills Affiliated Credit Cards)</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-4 flex items-center gap-3">
              <span className="bg-kfc-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Amendments
            </h2>
            <div className="pl-11 space-y-4">
              <p>We reserve the right to amend or modify these terms at any time in our sole discretion. If you disagree with any amendment or modification made, to these Terms and Conditions, you must immediately discontinue your access to the online store. However, continued use of the online store will constitute acceptance of these terms, which may be amended from time to time. We, therefore, encourage you to frequently review the terms in ensuring that you understand and are up to date with the revised terms that apply to your use of the online store.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-4 flex items-center gap-3">
              <span className="bg-kfc-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Use of the online store
            </h2>
            <div className="pl-11 space-y-4">
              <p>Your access to, and use of, the online store is conditional on your acceptance and compliance with the terms and any notices, disclaimers contained herein under.</p>
              <p>The use of the online store or any related online services are intended solely for the users who access it in the territory of Sri Lanka. We make no representation whatsoever that any goods or services available or otherwise suitable for use outside the territory of Sri Lanka. If you choose to access this site from locations outside Sri Lanka, you do so on your own initiative and are responsible for compliance with the respective local laws, where necessary.</p>
              <p>The use of the online store will require internet connectivity and appropriate telecommunication links (as the case may be). You may be charged by the internet service provider or any other such telecommunication providers for the duration of the connection while accessing the online store and you will be responsible for all such charges.</p>
              <p>If you are not the bill payer or owner of the said connection, you are presumed to have permission for such use.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-4 flex items-center gap-3">
              <span className="bg-kfc-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
              Registration
            </h2>
            <div className="pl-11 space-y-4">
              <p>To register with us, you must be over eighteen (18) years of age and you must ensure that the details provided by you are true, complete and accurate. Please inform us of any changes to your information by updating your personal details to ensure that our records are correct.</p>
              <p>Our online store is not targeted towards nor intended for use by any individual who is under the age of eighteen (18). By using or accessing the online store, you represent and warrant that you are eighteen (18) years or above the age of eighteen (18).</p>
              <p>Please refrain from accessing, using or registering for an account on the online store or carrying out purchases if you are below the age of eighteen (18).</p>
              <p>You further represent and warrant that you;</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Have not previously been suspended or removed from the online store;</li>
                <li>Do not have more than one account under the online store; and</li>
                <li>Have the full power and authority to agree to the terms, and in doing so is not in violation of any other agreement which you are a party to.</li>
              </ol>
              <p>In order to access and use the online store, you will need to create an account and provide information about yourself as a part of the registration process which would include inter alia,</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Your full name;</li>
                <li>Residential address;</li>
                <li>National identity card (nic) number;</li>
                <li>Mobile phone number; and</li>
                <li>Email address</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-4 flex items-center gap-3">
              <span className="bg-kfc-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
              Password
            </h2>
            <div className="pl-11 space-y-4">
              <p>You must select a password when creating the account. You must keep this password confidential and must not disclose it or share it with anyone. You will be responsible for all activities and orders that occur or are submitted under your password. If you know or suspect that someone else knows your password you should notify us by contacting Customer Services (see below for contact details).</p>
              <p>If Cargills has reason to believe that there is likely to be a breach of security or misuse of the site, we may require you to change your password or we may suspend your account in accordance with point 6 below.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-4 flex items-center gap-3">
              <span className="bg-kfc-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
              Cargills right to suspend or cancel your registration
            </h2>
            <div className="pl-11 space-y-4">
              <p>We reserve the right to suspend or terminate your account at any time whatsoever with or without prior notice to you. We may suspend or cancel your registration immediately at our reasonable discretion or if you breach any of your obligations under these terms.</p>
              <p>You can cancel this agreement at any time by informing us in writing. If you do so, you must cease to use the online store.</p>
              <p>The suspension or cancellation of your registration and your right to use our online services shall not affect either party's rights or liabilities.</p>
              <p>We reserve the right to block access to and/or to edit or remove any material which, in our reasonable opinion, may give rise to a breach of these terms.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-4 flex items-center gap-3">
              <span className="bg-kfc-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">7</span>
              Pricing
            </h2>
            <div className="pl-11 space-y-4">
              <p>All the products listed on the site will be sold at Market Retail Price unless otherwise specified. The prices mentioned at the time of ordering will be the prices charged on the date of the delivery. Although prices of most of the products are unlikely to fluctuate on a daily basis there are a few items and fresh food prices the prices of which do change on a daily basis. In the event the prices are higher or lower on the date of delivery no additional charges will be made nor will there be refunds afforded at the time of the delivery of the order.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-4 flex items-center gap-3">
              <span className="bg-kfc-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">8</span>
              Cancellations & Refunds
            </h2>
            <div className="pl-11 space-y-4">
              <p>You are allowed to cancel your order, on your own, any time prior to checkout, without payment. In addition to that, we will facilitate your cancellation requests directed to our customer service centre prior to dispatch of goods from our outlet. The relevant refunds will be directed to your selected payment option. The processing time of the payment refund will vary based on your selected payment method and bank.</p>
              <p>We regret to note that we cannot facilitate your cancellation requests made after your orders have been dispatched from our outlet . Please refer the FAQ section for delivery returns.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-4 flex items-center gap-3">
              <span className="bg-kfc-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">9</span>
              Ownership and intellectual property rights
            </h2>
            <div className="pl-11 space-y-4">
              <p>The online store is owned and operated by Cargills. The content including but not limited to information, photographs, illustrations, artwork and other graphic material, names, logos of the online store form party of intellectual property of Cargills Food Processors affiliates and are protected by copyright, trademark and overall intellectual property laws.</p>
              <p>You acknowledge that Cargills owns or is the licensee to all rights, title and interest in and to this kfc.lk online store, including all rights under patent, copyright, trademark and all other proprietary rights including all applications, renewals, extensions and restorations thereof, granted by and under any and all applicable laws.</p>
              <p>You are granted a personal non-exclusive, non-transferable, limited license to view and to download and/or print insignificant portions of the content from the online store provided it is used solely for informational and non-commercial purposes. You may not otherwise reproduce, modify, copy, reverse engineer or distribute or use for commercial purposes any of contents on the online store or source code of any application of the online store.</p>
              <p>Nothing contained in this online store should be construed as granting any license or right to use any of our intellectual property without our prior written consent. We shall take legal action against any unauthorized usage of our intellectual property to protects the rights in the matter. All rights not expressly mentioned herein are reserved.</p>
              <p>By submitting user content when creating an account, you automatically grant us a world-wide, royalty free, perpetual, irrevocable, non-exclusive, able to sublicense and transferable right and license to use, record, lease, reproduce, distribute, create derivative work, publicly displayor perform, transmit, publish and otherwise exploit user content in whole or in party as we deem appropriate including but not limited to, in connection with Cargills or its parent and subsidiaries or affiliate businesses.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-4 flex items-center gap-3">
              <span className="bg-kfc-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">10</span>
              Privacy Policy
            </h2>
            <div className="pl-11 space-y-4">
              <p>Cargills is committed towards protecting the privacy of the users. The data collected in the framework of this online store are used in exclusively in accordance of the laws of Sri Lanka. The data will be securely processed by Cargills and shared only with its affiliated companies, subsidiaries, franchisors, certain commercial partners, certain service providers (agents) and such other related parties of Cargills Group.</p>
              <p>Data are not transferred to unaffiliated third parties without the express consent of the user. Data including but not limited to personal information will be protected with reasonable safeguards against loss or theft as well as unauthorized access, disclosure, copying, use or modification.</p>
              <p>Cargills is committed to conducting its business in a manner which would ensure that the confidentiality of personal information and all such data are protected and maintained. Please refer our privacy statement for more information in this regard.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-4 flex items-center gap-3">
              <span className="bg-kfc-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">11</span>
              Availability of the Site
            </h2>
            <div className="pl-11 space-y-4">
              <p>Our aim is to offer you the best service possible, however we cannot guarantee that a fault free service as online services are subject to inter alia, availability of the network services, computer failures, hacking, bugs and computer malware. Please contact our customer service hotline, if you experience any form of fault. We will attempt to rectify the fault/issue as fast as possible.</p>
              <p>Your access to the online store may be occasionally restricted to allow for repairs, maintenance or the introduction of new facilities or services and will attempt to restore the service as fast as possible.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-4 flex items-center gap-3">
              <span className="bg-kfc-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">12</span>
              Limitations of use
            </h2>
            <div className="pl-11 space-y-4">
              <p>You may not use the online store for any of the following purposes:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Disseminating any unlawful, harassing, libelous, abusive, threatening, harmful, vulgar, obscene, or otherwise objectionable material;</li>
                <li>Transmitting material that encourages conduct that constitutes a criminal offence, results in civil liability or otherwise breaches any relevant laws, regulations or code of practice;</li>
                <li>Gaining unauthorized access to other computer systems;</li>
                <li>Interfering with any other person's use or enjoyment of the online store;</li>
                <li>Breaching any laws concerning the use of public telecommunications networks;and</li>
                <li>Making, transmitting or storing electronic copies of materials protected by copyright without the permission of the owner.</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-4 flex items-center gap-3">
              <span className="bg-kfc-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">13</span>
              Indemnity
            </h2>
            <div className="pl-11 space-y-4">
              <p>You agree to indemnify and keep us indemnified against any claim, action, suit or proceeding brought or threatened to be brought against us which is caused by or arising out of use of services, any other party use of services using your user credentials or verification pin or any such other identification.</p>
              <p>You will indemnify us against all losses, liabilities, costs and expenses reasonably suffered or incurred by us, all damages awarded against us under any judgment by a court of competent jurisdiction and all settlements sums paid by us as a result of any settlement agreed by us arising out or in connection with any claim by any third party that the use of the online store by you is defamatory, offensive or abusive, or of an obscene or pornographic nature, or is illegal or constitutes a breach of any applicable law, regulation or code of practice.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-4 flex items-center gap-3">
              <span className="bg-kfc-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">14</span>
              Third Party Websites
            </h2>
            <div className="pl-11 space-y-4">
              <p>This online store may include links to other websites or materials and we are not responsible in any form for the contents of other websites and materials. You may subject to the terms and conditions of such third party websites upon accessing or using the same.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-4 flex items-center gap-3">
              <span className="bg-kfc-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">15</span>
              Product and Service Availability
            </h2>
            <div className="pl-11 space-y-4">
              <p>The online store may contain reference to products and services that are not available in every location.</p>
              <p>The product list and description available on the online store may be subject to change and be reformulated. Therefore, you are encouraged to review product labels prior to purchase.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-4 flex items-center gap-3">
              <span className="bg-kfc-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">16</span>
              Cargills Rewards
            </h2>
            <div className="pl-11 space-y-4">
              <p>Cargills Rewards is the loyalty program offered by Cargills for its loyalty members and is linked to the online store. Please refer to the website for relevant terms and conditions.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-4 flex items-center gap-3">
              <span className="bg-kfc-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">17</span>
              Governing Law
            </h2>
            <div className="pl-11 space-y-4">
              <p>The construction, interpretation and enforcement of this agreement shall be governed in accordance with the laws of Sri Lanka. However, the parties hereto shall seek and settle all disputes arising from this agreement primarily in an amicable manner.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-4 flex items-center gap-3">
              <span className="bg-kfc-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">18</span>
              Ratings and Review
            </h2>
            <div className="pl-11 space-y-4">
              <p>Any communication or other information sent to Cargills via e mail or otherwise in connection with your use of the online store, including but not limited to suggestions, ideas and comments, will be treated as non-confidential and all such information may be used by Cargills for any purpose without compensation. Disclosure shall constitute an assignment of all right, title and interest in such information to Cargills.</p>
              <p>Cargills may not review all communications and material posted or uploaded and is not responsible for the content of these communication material.</p>
              <p>We may contact you at the e-mail address attached to your account to request a review or to notify you about the status of your review.</p>
              <p>Cargills reserves the right to block or remove communication materials that it determines to be abusive, defamatory or obscene, clearly false or misleading, in violation of intellectual property rights of another or libelous, harassing vulgar, inappropriate with respect to race, gender, sexual orientation, ethnicity or other intrinsic characteristics or unrelated to goods or services offered by our online store.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-4 flex items-center gap-3">
              <span className="bg-kfc-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">19</span>
              Miscellaneous
            </h2>
            <div className="pl-11 space-y-4">
              <p>This agreement embodies the entire understanding with respect to the subject matter hereof and supersedes and replaces any and all prior understandings and arrangements.</p>
              <p>Should any portion of this agreement be judicially determined to be illegal or unenforceable, the remainder of the agreement shall continue in full force and effect, and either party may renegotiate the terms affected by the severance.</p>
              <p>You may not assign, sub license or otherwise transfer any of your rights under these terms without the written consent of Cargills.</p>
              <p>Cargills shall not be responsible for breach of these terms caused by circumstances beyond its control.</p>
              <p>You agree that no joint venture, partnership, employment or agency relationship exists between Cargills and you as a result of this agreement or use of online store.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase text-kfc-black mb-4 flex items-center gap-3">
              <span className="bg-kfc-red text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">20</span>
              Cargills right to exercise
            </h2>
            <div className="pl-11 space-y-4">
              <p>The failure of Cargills to exercise or enforce any right or provision of these terms shall not constitute a waiver of such right or provision.</p>
            </div>
          </section>

          {/* Other Important Terms */}
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 mt-16">
            <h3 className="text-xl font-black uppercase text-kfc-black mb-6">Other important Terms and conditions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Operating hours:</h4>
                <p className="text-kfc-red font-black text-lg">10AM to 10PM</p>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-kfc-red mt-1.5 flex-shrink-0"></div>
                  <span>Delivery fee 10% of Total bill</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-kfc-red mt-1.5 flex-shrink-0"></div>
                  <span>Maximum delivery fee applicable Rs.400/= for orders above Rs 4,000/=</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-kfc-red mt-1.5 flex-shrink-0"></div>
                  <span>Delivery service is available for 5KM radius from the nearest Restaurant - Please refer to the location list prior to ordering.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-kfc-red mt-1.5 flex-shrink-0"></div>
                  <span>Minimum value of Rs. 600 per order.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-kfc-red mt-1.5 flex-shrink-0"></div>
                  <span>Orders are taken from 10am to 10pm daily.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-kfc-red mt-1.5 flex-shrink-0"></div>
                  <span>Orders will be taken on a first- come- first- served basis.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-kfc-red mt-1.5 flex-shrink-0"></div>
                  <span>The approximate delivery time will be confirmed as we receive the order.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-kfc-red mt-1.5 flex-shrink-0"></div>
                  <span>Outlets giving service may vary based on government regulations.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* WhatsApp Broadcast Terms */}
          <div className="bg-kfc-red text-white p-8 md:p-12 rounded-3xl mt-12 relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 kfc-stripes opacity-10"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transform -rotate-3">
                <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#25D366]" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-3">KFC Sri Lanka WhatsApp Broadcast</h3>
                <p className="text-red-100 font-medium leading-relaxed mb-4">
                  When you scan this QR code and join the KFC Sri Lanka WhatsApp channel, you agree to receive updates about our products, offers, promotions, and news.
                </p>
                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
                  <p className="text-sm font-bold tracking-wide">
                    We will use your mobile number <span className="underline decoration-2 underline-offset-2">only</span> to send KFC Sri Lanka messages.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

const KFC_BRANCHES = [
  { id: 1, name: "KFC Colombo 03", lat: 6.905, lng: 79.851, address: "Galle Road, Colombo 03" },
  { id: 2, name: "KFC Majestic City", lat: 6.894, lng: 79.854, address: "Majestic City, Colombo 04" },
  { id: 3, name: "KFC Nugegoda", lat: 6.864, lng: 79.899, address: "High Level Rd, Nugegoda" },
  { id: 4, name: "KFC Mount Lavinia", lat: 6.833, lng: 79.864, address: "Galle Rd, Mount Lavinia" },
  { id: 5, name: "KFC Kandy", lat: 7.290, lng: 80.633, address: "Dalada Vidiya, Kandy" },
  { id: 6, name: "KFC Galle", lat: 6.032, lng: 80.216, address: "Matara Rd, Galle" },
  { id: 7, name: "KFC Negombo", lat: 7.209, lng: 79.839, address: "Greens Rd, Negombo" },
  { id: 8, name: "KFC Kurunegala", lat: 7.481, lng: 80.360, address: "Colombo Rd, Kurunegala" },
  { id: 9, name: "KFC Ragama", lat: 7.021, lng: 79.901, address: "Mahabage Rd, Ragama" },
  { id: 10, name: "KFC Jaffna", lat: 9.661, lng: 80.025, address: "Hospital Rd, Jaffna" },
];

const CheckoutPage = ({ 
  cartItems, 
  onBack,
  onPlaceOrder
}: { 
  cartItems: { item: MenuItem, quantity: number }[], 
  onBack: () => void,
  onPlaceOrder: () => void
}) => {
  const subtotal = cartItems.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const isEmpty = cartItems.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-32 pb-24 bg-gray-100 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
          {/* Left Section: Your Cart */}
          <div className="flex-1 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <ShoppingBag className="w-8 h-8 text-kfc-red" />
              <h2 className="text-3xl font-black uppercase tracking-tight">Your Cart</h2>
            </div>
            <div className="w-full h-px bg-gray-100 mb-12"></div>

            {isEmpty ? (
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No items in your cart.</h3>
                <p className="text-gray-500 text-lg mb-12 max-w-md">
                  Your cart looks little empty. Why not checkout some of our unbeatable deals.
                </p>
              </div>
            ) : (
              <div className="flex-1 space-y-6 overflow-y-auto max-h-[500px] pr-4">
                {cartItems.map(({ item, quantity }) => (
                  <div key={item.id} className="flex gap-6 items-center bg-gray-50 p-4 rounded-3xl">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-2xl" referrerPolicy="no-referrer" />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{item.name}</h4>
                      <p className="text-kfc-red font-black">Rs. {item.price.toLocaleString()}</p>
                    </div>
                    <div className="text-xl font-black">x{quantity}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-auto pt-8">
              <button
                onClick={onBack}
                className="bg-kfc-red text-white px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-200"
              >
                Back
              </button>
            </div>
          </div>

          {/* Right Section: Order Summary */}
          <div className="w-full lg:w-[450px] bg-gray-50 p-8 md:p-12 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <Package className="w-6 h-6 text-gray-400" />
              <h2 className="text-2xl font-black uppercase tracking-tight">Order Summary</h2>
            </div>
            <div className="w-full h-px bg-gray-200 mb-8"></div>

            <div className="space-y-4 mb-8">
              <button className="w-full bg-kfc-red text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-red-700 transition-all shadow-md">
                Enter your coupon code
              </button>
              <button className="w-full bg-gray-200 text-gray-600 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-gray-300 transition-all">
                Redeem GES discount
              </button>
            </div>

            <div className="space-y-4 mb-8 text-sm font-bold text-gray-600 uppercase tracking-wider">
              <div className="flex justify-between items-center">
                <span>Sub total</span>
                <span className="flex-1 border-b border-dotted border-gray-300 mx-2 mb-1"></span>
                <span>{subtotal > 0 ? `Rs. ${subtotal.toLocaleString()}` : ".00"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Discount amount</span>
                <span className="flex-1 border-b border-dotted border-gray-300 mx-2 mb-1"></span>
                <span>.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Discounted total</span>
                <span className="flex-1 border-b border-dotted border-gray-300 mx-2 mb-1"></span>
                <span>{subtotal > 0 ? `Rs. ${subtotal.toLocaleString()}` : ".00"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Packing Charge</span>
                <span className="flex-1 border-b border-dotted border-gray-300 mx-2 mb-1"></span>
                <span>0</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-black uppercase tracking-widest">Net Total</span>
                <span className="text-3xl font-black text-kfc-red">Rs. {subtotal > 0 ? subtotal.toLocaleString() : ".00"}</span>
              </div>
            </div>

            <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">
              Review your order before checkout.
            </p>

            <div className="mt-auto">
              {subtotal < 500 ? (
                <div className="bg-kfc-red text-white p-6 rounded-2xl text-center shadow-lg shadow-red-200">
                  <p className="font-black uppercase tracking-widest text-sm">
                    Minimum order value should be Rs.500
                  </p>
                </div>
              ) : (
                <button 
                  onClick={onPlaceOrder}
                  className="w-full bg-kfc-red text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-200"
                >
                  Checkout Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const LocationConfirmationPage = ({ 
  address, 
  onConfirm, 
  onBack 
}: { 
  address: string, 
  onConfirm: (finalAddress: string) => void, 
  onBack: () => void 
}) => {
  const [houseNo, setHouseNo] = useState('25/1');
  const [streetName, setStreetName] = useState('');
  const [markerPos, setMarkerPos] = useState<[number, number]>([6.9271, 79.8612]); // Default to Colombo
  const [currentAddress, setCurrentAddress] = useState(address);

  // Draggable marker logic
  const markerRef = React.useRef<any>(null);
  const eventHandlers = React.useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          setMarkerPos([newPos.lat, newPos.lng]);
          // In a real app, we would reverse geocode here
          setCurrentAddress(address + " (Adjusted)");
        }
      },
    }),
    [address],
  );

  return (
    <div className="pt-20 min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Side: Map Section */}
      <div className="w-full lg:w-[70%] h-[50vh] lg:h-[calc(100vh-80px)] relative z-0">
        <MapContainer 
          center={markerPos} 
          zoom={15} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={markerPos}
            ref={markerRef}
          >
          </Marker>
        </MapContainer>
        
        {/* Map Controls Overlay */}
        <div className="absolute bottom-8 left-8 z-10 flex flex-col gap-2">
          <button className="bg-white p-3 rounded-xl shadow-xl hover:bg-gray-50 transition-colors">
            <Plus className="w-6 h-6 text-gray-600" />
          </button>
          <button className="bg-white p-3 rounded-xl shadow-xl hover:bg-gray-50 transition-colors">
            <Minus className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Right Side: Delivery Details Panel */}
      <div className="w-full lg:w-[30%] bg-white p-8 lg:p-10 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.05)] relative z-10 overflow-y-auto">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Current Delivery Address</h2>
        
        <div className="flex items-start gap-4 mb-8 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
          <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-kfc-red" />
          </div>
          <p className="text-lg font-bold text-gray-800 leading-tight pt-1">
            {currentAddress}
          </p>
        </div>

        <div className="mb-8">
          <p className="text-sm font-medium leading-relaxed text-gray-600">
            <span className="text-kfc-red font-black uppercase tracking-widest mr-2">Important:</span>
            Please note that when changing the location on our map, your delivery address will be automatically adjusted based on the new map location selected, ensuring a smooth and hassle-free experience.
          </p>
        </div>

        <div className="space-y-6 mb-10">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">House number</label>
            <input
              type="text"
              value={houseNo}
              onChange={(e) => setHouseNo(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-kfc-red/20 focus:border-kfc-red transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Street name</label>
            <input
              type="text"
              value={streetName}
              onChange={(e) => setStreetName(e.target.value)}
              placeholder="Street Name (optional)"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-kfc-red/20 focus:border-kfc-red transition-all"
            />
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-3xl mb-10 border border-red-100">
          <p className="text-sm font-bold text-kfc-red leading-relaxed">
            The order will be delivered to the above location marked by the PIN. Please relocate the PIN if it's at the incorrect location.
          </p>
        </div>

        <div className="mt-auto space-y-4">
          <button
            onClick={() => onConfirm(`${houseNo}, ${streetName ? streetName + ', ' : ''}${currentAddress}`)}
            className="w-full bg-kfc-red text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-200 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Confirm & Continue
          </button>
          <button
            onClick={onBack}
            className="w-full border-2 border-kfc-red text-kfc-red py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-50 transition-all"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};


const AddressEntryModal = ({ isOpen, onClose, onSelectAddress }: { isOpen: boolean, onClose: () => void, onSelectAddress: (address: string) => void }) => {
  const [houseNo, setHouseNo] = useState('');
  const [street, setStreet] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (street.length > 0) {
      const filtered = SRI_LANKA_LOCATIONS.filter(loc => 
        loc.toLowerCase().includes(street.toLowerCase())
      ).slice(0, 10);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [street]);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onSelectAddress("Current Location (Lat: " + position.coords.latitude.toFixed(4) + ", Lng: " + position.coords.longitude.toFixed(4) + ")");
          onClose();
        },
        (error) => {
          console.error("Error detecting location:", error);
          alert("Unable to detect location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 p-8 md:p-10"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-kfc-red transition-colors rounded-full hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl md:text-3xl font-black text-kfc-black mb-8 pr-8">
              Where do you want to get delivered ?
            </h2>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">House No</label>
                <input
                  type="text"
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  placeholder="e.g. 25/1"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-medium focus:outline-none focus:ring-2 focus:ring-kfc-red/20 focus:border-kfc-red transition-all"
                />
              </div>
              <div className="relative">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Street / Place Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Search for any place in Sri Lanka..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 pr-12 font-medium focus:outline-none focus:ring-2 focus:ring-kfc-red/20 focus:border-kfc-red transition-all"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {isLoading && (
                      <div className="w-4 h-4 border-2 border-kfc-red border-t-transparent rounded-full animate-spin"></div>
                    )}
                    <MapPin className="w-5 h-5 text-gray-300" />
                  </div>
                </div>
              </div>
            </div>

            {suggestions.length > 0 && (
              <div className="mb-8 max-h-64 overflow-y-auto custom-scrollbar pr-2 bg-gray-50 rounded-3xl p-2 border border-gray-100">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const fullAddress = houseNo ? `${houseNo}, ${suggestion}` : suggestion;
                      onSelectAddress(fullAddress);
                      onClose();
                    }}
                    className="w-full flex items-start gap-4 p-4 hover:bg-white hover:shadow-md rounded-2xl transition-all text-left group"
                  >
                    <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-kfc-red transition-colors">
                      <MapPin className="w-4 h-4 text-kfc-red group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-700 line-clamp-2">{suggestion}</span>
                      <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Sri Lanka</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={handleLocateMe}
              className="w-full bg-kfc-red text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-200 flex items-center justify-center gap-3"
            >
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              LOCATE ME
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const PickupLocationModal = ({ isOpen, onClose, onSelectLocation }: { isOpen: boolean, onClose: () => void, onSelectLocation: (location: string) => void }) => {
  const [location, setLocation] = useState('');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
          >
            <div className="p-8 md:p-10 pb-4">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>

              <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-kfc-black uppercase tracking-tight mb-2">Select Pick-up Location</h2>
                <div className="w-12 h-1 bg-kfc-red mx-auto rounded-full"></div>
              </div>

              <div className="relative group mb-4">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-kfc-red transition-colors" />
                <input
                  type="text"
                  placeholder="Search for a restaurant..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-kfc-red focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-700 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 md:px-10 pb-8 space-y-3 custom-scrollbar">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Available Restaurants</p>
              {KFC_BRANCHES.filter(branch => 
                branch.name.toLowerCase().includes(location.toLowerCase()) || 
                branch.address.toLowerCase().includes(location.toLowerCase())
              ).map(branch => (
                <button
                  key={branch.id}
                  onClick={() => {
                    onSelectLocation(branch.name + " - " + branch.address);
                    onClose();
                  }}
                  className="w-full flex items-start gap-4 p-4 hover:bg-red-50 rounded-2xl transition-all text-left group border border-gray-100 hover:border-kfc-red/20"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-kfc-red transition-colors">
                    <Store className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800">{branch.name}</span>
                    <span className="text-xs text-gray-500 mt-0.5">{branch.address}</span>
                  </div>
                </button>
              ))}
              
              {KFC_BRANCHES.filter(branch => 
                branch.name.toLowerCase().includes(location.toLowerCase()) || 
                branch.address.toLowerCase().includes(location.toLowerCase())
              ).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400 font-medium italic">No restaurants found matching your search.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const RestaurantsMap = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white w-full max-w-6xl h-[80vh] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col"
        >
          <div className="bg-kfc-red text-white p-6 flex justify-between items-center z-10 shadow-md">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-wider">Our Restaurants</h2>
              <p className="text-red-100 mt-1">Find a KFC near you in Sri Lanka</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 relative z-0">
            <MapContainer 
              center={[7.8731, 80.7718]} 
              zoom={7} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
              {KFC_BRANCHES.map(branch => (
                <Marker 
                  key={branch.id} 
                  position={[branch.lat, branch.lng]}
                  icon={kfcIcon}
                >
                  <Popup className="kfc-popup">
                    <div className="text-center p-1">
                      <h3 className="font-bold text-lg text-kfc-red mb-1">{branch.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{branch.address}</p>
                      <button className="bg-kfc-black text-white text-xs px-4 py-2 rounded-lg font-bold uppercase hover:bg-kfc-red transition-colors w-full">
                        Order Here
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const AddressRequiredModal = ({ isOpen, onClose, onSelectAddress }: { isOpen: boolean, onClose: () => void, onSelectAddress: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 p-10 text-center"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-kfc-red transition-colors rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                <MapPin className="w-10 h-10 text-kfc-red" />
              </div>
            </div>
            
            <h2 className="text-3xl font-black text-kfc-black mb-4 leading-tight">Please select an address.</h2>
            
            <p className="text-gray-500 mb-10 text-base font-medium">
              We need your delivery address to check availability and provide accurate delivery times.
            </p>
            
            <button
              onClick={() => {
                onClose();
                onSelectAddress();
              }}
              className="w-full bg-kfc-red text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-200 hover:shadow-red-300 transform hover:-translate-y-0.5"
            >
              Select Address
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const OrderSuccessModal = ({ 
  isOpen, 
  onClose, 
  orderDetails,
  onTrackOrder
}: { 
  isOpen: boolean, 
  onClose: () => void,
  orderDetails: {
    orderId: string,
    items: { item: MenuItem, quantity: number }[],
    total: number,
    estimatedTime: string
  } | null,
  onTrackOrder: () => void
}) => {
  if (!orderDetails) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-10">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight text-kfc-black mb-2">Order Successful!</h2>
                <p className="text-gray-500 font-medium">Thank you for your order. It's being prepared.</p>
              </div>

              <div className="bg-gray-50 rounded-3xl p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400">Order ID</span>
                  <span className="font-bold text-kfc-black">#{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400">Estimated Delivery</span>
                  <span className="font-bold text-kfc-red">{orderDetails.estimatedTime}</span>
                </div>
                <div className="w-full h-px bg-gray-200 my-4"></div>
                <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                  {orderDetails.items.map(({ item, quantity }) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 font-medium">{quantity}x {item.name}</span>
                      <span className="font-bold">Rs. {(item.price * quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="w-full h-px bg-gray-200 my-4"></div>
                <div className="flex justify-between items-center">
                  <span className="font-black uppercase tracking-widest text-gray-400">Total Paid</span>
                  <span className="text-xl font-black text-kfc-red">Rs. {orderDetails.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={onTrackOrder}
                  className="w-full bg-kfc-red text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-200 flex items-center justify-center gap-3"
                >
                  <MapPin className="w-5 h-5" />
                  Track Order
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-white text-gray-500 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-gray-50 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

export default function App() {
  const [cart, setCart] = useState<{ item: MenuItem, quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [isAddressRequiredOpen, setIsAddressRequiredOpen] = useState(false);
  const [isAddressEntryOpen, setIsAddressEntryOpen] = useState(false);
  const [tempAddress, setTempAddress] = useState<string | null>(null);
  const [registrationData, setRegistrationData] = useState({ mobile: '', email: '' });
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [activeNav, setActiveNav] = useState('MAINS');
  const [activeCategory, setActiveCategory] = useState("All");
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [lastOrderDetails, setLastOrderDetails] = useState<{
    orderId: string,
    items: { item: MenuItem, quantity: number }[],
    total: number,
    estimatedTime: string
  } | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [orders, setOrders] = useState<{ orderId: string, items: { item: MenuItem, quantity: number }[], total: number, date: string }[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('kfc_cart');
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedUser = localStorage.getItem('kfc_user');
    if (savedUser) setUser(savedUser);

    const savedOrders = localStorage.getItem('kfc_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('kfc_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('kfc_user', user);
    } else {
      localStorage.removeItem('kfc_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('kfc_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const addToCart = (item: MenuItem) => {
    if (!selectedAddress) {
      setIsAddressRequiredOpen(true);
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handlePlaceOrder = () => {
    const total = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const orderDetails = {
      orderId,
      items: [...cart],
      total,
      estimatedTime: "30-45 Mins"
    };
    
    // Add to order history
    setOrders(prev => [{
      orderId,
      items: [...cart],
      total,
      date: new Date().toISOString()
    }, ...prev]);

    setLastOrderDetails(orderDetails);
    setCart([]);
    setIsOrderSuccessOpen(true);
    setCurrentPage('home');
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(i => {
        if (i.item.id === id) {
          const newQty = Math.max(0, i.quantity + delta);
          return { ...i, quantity: newQty };
        }
        return i;
      }).filter(i => i.quantity > 0);
    });
  };

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen">
      <Navbar 
        cartCount={cartCount} 
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenMap={() => setIsMapOpen(true)} 
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onCategoryChange={setActiveCategory}
        onOpenOrderDetails={() => setIsOrderDetailsOpen(true)}
        user={user}
        onLogout={() => setUser(null)}
      />
      
      <main>
        <AnimatePresence mode="wait">
          {currentPage === 'home' ? (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero 
                onOpenAddressModal={() => setIsAddressEntryOpen(true)} 
                onOpenPickupModal={() => setIsPickupModalOpen(true)}
                selectedAddress={selectedAddress}
              />
              
              {/* Featured Banner */}
              <section className="py-16 bg-kfc-red text-white overflow-hidden relative">
                <div className="absolute inset-0 kfc-stripes opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="text-center md:text-left flex-1">
                      <div className="inline-block bg-yellow-400 text-black px-4 py-1 rounded-full font-black text-sm uppercase tracking-widest mb-4 transform -rotate-2">Limited Time Offer</div>
                      <h3 className="text-4xl md:text-5xl font-black mb-4 leading-tight">NEW: CHEESY SHAWARMA!</h3>
                      <p className="font-bold text-lg uppercase tracking-widest opacity-90 mb-8">A delicious and cheesy shawarma wrap loaded with flavor.</p>
                      {cart.find(ci => ci.item.id === 'cr1') ? (
                        <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md rounded-2xl p-2 w-fit mx-auto md:mx-0">
                          <button 
                            onClick={() => updateQuantity('cr1', -1)}
                            className="p-3 bg-white text-kfc-red rounded-xl hover:bg-gray-100 shadow-lg transition-all"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <span className="font-black text-2xl w-8 text-center">
                            {cart.find(ci => ci.item.id === 'cr1')?.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity('cr1', 1)}
                            className="p-3 bg-white text-kfc-red rounded-xl hover:bg-gray-100 shadow-lg transition-all"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => addToCart({
                            id: 'cr1',
                            name: 'CHEESY SHAWARMA',
                            description: 'A delicious and cheesy shawarma wrap loaded with flavor.',
                            price: 1290,
                            category: 'CHEESY RANGE',
                            image: 'https://admin-kfc-web.azurewebsites.net/images/mainmenu/cheesyshawarma8800c6b59507423c9aa6d71899c887e7.jpg'
                          })}
                          className="bg-white text-kfc-red p-4 rounded-full font-black uppercase tracking-wider hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 transform flex items-center justify-center"
                        >
                          <Plus className="w-6 h-6" />
                        </button>
                      )}
                    </div>
                    <div className="flex-1 relative">
                      <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-20 transform scale-150"></div>
                      <img 
                        src="https://admin-kfc-web.azurewebsites.net//images/promotionbanners/d54ffc0eb6c8481cbb8070e1e82a9633.jpg" 
                        alt="Cheesy Shawarma" 
                        className="w-full max-w-md mx-auto rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 border-4 border-white/20"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <MenuSection 
                onAddToCart={addToCart} 
                cartItems={cart} 
                onUpdateQuantity={updateQuantity} 
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
              
              {/* Store Locator Section */}
              <section id="locations" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1">
                      <div className="relative rounded-3xl overflow-hidden aspect-video shadow-2xl bg-gray-100">
                        <iframe 
                          title="KFC Ragama Location"
                          src="https://maps.google.com/maps?q=968/1%20Mahabage%20Rd,%20Ragama,%20Sri%20Lanka&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                          width="100%" 
                          height="100%" 
                          style={{ border: 0 }} 
                          allowFullScreen 
                          loading="lazy" 
                          referrerPolicy="no-referrer-when-downgrade"
                          className="absolute inset-0 w-full h-full z-0"
                        ></iframe>
                        <div className="absolute top-4 left-4 bg-white p-2 rounded-xl shadow-lg pointer-events-none z-10">
                          <img src="https://www.hatchwise.com/wp-content/uploads/2024/05/image-24.png" alt="KFC Logo" className="w-16 h-16 object-contain" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="order-1 lg:order-2">
                      <h2 className="text-5xl font-black mb-8 leading-tight">Find Your <br /><span className="text-kfc-red">Nearest KFC</span></h2>
                      <div className="space-y-8">
                        <div className="flex gap-6">
                          <div className="w-12 h-12 bg-kfc-gray rounded-2xl flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-6 h-6 text-kfc-red" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg mb-1">KFC Ragama</h4>
                            <p className="text-gray-500 text-sm">968/1 Mahabage Rd, Ragama, Sri Lanka</p>
                          </div>
                        </div>
                        <div className="flex gap-6">
                          <div className="w-12 h-12 bg-kfc-gray rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Clock className="w-6 h-6 text-kfc-red" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg mb-1">Opening Hours</h4>
                            <p className="text-gray-500 text-sm">Mon - Sun: 10:00 AM - 11:00 PM</p>
                          </div>
                        </div>
                        <div className="flex gap-6">
                          <div className="w-12 h-12 bg-kfc-gray rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Phone className="w-6 h-6 text-kfc-red" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg mb-1">Contact</h4>
                            <p className="text-gray-500 text-sm">0112-958-815</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-12 flex gap-4">
                        <div className="flex-1 relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input 
                            type="text" 
                            placeholder="Enter city or zip code" 
                            className="w-full bg-kfc-gray rounded-2xl pl-12 pr-4 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-kfc-red transition-all"
                          />
                        </div>
                        <button className="bg-kfc-black text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-wider hover:bg-kfc-red transition-all">
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <OrderTracking />
            </motion.div>
          ) : currentPage === 'about' ? (
            <AboutPage key="about" />
          ) : currentPage === 'terms' ? (
            <TermsPage key="terms" />
          ) : currentPage === 'privacy' ? (
            <PrivacyPolicyPage key="privacy" />
          ) : currentPage === 'contact' ? (
            <ContactUsPage key="contact" />
          ) : currentPage === 'feedback' ? (
            <FeedbackPage key="feedback" />
          ) : currentPage === 'order-history' ? (
            <OrderHistoryPage key="order-history" orders={orders} />
          ) : currentPage === 'checkout' ? (
            <CheckoutPage 
              cartItems={cart}
              onBack={() => setCurrentPage('home')}
              onPlaceOrder={handlePlaceOrder}
            />
          ) : currentPage === 'auth' ? (
            <AuthPage 
              key="auth"
              onBack={() => setCurrentPage('home')}
              onRegister={() => setCurrentPage('register')}
              onLogin={(username) => setUser(username)}
            />
          ) : currentPage === 'register' ? (
            <RegisterPage 
              onBack={() => setCurrentPage('home')}
              onRegisterSuccess={(mobile, email) => {
                setRegistrationData({ mobile, email });
                setCurrentPage('verification');
              }}
            />
          ) : currentPage === 'verification' ? (
            <VerificationPage 
              mobileNumber={registrationData.mobile}
              email={registrationData.email}
              onVerify={() => {
                setUser(registrationData.email || registrationData.mobile || 'User');
                setCurrentPage('home');
              }}
              onBack={() => setCurrentPage('register')}
            />
          ) : currentPage === 'location-confirmation' ? (
            <LocationConfirmationPage 
              address={tempAddress || ''}
              onConfirm={(finalAddress) => {
                setSelectedAddress(finalAddress);
                setCurrentPage('home');
                setTimeout(() => {
                  document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              onBack={() => {
                setCurrentPage('home');
                setIsAddressEntryOpen(true);
              }}
            />
          ) : (
            <PromotionsPage 
              key="promotions" 
              onAddToCart={addToCart} 
              cartItems={cart} 
              onUpdateQuantity={updateQuantity} 
            />
          )}
        </AnimatePresence>
      </main>

      <Footer onPageChange={setCurrentPage} />
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart}
        onUpdateQuantity={updateQuantity}
        onCheckout={() => setCurrentPage('checkout')}
      />

      <RestaurantsMap 
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
      />

      <DeliveryOrderDetails 
        isOpen={isOrderDetailsOpen}
        onClose={() => setIsOrderDetailsOpen(false)}
        onOpenAddressModal={() => {
          setIsOrderDetailsOpen(false);
          setIsAddressEntryOpen(true);
        }}
      />

      <AddressRequiredModal 
        isOpen={isAddressRequiredOpen}
        onClose={() => setIsAddressRequiredOpen(false)}
        onSelectAddress={() => setIsAddressEntryOpen(true)}
      />

      <AddressEntryModal
        isOpen={isAddressEntryOpen}
        onClose={() => setIsAddressEntryOpen(false)}
        onSelectAddress={(address) => {
          setTempAddress(address);
          setIsAddressEntryOpen(false);
          setCurrentPage('location-confirmation');
        }}
      />

      <OrderSuccessModal 
        isOpen={isOrderSuccessOpen}
        onClose={() => setIsOrderSuccessOpen(false)}
        orderDetails={lastOrderDetails}
        onTrackOrder={() => {
          setIsOrderSuccessOpen(false);
          setCurrentPage('track-order');
        }}
      />

      <PickupLocationModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
        onSelectLocation={(loc) => setSelectedAddress(loc)}
      />
    </div>
  );
}
