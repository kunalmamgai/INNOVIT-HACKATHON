import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion'

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
    ticket_type: "indian"
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
  const navigate = useNavigate();
  

  useEffect(() => {
    // Load places
    fetch("http://127.0.0.1:8000/places")
      .then((res) => res.json())
      .then((data) => {
        const placesArray = Array.isArray(data) ? data : Object.entries(data).map(([key, value]) => ({
          ...value,
          key: key
        }));
        setPlaces(placesArray);
      })
      .catch((err) => console.error(err));

    // Check if user is logged in
    const savedUser = localStorage.getItem("currentUser") || propUser;
    if (savedUser) {
      if (typeof savedUser === 'string') {
        setCurrentUser(JSON.parse(savedUser));
      } else {
        setCurrentUser(savedUser);
      }
    }
  }, [propUser]);

  const showMessage = (msg, type = "info") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
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
      const response = await fetch("http://127.0.0.1:8000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        showMessage(`Payment Error: ${result.error}`, "error");
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
    // Validate based on payment method
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
      const body = {
        booking_id: pendingBooking.booking_id,
        user_id: currentUser.user_id,
        amount: pendingBooking.total_price,
        payment_method: method,
      };
      if (method === "upi") body.upi_id = paymentData.upiId;

      const response = await fetch("http://127.0.0.1:8000/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.error) {
        showMessage(`Payment Error: ${result.error}`, "error");
      } else {
        showMessage(`✓ Payment Successful! Payment ID: ${result.payment_id}`, "success");

        // Reset forms
        setShowPaymentForm(false);
        setPendingBooking(null);
        setBookingData({ visit_date: "", num_tickets: 1, ticket_type: "indian" });
        setPaymentData({ cardNumber: "", expiryDate: "", cvv: "", cardholder: "", payment_method: "card", upiId: "" });
        setSelectedPlace(null);

        setTimeout(() => {
          showMessage('Booking created! Now proceed to payment.', "success");
        }, 1000);
      }
    } catch (err) {
      console.error("Payment error:", err);
      showMessage('Failed to create booking. Please try again.', "error");
    }
  };

  // Allow exploring without login; booking will redirect to login if needed.

  if (!places.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Explore Delhi Heritage</h1>
        <p className="text-gray-300">Loading monuments...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2 text-white">Explore Delhi Heritage</h1>
      <p className="text-gray-300 mb-8">{currentUser ? `Welcome, ${currentUser.name}! Click on any monument to learn more and book a tour.` : 'Explore monuments — login to book to reserve tours.'}</p>
      
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded text-white ${
            messageType === "error" ? "bg-red-600" : messageType === "success" ? "bg-green-600" : "bg-blue-600"
          }`}
        >
          {message}
        </motion.div>
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
              src={p.image || "https://via.placeholder.com/400x300"}
              alt={p.name}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400x300?text=" + encodeURIComponent(p.name);
              }}
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
              src={selectedPlace.image || "https://via.placeholder.com/400x300"}
              alt={selectedPlace.name}
              className="w-full h-64 object-cover"
            />

            <div className="p-6">
              <button
                onClick={() => setSelectedPlace(null)}
                className="float-right text-gray-400 hover:text-white text-2xl mb-4"
              >
                ✕
              </button>

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

              <div className="flex gap-3">
                  <button
                  onClick={() => setShowBookingForm(true)}
                  className="flex-1 bg-gold text-gray-800 px-4 py-3 rounded font-bold text-lg hover:bg-gold/90 transition"
                >
                  📅 Book Tour
                </button>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="flex-1 bg-gray-700 text-white px-4 py-3 rounded font-bold text-lg hover:bg-gray-600 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

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
            <button
              onClick={() => setShowBookingForm(false)}
              className="float-right text-gray-400 hover:text-white text-2xl mb-4"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-white mb-6 clear-both">Book Tour {selectedPlace.name}</h2>

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
                      {type.charAt(0).toUpperCase() + type.slice(1)} - ₹{selectedPlace.tickets[type]}
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

              <button
                onClick={handleBookingSubmit}
                className="w-full bg-gold text-gray-800 px-4 py-3 rounded font-bold text-lg hover:bg-gold/90 transition"
              >
                ✓ Continue to Payment
              </button>

              <button
                onClick={() => setShowBookingForm(false)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded font-bold text-lg hover:bg-gray-600 transition"
              >
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
            <button
              onClick={() => setShowPaymentForm(false)}
              className="float-right text-gray-400 hover:text-white text-2xl mb-4"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-white mb-2 clear-both">Payment</h2>
            <p className="text-gray-400 mb-6">Booking ID: {pendingBooking.booking_id}</p>

            <div className="bg-gray-800 p-4 rounded mb-6 border border-gold">
              <p className="text-gray-300 text-sm mb-1">Amount to Pay:</p>
              <p className="text-3xl font-bold text-gold">₹{pendingBooking.total_price}</p>
              <p className="text-gray-400 text-xs mt-2">{pendingBooking.place_name} - {pendingBooking.num_tickets} ticket(s)</p>
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
                    <label className="block text-white mb-2 font-bold text-sm">Full name on card</label>
                    <input
                      type="text"
                      value={paymentData.cardholder}
                      onChange={(e) => setPaymentData({ ...paymentData, cardholder: e.target.value })}
                      placeholder={'Full name on card'}
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:border-gold outline-none text-sm"
                    />
                  </div>

                  <div>
                      <label className="block text-white mb-2 font-bold text-sm">1234 5678 9012 3456</label>
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                      placeholder={'1234 5678 9012 3456'}
                      maxLength="19"
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:border-gold outline-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2 font-bold text-sm">12/25</label>
                      <input
                        type="text"
                        value={paymentData.expiryDate}
                        onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                        placeholder={'12/25'}
                        maxLength="5"
                        className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:border-gold outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2 font-bold text-sm">123</label>
                      <input
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                        placeholder={'123'}
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
                    placeholder={'example@bank'}
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:border-gold outline-none text-sm"
                  />
                </div>
              )}

              <button
                onClick={handlePaymentSubmit}
                className="w-full bg-green-600 text-white px-4 py-3 rounded font-bold hover:bg-green-700 transition mb-2"
              >
                💳 Pay ₹{pendingBooking.total_price}
              </button>

              <button
                onClick={() => {
                  setShowPaymentForm(false);
                  setShowBookingForm(true);
                }}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded font-bold hover:bg-gray-600 transition"
              >
                Back to Booking
              </button>
            </div>

            <p className="text-gray-400 text-xs mt-4 text-center">
              🔒 Payment is secure and processed safely
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
