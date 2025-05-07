import axios from "axios";
import React, { useEffect, useState } from "react";
import { 
  FiMenu, FiX, FiInfo, FiMail, FiHome, FiDollarSign, 
  FiHelpCircle, FiRefreshCw, FiTrendingUp, FiTrendingDown, 
  FiStar, FiGlobe, FiPieChart, FiSearch, FiClock, FiActivity
} from "react-icons/fi";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Parallax, ParallaxProvider } from "react-scroll-parallax";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";

function App() {
  const Key = "FreeFusNYvmUj8BOKoqzaZSlwYnQONdS";
  const URL = `https://brsapi.ir/Api/Market/Gold_Currency.php?key=${Key}`;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);

  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 100], [0, -50]);
  const headerOpacity = useTransform(scrollY, [0, 50], [1, 0.9]);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get(URL);
      setData(response.data);
      
      const now = new Date();
      const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setLastUpdated(now.toLocaleDateString('fa-IR', options));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const getChangeColor = (percent) => {
    return percent >= 0 ? "text-emerald-400" : "text-rose-500";
  };

  const getChangeIcon = (percent) => {
    return percent >= 0 ? (
      <motion.span 
        initial={{ y: -5 }}
        animate={{ y: 0 }}
        className="inline-block"
      >
        <FiTrendingUp className="inline ml-1" />
      </motion.span>
    ) : (
      <motion.span 
        initial={{ y: 5 }}
        animate={{ y: 0 }}
        className="inline-block"
      >
        <FiTrendingDown className="inline ml-1" />
      </motion.span>
    );
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const filteredGold = data?.gold?.filter(item => 
    item.name.includes(searchQuery) || 
    item.name_en.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCurrency = data?.currency?.filter(item => 
    item.name.includes(searchQuery) || 
    item.name_en.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCrypto = data?.cryptocurrency?.filter(item => 
    item.name.includes(searchQuery) || 
    item.name_en.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navItems = [
    { id: "dashboard", label: "داشبورد", icon: <FiHome className="ml-2" /> },
    { id: "gold", label: "طلای دیجیتال", icon: <FiDollarSign className="ml-2" /> },
    { id: "currency", label: "بازار جهانی", icon: <FiGlobe className="ml-2" /> },
    { id: "crypto", label: "رمزارزها", icon: <FiPieChart className="ml-2" /> },
    { id: "analytics", label: "تحلیل بازار", icon: <FiActivity className="ml-2" /> },
  ];

  const getAssetColor = (symbol) => {
    const colors = {
      "IR_GOLD_18K": "from-amber-500 to-amber-600",
      "IR_GOLD_24K": "from-yellow-500 to-yellow-600",
      "IR_GOLD_MELTED": "from-orange-500 to-orange-600",
      "XAUUSD": "from-amber-400 to-amber-500",
      "IR_COIN_1G": "from-yellow-400 to-yellow-500",
      "IR_COIN_QUARTER": "from-amber-300 to-amber-400",
      "IR_COIN_HALF": "from-yellow-300 to-yellow-400",
      "IR_COIN_EMAMI": "from-amber-200 to-amber-300",
      "IR_COIN_BAHAR": "from-yellow-200 to-yellow-300",
      "USD": "from-green-500 to-green-600",
      "EUR": "from-blue-500 to-blue-600",
      "GBP": "from-red-500 to-red-600",
      "BTC": "from-orange-500 to-orange-600",
      "ETH": "from-purple-500 to-purple-600",
      "USDT": "from-teal-500 to-teal-600",
    };
    return colors[symbol] || "from-gray-500 to-gray-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-6"
          ></motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-amber-400 mb-2"
          >
            <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
             نرخسان
            </span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400"
          >
            در حال دریافت آخرین اطلاعات بازار...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-800/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-amber-500/30 max-w-md mx-4 text-center"
        >
          <h2 className="text-2xl font-bold text-rose-400 mb-4">خطا در اتصال</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-amber-500/30 transition-all"
          >
            تلاش مجدد
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <ParallaxProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 overflow-hidden">
        {/* Floating Header */}
        <motion.header 
          style={{ y: headerY, opacity: headerOpacity }}
          className="hidden lg:flex fixed top-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md z-50 p-4 shadow-xl border-b border-gray-700/50"
        >
          <div className="container mx-auto flex justify-between items-center">
            <motion.h1 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent flex items-center"
            >
              <FiStar className="mr-2" /> نرخستان
            </motion.h1>
            <nav className="flex space-x-6 space-x-reverse">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-lg transition-all ${activeTab === item.id ? 
                    'bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg shadow-amber-500/30 text-white' : 
                    'text-gray-300 hover:text-amber-300 hover:bg-gray-800/50'}`}
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
          </div>
        </motion.header>

        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md z-50 p-4 shadow-xl border-b border-gray-700/50 flex justify-between items-center">
          <button 
            onClick={toggleMenu}
            className="text-2xl text-amber-400"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
          نرخستان
          </h1>
          <button 
            onClick={fetchData}
            className={`text-amber-400 ${refreshing ? 'animate-spin' : ''}`}
          >
            <FiRefreshCw />
          </button>
        </header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleMenu}
                className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed lg:hidden top-0 left-0 h-full w-72 bg-gray-900/95 shadow-2xl z-50 border-r border-gray-800 backdrop-blur-lg"
              >
                <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-amber-300">منو</h2>
                  <button onClick={toggleMenu} className="text-2xl text-amber-400">
                    <FiX />
                  </button>
                </div>
                <nav className="p-2">
                  {navItems.map((item) => (
                    <motion.button
                      key={item.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMenuOpen(false);
                      }}
                      className={`w-full text-right flex items-center p-4 my-1 rounded-lg transition-all ${activeTab === item.id ? 
                        'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-100 shadow-inner' : 
                        'text-gray-300 hover:bg-gray-800/50'}`}
                    >
                      {item.label}
                      {item.icon}
                    </motion.button>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="pt-16 lg:pt-24 pb-20 lg:pb-0 container mx-auto px-4">
          {/* Last Updated */}
          {lastUpdated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center text-sm text-gray-400 mb-8 flex items-center justify-center"
            >
              <FiClock className="ml-2" /> آخرین بروزرسانی: {lastUpdated}
            </motion.div>
          )}

          {/* Search Bar */}
          {activeTab !== "dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8 max-w-md mx-auto"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="جستجو در بازار..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-full py-3 px-5 pl-12 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent backdrop-blur-sm"
                />
                <div className="absolute left-3 top-3 text-gray-500">
                  <FiSearch className="h-6 w-6" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "dashboard" && (
                <div className="text-center">
                  {/* Hero Section */}
                  <Parallax speed={10}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mb-16"
                    >
                      <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4">
                        <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
                          رصد لحظه‌ای بازار طلا و ارز
                        </span>
                      </h1>
                      <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        دسترسی به آخرین قیمت‌های طلا، ارز و رمزارزها با دقت بالا و رابط کاربری پیشرفته
                      </p>
                    </motion.div>
                  </Parallax>

                  {/* Featured Assets Carousel */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mb-16 max-w-2xl mx-auto"
                  >
                    <Swiper
                      effect={"cards"}
                      grabCursor={true}
                      modules={[EffectCards, Autoplay]}
                      autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                      }}
                      className="h-64 w-full"
                    >
                      {data?.gold?.slice(0, 5).map((item, index) => (
                        <SwiperSlide key={index}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            onClick={() => {
                              setSelectedAsset(item);
                              setActiveTab("gold");
                            }}
                            className={`h-full rounded-2xl p-6 text-center flex flex-col justify-center cursor-pointer bg-gradient-to-br ${getAssetColor(item.symbol)} shadow-lg`}
                          >
                            <h3 className="text-2xl font-bold text-white mb-2">{item.name}</h3>
                            <div className="text-4xl font-bold text-white mb-3">
                              {formatPrice(item.price)}
                            </div>
                            <div className={`text-lg ${item.change_percent >= 0 ? 'text-emerald-200' : 'text-rose-200'}`}>
                              {getChangeIcon(item.change_percent)} {item.change_percent}%
                            </div>
                          </motion.div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </motion.div>

                  {/* Market Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                      className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 shadow-lg backdrop-blur-sm"
                    >
                      <h3 className="text-xl font-bold text-amber-300 mb-4 flex items-center">
                        <FiDollarSign className="ml-2" /> طلای برتر
                      </h3>
                      <div className="space-y-4">
                        {data?.gold?.slice(0, 3).map((item) => (
                          <div 
                            key={item.symbol}
                            onClick={() => {
                              setSelectedAsset(item);
                              setActiveTab("gold");
                            }}
                            className="flex justify-between items-center py-3 px-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition cursor-pointer"
                          >
                            <div>
                              <h4 className="font-medium text-gray-200">{item.name}</h4>
                              <p className="text-xs text-gray-500">{item.name_en}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-amber-400">
                                {formatPrice(item.price)} <span className="text-xs text-gray-400">{item.unit}</span>
                              </div>
                              <div className={`text-sm ${getChangeColor(item.change_percent)}`}>
                                {getChangeIcon(item.change_percent)} {item.change_percent}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 shadow-lg backdrop-blur-sm"
                    >
                      <h3 className="text-xl font-bold text-emerald-300 mb-4 flex items-center">
                        <FiGlobe className="ml-2" /> ارزهای جهانی
                      </h3>
                      <div className="space-y-4">
                        {data?.currency?.slice(0, 3).map((item) => (
                          <div 
                            key={item.symbol}
                            onClick={() => {
                              setSelectedAsset(item);
                              setActiveTab("currency");
                            }}
                            className="flex justify-between items-center py-3 px-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition cursor-pointer"
                          >
                            <div>
                              <h4 className="font-medium text-gray-200">{item.name}</h4>
                              <p className="text-xs text-gray-500">{item.name_en}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-emerald-400">
                                {formatPrice(item.price)} <span className="text-xs text-gray-400">{item.unit}</span>
                              </div>
                              <div className={`text-sm ${getChangeColor(item.change_percent)}`}>
                                {getChangeIcon(item.change_percent)} {item.change_percent}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 }}
                      className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 shadow-lg backdrop-blur-sm"
                    >
                      <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center">
                        <FiPieChart className="ml-2" /> رمزارزها
                      </h3>
                      <div className="space-y-4">
                        {data?.cryptocurrency?.slice(0, 3).map((item) => (
                          <div 
                            key={item.symbol}
                            onClick={() => {
                              setSelectedAsset(item);
                              setActiveTab("crypto");
                            }}
                            className="flex justify-between items-center py-3 px-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition cursor-pointer"
                          >
                            <div>
                              <h4 className="font-medium text-gray-200">{item.name}</h4>
                              <p className="text-xs text-gray-500">{item.name_en}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-purple-400">
                                {formatPrice(item.price)} <span className="text-xs text-gray-400">{item.unit}</span>
                              </div>
                              <div className={`text-sm ${getChangeColor(item.change_percent)}`}>
                                {getChangeIcon(item.change_percent)} {item.change_percent}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Market Trends */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 shadow-xl backdrop-blur-sm mb-16"
                  >
                    <h2 className="text-2xl font-bold text-amber-300 mb-6 flex items-center">
                      <FiActivity className="ml-2" /> روند بازار
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-bold text-gray-300 mb-4">بهترین عملکردها</h3>
                        <div className="space-y-3">
                          {[...data?.gold, ...data?.currency, ...data?.cryptocurrency]
                            .filter(item => item.change_percent > 0)
                            .sort((a, b) => b.change_percent - a.change_percent)
                            .slice(0, 3)
                            .map((item, index) => (
                              <motion.div
                                key={item.symbol}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.3 + index * 0.1 }}
                                className="flex justify-between items-center py-2 px-4 rounded-lg bg-gray-700/30"
                              >
                                <div className="flex items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${getAssetColor(item.symbol)} mr-3`}>
                                    <span className="text-white text-xs font-bold">
                                      {item.symbol.substring(0, 2)}
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-200">{item.name}</h4>
                                    <p className="text-xs text-gray-500">{item.symbol}</p>
                                  </div>
                                </div>
                                <div className="text-emerald-400 font-bold">
                                  +{item.change_percent}%
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-300 mb-4">ضعیف‌ترین عملکردها</h3>
                        <div className="space-y-3">
                          {[...data?.gold, ...data?.currency, ...data?.cryptocurrency]
                            .filter(item => item.change_percent < 0)
                            .sort((a, b) => a.change_percent - b.change_percent)
                            .slice(0, 3)
                            .map((item, index) => (
                              <motion.div
                                key={item.symbol}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.3 + index * 0.1 }}
                                className="flex justify-between items-center py-2 px-4 rounded-lg bg-gray-700/30"
                              >
                                <div className="flex items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${getAssetColor(item.symbol)} mr-3`}>
                                    <span className="text-white text-xs font-bold">
                                      {item.symbol.substring(0, 2)}
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-200">{item.name}</h4>
                                    <p className="text-xs text-gray-500">{item.symbol}</p>
                                  </div>
                                </div>
                                <div className="text-rose-400 font-bold">
                                  {item.change_percent}%
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {activeTab === "gold" && data && (
                <div>
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold mb-8 text-amber-300 flex items-center"
                  >
                    <FiDollarSign className="ml-2" /> بازار طلا و سکه
                  </motion.h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredGold?.map((item, index) => (
                      <motion.div
                        key={item.symbol}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedAsset(item)}
                        className={`bg-gradient-to-br ${getAssetColor(item.symbol)} rounded-xl p-5 shadow-lg hover:shadow-xl cursor-pointer transition-all`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-white">{item.name}</h3>
                            <p className="text-sm text-white/80">{item.name_en}</p>
                          </div>
                          <div className="text-left">
                            <div className="text-xl font-bold text-white">
                              {formatPrice(item.price)} <span className="text-xs text-white/80">{item.unit}</span>
                            </div>
                            <div className={`text-sm ${item.change_percent >= 0 ? 'text-emerald-200' : 'text-rose-200'} flex items-center mt-1`}>
                              {getChangeIcon(item.change_percent)} 
                              <span className="mr-1">{item.change_percent}%</span>
                              <span className="text-xs block text-white/70">({formatPrice(Math.abs(item.change_value))})</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "currency" && data && (
                <div>
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold mb-8 text-emerald-300 flex items-center"
                  >
                    <FiGlobe className="ml-2" /> ارزهای جهانی
                  </motion.h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredCurrency?.map((item, index) => (
                      <motion.div
                        key={item.symbol}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedAsset(item)}
                        className={`bg-gradient-to-br ${getAssetColor(item.symbol)} rounded-xl p-5 shadow-lg hover:shadow-xl cursor-pointer transition-all`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-white">{item.name}</h3>
                            <p className="text-sm text-white/80">{item.name_en}</p>
                          </div>
                          <div className="text-left">
                            <div className="text-xl font-bold text-white">
                              {formatPrice(item.price)} <span className="text-xs text-white/80">{item.unit}</span>
                            </div>
                            <div className={`text-sm ${item.change_percent >= 0 ? 'text-emerald-200' : 'text-rose-200'} flex items-center mt-1`}>
                              {getChangeIcon(item.change_percent)} 
                              <span className="mr-1">{item.change_percent}%</span>
                              <span className="text-xs block text-white/70">({formatPrice(Math.abs(item.change_value))})</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "crypto" && data && (
                <div>
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold mb-8 text-purple-300 flex items-center"
                  >
                    <FiPieChart className="ml-2" /> بازار رمزارزها
                  </motion.h2>
                  <div className="overflow-x-auto">
                    <table className="w-full bg-gray-800/50 rounded-xl border border-gray-700 shadow-lg backdrop-blur-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="py-4 px-6 text-right text-gray-300 font-bold">رمزارز</th>
                          <th className="py-4 px-6 text-right text-gray-300 font-bold">قیمت</th>
                          <th className="py-4 px-6 text-right text-gray-300 font-bold">تغییرات</th>
                          <th className="py-4 px-6 text-right text-gray-300 font-bold">توضیحات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCrypto?.map((item, index) => (
                          <motion.tr
                            key={item.symbol}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.03 }}
                            whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.5)" }}
                            className="border-b border-gray-700 cursor-pointer"
                            onClick={() => setSelectedAsset(item)}
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${getAssetColor(item.symbol)} mr-3`}>
                                  <span className="text-white text-xs font-bold">
                                    {item.symbol.substring(0, 2)}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-gray-200 font-medium">{item.name}</p>
                                  <p className="text-gray-500 text-sm">{item.name_en}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-gray-200 font-medium">
                              {formatPrice(item.price)} <span className="text-gray-500 text-sm">{item.unit}</span>
                            </td>
                            <td className={`py-4 px-6 ${getChangeColor(item.change_percent)}`}>
                              {getChangeIcon(item.change_percent)} {item.change_percent}%
                            </td>
                            <td className="py-4 px-6 text-gray-400 text-sm max-w-xs">
                              {item.description}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "analytics" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-800/50 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-gray-700 backdrop-blur-sm"
                >
                  <motion.h2 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold mb-6 text-amber-300"
                  >
                    تحلیل بازار
                  </motion.h2>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6 text-gray-300"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-amber-200 mb-3">روند کلی بازار</h3>
                      <div className="h-64 bg-gray-700/50 rounded-xl border border-gray-600 flex items-center justify-center">
                        <p className="text-gray-400">نمودار تحلیل بازار در اینجا نمایش داده می‌شود</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-bold text-emerald-200 mb-3">دارایی‌های در حال رشد</h3>
                        <div className="space-y-3">
                          {[...data?.gold, ...data?.currency, ...data?.cryptocurrency]
                            .filter(item => item.change_percent > 0)
                            .sort((a, b) => b.change_percent - a.change_percent)
                            .slice(0, 3)
                            .map((item, index) => (
                              <motion.div
                                key={item.symbol}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="flex justify-between items-center py-3 px-4 rounded-lg bg-gray-700/30"
                              >
                                <div className="flex items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${getAssetColor(item.symbol)} mr-3`}>
                                    <span className="text-white text-xs font-bold">
                                      {item.symbol.substring(0, 2)}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-200">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.symbol}</p>
                                  </div>
                                </div>
                                <div className="text-emerald-400 font-bold">
                                  +{item.change_percent}%
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-rose-200 mb-3">دارایی‌های در حال افت</h3>
                        <div className="space-y-3">
                          {[...data?.gold, ...data?.currency, ...data?.cryptocurrency]
                            .filter(item => item.change_percent < 0)
                            .sort((a, b) => a.change_percent - b.change_percent)
                            .slice(0, 3)
                            .map((item, index) => (
                              <motion.div
                                key={item.symbol}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="flex justify-between items-center py-3 px-4 rounded-lg bg-gray-700/30"
                              >
                                <div className="flex items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${getAssetColor(item.symbol)} mr-3`}>
                                    <span className="text-white text-xs font-bold">
                                      {item.symbol.substring(0, 2)}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-200">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.symbol}</p>
                                  </div>
                                </div>
                                <div className="text-rose-400 font-bold">
                                  {item.change_percent}%
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Asset Detail Modal */}
        <AnimatePresence>
          {selectedAsset && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedAsset(null)}
                className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 rounded-2xl shadow-2xl bg-gradient-to-br ${getAssetColor(selectedAsset.symbol)}`}
              >
                <button 
                  onClick={() => setSelectedAsset(null)}
                  className="absolute top-4 left-4 text-white/80 hover:text-white text-2xl"
                >
                  <FiX />
                </button>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedAsset.name}</h3>
                  <p className="text-white/80 mb-6">{selectedAsset.name_en}</p>
                  <div className="text-4xl font-bold text-white mb-4">
                    {formatPrice(selectedAsset.price)} <span className="text-lg text-white/80">{selectedAsset.unit}</span>
                  </div>
                  <div className={`text-xl ${selectedAsset.change_percent >= 0 ? 'text-emerald-200' : 'text-rose-200'} mb-6`}>
                    {getChangeIcon(selectedAsset.change_percent)} {selectedAsset.change_percent}% ({formatPrice(Math.abs(selectedAsset.change_value))})
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-white/90">
                    <div className="bg-white/10 p-3 rounded-lg">
                      <div className="text-xs mb-1">نماد</div>
                      <div className="font-bold">{selectedAsset.symbol}</div>
                    </div>
                    <div className="bg-white/10 p-3 rounded-lg">
                      <div className="text-xs mb-1">تاریخ بروزرسانی</div>
                      <div className="font-bold">{selectedAsset.date} - {selectedAsset.time}</div>
                    </div>
                  </div>
                  {selectedAsset.description && (
                    <div className="mt-6 p-4 bg-white/10 rounded-lg text-white/90 text-sm">
                      {selectedAsset.description}
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="hidden lg:block bg-gray-900/80 backdrop-blur-md py-8 mt-12 border-t border-gray-700/50"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-bold text-amber-300 mb-4">نرخستان</h3>
                <p className="text-gray-400 text-sm">
                  ارائه دقیق‌ترین اطلاعات بازار طلا و ارز به صورت لحظه‌ای با رابط کاربری پیشرفته
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-300 mb-4">دسترسی سریع</h3>
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <button 
                        onClick={() => setActiveTab(item.id)}
                        className="text-gray-400 hover:text-amber-300 text-sm transition"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-300 mb-4">تماس با ما</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>اردبیل</li>
                  <li>045-33716917</li>
                  <li>ipalweb@gmail.com</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-300 mb-4">خبرنامه</h3>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="ایمیل شما"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-r-lg px-4 py-2 text-gray-300 placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-l-lg text-sm transition">
                    عضویت
                  </button>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700/50 mt-8 pt-6 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Ipal سامانه رصد قیمت طلا و ارز. تمامی  حقوق محفوظ است.   طراحی شده توسط تیم 
              طراحی شده توسط تیم Ipal
            </div>
          </div>
        </motion.footer>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md z-50 border-t border-gray-700/50">
          <div className="flex justify-around">
            {navItems.slice(0, 4).map((item) => (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center p-3 text-xs ${activeTab === item.id ? 'text-amber-400' : 'text-gray-400'}`}
              >
                <motion.div
                  animate={activeTab === item.id ? { scale: 1.2 } : { scale: 1 }}
                  className="text-lg mb-1"
                >
                  {item.icon}
                </motion.div>
                {item.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </ParallaxProvider>
  );
}

export default App;