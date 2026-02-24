import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiUrl } from "../config/api";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    user_type: "indian",
    interests: []
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
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await fetch(apiUrl("/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      // Handle backend errors
      if (!response.ok || result.error) {
        setError(result.error || result.detail || "Login failed");
        return;
      }

      // Success
      localStorage.setItem("access_token", result.access_token);
      localStorage.setItem("currentUser", JSON.stringify(result));

      setSuccessMessage(`Welcome ${result.name}! Redirecting...`);

      setTimeout(() => {
        navigate("/explore");
      }, 1500);

    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md bg-gray-900 border border-gold/30 rounded-lg p-8 shadow-2xl"
      >
        <h2 className="text-3xl text-white font-bold text-center mb-6">
          {isSignup ? "Create Account" : "Login"}
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-500/20 text-green-300 p-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-600"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-600"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-600"
          />

          {isSignup && (
            <>
              <select
                name="user_type"
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-600"
              >
                <option value="indian">Indian</option>
                <option value="foreigner">Foreigner</option>
                <option value="student">Student</option>
              </select>

              <div className="grid grid-cols-2 gap-2">
                {interestOptions.map(i => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => toggleInterest(i)}
                    className={`py-2 rounded text-sm ${
                      formData.interests.includes(i)
                        ? "bg-gold text-black"
                        : "bg-gray-800 text-gray-300 border border-gray-600"
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-black py-3 rounded font-bold"
          >
            {loading
              ? "Processing..."
              : isSignup
                ? "Create Account"
                : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-gold ml-2"
          >
            {isSignup ? "Login" : "Create Account"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
