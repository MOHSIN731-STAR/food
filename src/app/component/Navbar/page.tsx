'use client';
import React, { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store/store";
import { loginUser, registerUser } from "../../redux/store/authSlice";
import { logout } from "../../redux/store/verifyOtpSlice";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const navLinks = [
    { name: "Home", to: "home", href: "/" },
    { name: "Menu", to: "menu", href: "/Menu" },
    { name: "Mobile App", to: "mobileapp" },
    { name: "Contact Us", to: "contact" },
  ];

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const dispatch = useDispatch<AppDispatch>();

  // 🔑 auth slice -> login ke baad
  
  const {  loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // 🔑 verifyOtp slice -> OTP ke baad
  const { user: verifiedUser } = useSelector(
    (state: RootState) => state.verifyOtp
  );

  const router = useRouter();

  // Popup states
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(res)) {
      setIsPopupOpen(false);

      const role = res.payload?.role || "user";
      localStorage.setItem("pendingRole", role);

      // OTP verify page par bhejna
      router.push("/component/OtpVerify");
    }
  };

  // ✅ Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(registerUser({ name, email, password }));

    if (registerUser.fulfilled.match(res)) {
      setIsLogin(true);
      setEmail("");
      setPassword("");
      setName("");
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="text-4xl font-bold cursor-pointer">
            <Image src="/logo.png" alt="Logo" width={120} height={120} />
          </div>

          {/* Links */}
          <ul className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <li key={link.to}>
                <ScrollLink
                  to={link.to}
                  smooth={true}
                  duration={500}
                  offset={-80}
                  className="cursor-pointer hover:text-[#ff4c24] transition"
                >
                  {link.name}
                </ScrollLink>
              </li>
            ))}
          </ul>

          {/* Icons & Auth */}
          <div className="flex items-center space-x-4">
            <FiSearch size={20} className="cursor-pointer hover:text-[#ff4c24]" />

            {/* Cart icon */}
            <Link
              href="/component/Cart"
              onClick={(e) => {
                if (!verifiedUser) {
                  e.preventDefault();
                  setIsPopupOpen(true);
                }
              }}
              className="relative"
            >
              <FiShoppingCart
                size={20}
                className="cursor-pointer hover:text-[#ff4c24]"
              />

              {mounted && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth buttons */}
            {mounted && (
              verifiedUser ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => dispatch(logout())}
                    className="border border-red-500 px-4 py-1 rounded-full text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsPopupOpen(true)}
                  className="border border-[#ff4c24] px-4 py-1 rounded-full hover:bg-[#ff4c24] hover:text-white"
                >
                  Sign in
                </button>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
          <div className="bg-white rounded-lg shadow-lg w-[400px] p-6 relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
              onClick={() => setIsPopupOpen(false)}
            >
              ✖
            </button>

            {/* Toggle Login/Register */}
            <div className="flex justify-center mb-4">
              <button
                className={`px-4 py-2 rounded-l-lg ${
                  isLogin ? "bg-[#ff4c24] text-white" : "bg-gray-200"
                }`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={`px-4 py-2 rounded-r-lg ${
                  !isLogin ? "bg-[#ff4c24] text-white" : "bg-gray-200"
                }`}
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </div>

            <h2 className="text-xl font-bold mb-4 text-center">
              {isLogin ? "Login" : "Register"}
            </h2>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {loading && <p className="text-gray-500 text-sm mb-2">Loading...</p>}

            {/* Form */}
            <form onSubmit={isLogin ? handleLogin : handleRegister}>
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border p-2 rounded mb-3"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border p-2 rounded mb-3"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-2 rounded mb-3"
              />

              <button
                type="submit"
                className="w-full bg-[#ff4c24] text-white py-2 rounded mb-2 hover:bg-[#e03d19]"
              >
                {isLogin ? "Login" : "Register"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
