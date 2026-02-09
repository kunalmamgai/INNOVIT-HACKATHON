import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    user_type: "indian",
    interests: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error);
      } else {
        // Save user to localStorage
        localStorage.setItem("currentUser", JSON.stringify(result));
        // Notify the app about the new login so UI updates immediately
        try {
          window.dispatchEvent(new CustomEvent('user-logged-in', { detail: result }));
        } catch (e) {
          // ignore
        }
        setSuccessMessage(`Welcome ${result.name}! Redirecting...`);
        
        setTimeout(() => {
          navigate("/explore");
        }, 2000);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError('Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-900 border border-gold/30 rounded-lg p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Delhi Heritage</h1>
            <p className="text-gold text-lg">Explore & Book Tours</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/20 border border-red-600 text-red-300 p-3 rounded mb-6"
            >
              {error}
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-500/20 border border-green-600 text-green-300 p-3 rounded mb-6"
            >
              {successMessage}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-white font-bold mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={'Your full name'}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-600 focus:border-gold outline-none transition"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-white font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={'your@email.com'}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-600 focus:border-gold outline-none transition"
              />
            </div>

            {/* User Type */}
            <div>
              <label className="block text-white font-bold mb-2">I am a</label>
              <select
                name="user_type"
                value={formData.user_type}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-600 focus:border-gold outline-none transition"
              >
                  <option value="indian">Indian National</option>
                  <option value="foreigner">International Tourist</option>
                  <option value="student">Student</option>
              </select>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-white font-bold mb-3">
                Interests (Optional)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {interestOptions.map((interest) => (
                  <motion.button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`py-2 px-3 rounded text-sm font-medium transition ${
                      formData.interests.includes(interest)
                        ? "bg-gold text-gray-800"
                        : "bg-gray-800 text-gray-300 border border-gray-600"
                    }`}
                  >
                    {interest}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 rounded font-bold text-lg transition ${
                loading
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gold text-gray-800 hover:bg-gold/90"
              }`}
            >
              {loading ? 'Logging in...' : 'Login & Explore'}
            </motion.button>
          </form>

          {/* Info */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Your login data is securely stored. You can book tours and manage your bookings.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
