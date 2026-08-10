import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion'
import { apiUrl } from "../config/api";
import { exportTicketPdf, exportItineraryPdf } from "../utils/pdfExport";

export default function Explore({ currentUser: propUser }) {
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingBooking, setPendingBooking] = useState(null);
  const [bookingData, setBookingData] = useState({
    visit_date: "",
    num_tickets: 1,
    ticket_type: "indian",
    tour_type: ""
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholder: "",
    payment_method: "card",
    upiId: ""
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [recommendations, setRecommendations] = useState([]);
  const [lastPayment, setLastPayment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load places
    fetch(apiUrl("/places"))
      .then((res) => res.json())
      .then((data) => {
        const placesArray = Array.isArray(data)
          ? data
          : Object.entries(data).map(([key, value]) => ({ ...value, key }));
        setPlaces(placesArray);
      })
      .catch((err) => console.error(err));

    // FIX: propUser from App.jsx is the parsed object, localStorage value is a JSON string
    // Prefer propUser (already parsed) then fall back to localStorage
    if (propUser && typeof propUser === 'object') {
      setCurrentUser(propUser);
    } else {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem("currentUser");
        }
      }
    }
  }, [propUser]);

  const showMessage = (msg, type = "info") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const fetchRecommendations = async () => {
    if (!currentUser) {
      showMessage("You need to login first", "error");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(apiUrl("/recommend"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ time: 6 }),
      });

      const data = await response.json();

      if (data.error) {
        showMessage(data.error, "error");
      } else {
        setRecommendations(data);
      }
    } catch (err) {
      console.error(err);
      showMessage("Failed to fetch recommendations", "error");
    }
  };

  const handleBookingSubmit = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (!bookingData.visit_date) {
      showMessage('Please select a visit date', "error");
      return;
    }

    try {
      // FIX: include Authorization header using access_token (matches api.js / backend auth)
      const token = localStorage.getItem("access_token");
      const response = await fetch(apiUrl("/bookings"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          user_id: currentUser.user_id,
          place_key: selectedPlace.key || selectedPlace.name.toLowerCase().replace(/\s+/g, "_"),
          visit_date: bookingData.visit_date,
          num_tickets: parseInt(bookingData.num_tickets),
          ticket_type: bookingData.ticket_type,
        }),
      });

      const result = await response.json();

      if (result.error) {
        showMessage(`Booking Error: ${result.error}`, "error");
      } else {
        setPendingBooking(result);
        setShowBookingForm(false);
        setShowPaymentForm(true);
        showMessage('Booking created! Now proceed to payment.', "success");
      }
    } catch (err) {
      console.error("Booking error:", err);
      showMessage('Failed to create booking. Please try again.', "error");
    }
  };

  const handlePaymentSubmit = async () => {
    if (!pendingBooking) {
      showMessage('No pending booking found', "error");
      return;
    }

    const method = paymentData.payment_method || "card";

    if (method === "card") {
      if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholder) {
        showMessage('Please fill in all card details', "error");
        return;
      }
      if (paymentData.cardNumber.replace(/\s/g, "").length !== 16) {
        showMessage('Card number must be 16 digits', "error");
        return;
      }
      if (paymentData.cvv.length !== 3) {
        showMessage('CVV must be 3 digits', "error");
        return;
      }
    } else if (method === "upi") {
      if (!paymentData.upiId || !paymentData.upiId.includes("@")) {
        showMessage('Please enter a valid UPI ID (e.g., name@bank)', "error");
        return;
      }
    }

    try {
      const token = localStorage.getItem("access_token");
      const body = {
        booking_id: pendingBooking.booking_id,
        user_id: currentUser.user_id,
        amount: pendingBooking.total_price,
        payment_method: method,
      };
      if (method === "upi") body.upi_id = paymentData.upiId;

      const response = await fetch(apiUrl("/payments"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.error) {
        showMessage(`Payment Error: ${result.error}`, "error");
      } else {
        showMessage(`✓ Payment Successful! Payment ID: ${result.payment_id}`, "success");
        setLastPayment({ booking: pendingBooking, payment: result });
        setShowPaymentForm(false);
        setPendingBooking(null);
        setBookingData({ visit_date: "", num_tickets: 1, ticket_type: "indian", tour_type: "" });
        setPaymentData({ cardNumber: "", expiryDate: "", cvv: "", cardholder: "", payment_method: "card", upiId: "" });
        setSelectedPlace(null);
      }
    } catch (err) {
      console.error("Payment error:", err);
      showMessage('Failed to process payment. Please try again.', "error");
    }
  };

  if (!places.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-black mb-4">Explore India Heritage</h1>
        <p className="text-gray-300">Loading monuments...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">Explore India Heritage</h1>
      <p className="text-gray-300 mb-8">
        {currentUser
          ? `Welcome, ${currentUser.name}! Click on any monument to learn more and book a tour.`
          : 'Explore monuments — login to book and reserve tours.'}
      </p>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded text-white ${messageType === "error" ? "bg-red-600" : messageType === "success" ? "bg-green-600" : "bg-blue-600"
            }`}
        >
          {message}
        </motion.div>
      )}

      {lastPayment && (
        <div className="mb-6 p-6 rounded-lg border border-gold/40 bg-gray-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gold">🎉 Payment Successful!</h2>
            <p className="text-gray-300 text-sm mt-1">
              {lastPayment.booking.place_name} · {lastPayment.booking.num_tickets} ticket(s) ·{' '}
              <span className="text-gold font-semibold">₹{lastPayment.payment.amount}</span>
            </p>
            <p className="text-gray-400 text-xs mt-1">Booking ID: {lastPayment.booking.booking_id}</p>
          </div>
          <button
            onClick={() => exportTicketPdf(lastPayment)}
            className="bg-gold text-gray-900 px-5 py-3 rounded font-bold hover:bg-gold/90 transition"
          >
            📄 Download Ticket PDF
          </button>
        </div>
      )}

      {currentUser ? (
        <div className="mb-8">
          <button
            onClick={fetchRecommendations}
            className="bg-gold text-gray-800 px-6 py-3 rounded font-bold hover:bg-gold/90 transition"
          >
            Recommended for You
          </button>
          {recommendations.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <h2 className="text-2xl font-bold">Your Personalized Recommendations</h2>
                <button
                  onClick={() => exportItineraryPdf({ places: recommendations, userName: currentUser?.name })}
                  className="bg-gray-800 text-gold border border-gold/40 px-4 py-2 rounded font-semibold hover:bg-gray-700 transition"
                >
                  📄 Export Itinerary PDF
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((p) => (
                  <motion.div
                    key={p.key || p.name}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedPlace(p)}
                    className="relative group h-64 rounded-lg overflow-hidden shadow-lg cursor-pointer border border-gold/30 hover:shadow-2xl transition"
                  >
                    <img
                      src={p.image || "/assets/placeholder-image.svg"}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      onError={(e) => { e.target.src = "/assets/placeholder-image.svg"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 group-hover:opacity-50 transition" />
                    <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{p.name}</h3>
                      <p className="text-sm text-gray-300 mb-3">{p.cluster}</p>
                      <button className="w-full bg-gold text-gray-800 px-4 py-2 rounded font-medium hover:bg-gold/90 transition text-sm">
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-300 mb-8">For personalized recommendations. Please Login!</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {places.map((p) => (
          <motion.div
            key={p.key || p.name}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedPlace(p)}
            className="relative group h-64 rounded-lg overflow-hidden shadow-lg cursor-pointer border border-gold/30 hover:shadow-2xl transition"
          >
            <img
              src={p.image || "/assets/placeholder-image.svg"}
              alt={p.name}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              onError={(e) => { e.target.src = "/assets/placeholder-image.svg"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 group-hover:opacity-50 transition" />
            <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
              <h3 className="text-xl font-bold mb-1">{p.name}</h3>
              <p className="text-sm text-gray-300 mb-3">{p.cluster}</p>
              <button className="w-full bg-gold text-gray-800 px-4 py-2 rounded font-medium hover:bg-gold/90 transition text-sm">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Place Detail Modal */}
      {selectedPlace && !showBookingForm && !showPaymentForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPlace(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPlace.image || "/assets/placeholder-image.svg"}
              alt={selectedPlace.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <button onClick={() => setSelectedPlace(null)} className="float-right text-gray-400 hover:text-white text-2xl mb-4">✕</button>
              <h2 className="text-4xl font-bold text-white mb-2 clear-both">{selectedPlace.name}</h2>
              <p className="text-gold text-lg mb-4">{selectedPlace.cluster}</p>

              {selectedPlace.description && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">About</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedPlace.description}</p>
                </div>
              )}

              {selectedPlace.year_built && (
                <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-800 p-4 rounded">
                  <div>
                    <p className="text-gray-400 text-sm">Built</p>
                    <p className="text-white font-bold">{selectedPlace.year_built}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Category</p>
                    <p className="text-white font-bold">{selectedPlace.category || "Monument"}</p>
                  </div>
                </div>
              )}

              {selectedPlace.tickets && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-3">Ticket Prices</h3>
                  <div className="space-y-2">
                    {Object.entries(selectedPlace.tickets).map(([type, price]) => (
                      <div key={type} className="flex justify-between bg-gray-800 p-3 rounded">
                        <span className="text-gray-300 capitalize">{type}</span>
                        <span className="text-white font-bold">₹{price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setBookingData((prev) => ({ ...prev, tour_type: "AR/VR" }));
                    setShowBookingForm(true);
                  }}
                  className="bg-gold text-gray-800 px-4 py-3 rounded font-bold text-lg hover:bg-gold/90 transition"
                >
                  Book AR/VR Tour
                </button>
                <button
                  onClick={() => {
                    setBookingData((prev) => ({ ...prev, tour_type: "Virtual" }));
                    setShowBookingForm(true);
                  }}
                  className="bg-gold text-gray-800 px-4 py-3 rounded font-bold text-lg hover:bg-gold/90 transition"
                >
                  Book Virtual Tour
                </button>
              </div>
              <button
                onClick={() => setSelectedPlace(null)}
                className="mt-3 w-full bg-gray-700 text-white px-4 py-3 rounded font-bold text-lg hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && selectedPlace && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowBookingForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-gray-900 rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setShowBookingForm(false)} className="float-right text-gray-400 hover:text-white text-2xl mb-4">✕</button>
            <h2 className="text-3xl font-bold text-white mb-2 clear-both">Book Tour — {selectedPlace.name}</h2>
            {bookingData.tour_type && (
              <p className="text-gold font-semibold mb-6">Tour Type: {bookingData.tour_type}</p>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2 font-bold">Visit Date</label>
                <input
                  type="date"
                  value={bookingData.visit_date}
                  onChange={(e) => setBookingData({ ...bookingData, visit_date: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-bold">Ticket Type</label>
                <select
                  value={bookingData.ticket_type}
                  onChange={(e) => setBookingData({ ...bookingData, ticket_type: e.target.value })}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:border-gold outline-none"
                >
                  {selectedPlace.tickets && Object.keys(selectedPlace.tickets).map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)} — ₹{selectedPlace.tickets[type]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white mb-2 font-bold">Number of Tickets</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={bookingData.num_tickets}
                  onChange={(e) => setBookingData({ ...bookingData, num_tickets: e.target.value })}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:border-gold outline-none"
                />
              </div>

              {selectedPlace.tickets && (
                <div className="bg-gray-800 p-4 rounded">
                  <p className="text-gray-300">Total Price:</p>
                  <p className="text-2xl font-bold text-gold">
                    ₹{(selectedPlace.tickets[bookingData.ticket_type] || 0) * bookingData.num_tickets}
                  </p>
                </div>
              )}

              <button onClick={handleBookingSubmit} className="w-full bg-gold text-gray-800 px-4 py-3 rounded font-bold text-lg hover:bg-gold/90 transition">
                ✓ Continue to Payment
              </button>
              <button onClick={() => setShowBookingForm(false)} className="w-full bg-gray-700 text-white px-4 py-3 rounded font-bold text-lg hover:bg-gray-600 transition">
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Payment Form Modal */}
      {showPaymentForm && pendingBooking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPaymentForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-gray-900 rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setShowPaymentForm(false)} className="float-right text-gray-400 hover:text-white text-2xl mb-4">✕</button>
            <h2 className="text-3xl font-bold text-white mb-2 clear-both">Payment</h2>
            <p className="text-gray-400 mb-6">Booking ID: {pendingBooking.booking_id}</p>

            <div className="bg-gray-800 p-4 rounded mb-6 border border-gold">
              <p className="text-gray-300 text-sm mb-1">Amount to Pay:</p>
              <p className="text-3xl font-bold text-gold">₹{pendingBooking.total_price}</p>
              <p className="text-gray-400 text-xs mt-2">{pendingBooking.place_name} — {pendingBooking.num_tickets} ticket(s)</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2 font-bold text-sm">Payment Method</label>
                <select
                  value={paymentData.payment_method}
                  onChange={(e) => setPaymentData({ ...paymentData, payment_method: e.target.value })}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:border-gold outline-none text-sm"
                >
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                </select>
              </div>

              {paymentData.payment_method === "card" && (
                <>
                  <div>
                    <label className="block text-white mb-2 font-bold text-sm">Full Name on Card</label>
                    <input
                      type="text"
                      value={paymentData.cardholder}
                      onChange={(e) => setPaymentData({ ...paymentData, cardholder: e.target.value })}
                      placeholder="Full name on card"
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:border-gold outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2 font-bold text-sm">Card Number</label>
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:border-gold outline-none text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2 font-bold text-sm">Expiry Date</label>
                      <input
                        type="text"
                        value={paymentData.expiryDate}
                        onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                        placeholder="12/25"
                        maxLength="5"
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:border-gold outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2 font-bold text-sm">CVV</label>
                      <input
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                        placeholder="123"
                        maxLength="3"
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:border-gold outline-none text-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentData.payment_method === "upi" && (
                <div>
                  <label className="block text-white mb-2 font-bold text-sm">UPI ID</label>
                  <input
                    type="text"
                    value={paymentData.upiId}
                    onChange={(e) => setPaymentData({ ...paymentData, upiId: e.target.value })}
                    placeholder="example@bank"
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:border-gold outline-none text-sm"
                  />
                </div>
              )}

              <button onClick={handlePaymentSubmit} className="w-full bg-green-600 text-white px-4 py-3 rounded font-bold hover:bg-green-700 transition mb-2">
                💳 Pay ₹{pendingBooking.total_price}
              </button>
              <button
                onClick={() => { setShowPaymentForm(false); setShowBookingForm(true); }}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded font-bold hover:bg-gray-600 transition"
              >
                Back to Booking
              </button>
            </div>

            <p className="text-gray-400 text-xs mt-4 text-center">🔒 Payment is secure and processed safely</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
