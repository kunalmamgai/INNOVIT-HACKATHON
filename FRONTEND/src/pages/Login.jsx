import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { apiUrl } from "../config/api";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ENHANCEMENT: show/hide password

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    user_type: "indian",
    interests: [],
  });

  const navigate = useNavigate();

  const interestOptions = [
    "History",
    "Architecture",
    "Religion",
    "Culture",
    "Art",
    "Museums",
    "Nature",
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  // FIX: reset all form state when switching between login/signup
  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    setFormData({ name: "", email: "", password: "", user_type: "indian", interests: [] });
    setError("");
    setSuccessMessage("");
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // ENHANCEMENT: client-side password length check
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isSignup ? "/signup" : "/login";

      const payload = isSignup
        ? formData
        : {
          email: formData.email,
          password: formData.password,
        };

      const response = await fetch(apiUrl(endpoint), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        setError(result.error || result.detail || "Authentication failed");
        return;
      }

      if (!isSignup) {
        // FIX: save token under "access_token" (matches apiFetch in api.js)
        localStorage.setItem("access_token", result.access_token);
        localStorage.setItem("currentUser", JSON.stringify(result));

        // FIX: fire the event so Navbar updates immediately without page refresh
        window.dispatchEvent(new CustomEvent("user-logged-in", { detail: result }));

        setSuccessMessage(`Welcome ${result.name}! Redirecting...`);

        setTimeout(() => {
          navigate("/explore");
        }, 1200);
      } else {
        setSuccessMessage("Account created successfully! Please log in.");
        // Switch to login mode after a brief moment so user sees the success message
        setTimeout(() => {
          toggleMode();
        }, 1500);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-8">
      <motion.div
        key={isSignup ? "signup" : "login"}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md bg-gray-900 border border-gold/30 rounded-lg p-8 shadow-2xl"
      >
        <h2 className="text-3xl text-white font-bold text-center mb-6">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/20 text-red-300 p-3 rounded mb-4 text-sm"
            >
              {error}
            </motion.div>
          )}
          {successMessage && (
            <motion.div
              key="success"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-green-500/20 text-green-300 p-3 rounded mb-4 text-sm"
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name — signup only */}
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-600 focus:outline-none focus:border-gold/60 transition-colors"
            />
          )}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-600 focus:outline-none focus:border-gold/60 transition-colors"
          />

          {/* Password with show/hide toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 text-white px-4 py-3 pr-12 rounded border border-gray-600 focus:outline-none focus:border-gold/60 transition-colors"
            />
            {/* ENHANCEMENT: show/hide password toggle */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm transition-colors"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Signup-only fields */}
          {isSignup && (
            <>
              <select
                name="user_type"
                value={formData.user_type}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-600 focus:outline-none focus:border-gold/60 transition-colors"
              >
                <option value="indian">Indian</option>
                <option value="foreigner">Foreigner</option>
                <option value="student">Student</option>
              </select>

              <div>
                <p className="text-gray-400 text-xs mb-2">
                  Select your interests (optional)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {interestOptions.map((i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => toggleInterest(i)}
                      className={`py-2 rounded text-sm transition-colors ${formData.interests.includes(i)
                          ? "bg-gold text-black font-semibold"
                          : "bg-gray-800 text-gray-300 border border-gray-600 hover:border-gold/40"
                        }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-black py-3 rounded font-bold hover:bg-yellow-400 disabled:opacity-60 transition-colors"
          >
            {loading
              ? "Processing..."
              : isSignup
                ? "Create Account"
                : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={toggleMode}
            className="text-gold ml-2 hover:underline"
          >
            {isSignup ? "Login" : "Create Account"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}