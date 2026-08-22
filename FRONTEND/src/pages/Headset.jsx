import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { apiFetch } from '../config/api'

const products = [
  {
    id: 'vr-ultra',
    name: 'Heritage Ultra XR',
    price: 69999,
    tier: 'Ultra',
    tagline: 'Micro-OLED | Eye + Hand Tracking | 120Hz | Spatial audio',
    badges: ['Ships in 3-5 days', 'VIP onboarding'],
    image: 'https://about.fb.com/wp-content/uploads/2022/12/EOY-VR-Roundup_Header.gif',
  },
  {
    id: 'vr-pro',
    name: 'Heritage Vision Pro',
    price: 49999,
    tier: 'Pro',
    tagline: 'OLED XR | Eye + Hand Tracking | 120Hz',
    badges: ['Ships in 3-5 days', 'Free setup concierge'],
    image: 'https://static.wixstatic.com/media/d476dc_15c0d36e9748479fba781d19503ec898~mv2.gif',
  },
  {
    id: 'vr-premium',
    name: 'Cultural Studio Max',
    price: 39999,
    tier: 'Premium',
    tagline: '6DoF | Pancake lenses | Wide FOV',
    badges: ['Ships in 4-6 days', 'Creator bundle included'],
    image: 'https://www.slashgear.com/img/gallery/7-of-the-best-vr-headsets-you-can-buy-ranked-by-price/vive-focus-vision-1149-1764670070.jpg',
  },
  {
    id: 'vr-performance',
    name: 'Cultural Explorer X',
    price: 29999,
    tier: 'Performance',
    tagline: '4K per eye | Inside-out 6DoF',
    badges: ['Ships in 5-7 days', 'Starter accessories pack'],
    image: 'https://assets-prd.ignimgs.com/2023/09/29/untitled-design-2-1696014764197.png',
  },
  {
    id: 'vr-starter',
    name: 'Gateway Lite',
    price: 14999,
    tier: 'Starter',
    tagline: '90Hz | Lightweight comfort | Great for first-time VR',
    badges: ['Ships in 7-9 days', 'Includes tutorial module'],
    image: 'https://media.wired.com/photos/6738ffc6674ce2c794000dac/191:100/w_1280,c_limit/HTC-Vive-Focus-Vision-Abstract-Background-112024-SOURCE-Amazon.jpg',
  },
  {
    id: 'vr-budget',
    name: 'Pocket Heritage Viewer',
    price: 7999,
    tier: 'Budget',
    tagline: 'Mobile-powered VR | Clip-in optics',
    badges: ['Ships in 4-6 days', 'Great for classrooms'],
    image: 'https://twinreality.in/wp-content/uploads/2024/08/apple-vision-pro-features.jpg',
  },
  {
    id: 'vr-entry',
    name: 'Intro Heritage Viewer',
    price: 4999,
    tier: 'Budget',
    tagline: 'Lightweight phone-based viewer | Best for quick demos',
    badges: ['Ships in 3-5 days', 'Great for gifts'],
    image: 'https://roadtovrlive-5ea0.kxcdn.com/wp-content/uploads/2018/10/pimax-8k-5k.jpg',
  },
]

const tiers = ['All', 'Ultra', 'Pro', 'Premium', 'Performance', 'Starter', 'Budget']

// Lightweight Indian PIN-to-state lookup for autofill; extend as needed
const postalStateLookups = [
  { pattern: /^11/, state: 'Delhi' },
  { pattern: /^(12|13|14)/, state: 'Haryana' },
  { pattern: /^(15|16)/, state: 'Punjab' },
  { pattern: /^17/, state: 'Himachal Pradesh' },
  { pattern: /^(18|19)/, state: 'Jammu & Kashmir' },
  { pattern: /^(20|21|22)/, state: 'Uttar Pradesh' },
  { pattern: /^(23|24)/, state: 'Uttarakhand' },
  { pattern: /^(25|26)/, state: 'Rajasthan' },
  { pattern: /^(27|28|30|31)/, state: 'Gujarat' },
  { pattern: /^(34|35|36|37|38|39)/, state: 'Goa' },
  { pattern: /^(40|41|42|43|44)/, state: 'Maharashtra' },
  { pattern: /^(45|46|47|48)/, state: 'Madhya Pradesh' },
  { pattern: /^49/, state: 'Chhattisgarh' },
  { pattern: /^(50|51)/, state: 'Telangana' },
  { pattern: /^(52|53)/, state: 'Andhra Pradesh' },
  { pattern: /^(56|57|58|59)/, state: 'Karnataka' },
  { pattern: /^(60|61|62|63|64)/, state: 'Tamil Nadu' },
  { pattern: /^(67|68)/, state: 'Kerala' },
  { pattern: /^(69|70|71|72|73|74)/, state: 'West Bengal' },
  { pattern: /^(75|76|77)/, state: 'Odisha' },
  { pattern: /^(78)/, state: 'Assam' },
  { pattern: /^(79|80|81)/, state: 'Bihar' },
  { pattern: /^(82|83|84)/, state: 'Jharkhand' },
]

const getStateFromPostal = (postal) => {
  if (!postal || postal.length < 2) return ''
  const hit = postalStateLookups.find(({ pattern }) => pattern.test(postal))
  return hit?.state || ''
}

export default function Headset() {
  const [activeTier, setActiveTier] = useState('All')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [step, setStep] = useState('shipping')
  const [quantity, setQuantity] = useState(1)
  const [shipping, setShipping] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
  })
  const [payment, setPayment] = useState({
    method: 'card',
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardholder: '',
    upiId: '',
  })
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('info')
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastOrderId, setLastOrderId] = useState('')
  const navigate = useNavigate()

  const filteredProducts = useMemo(() => (
    activeTier === 'All' ? products : products.filter((p) => p.tier === activeTier)
  ), [activeTier])

  const total = useMemo(() => {
    if (!selectedProduct) return 0
    return Math.max(1, Number(quantity || 1)) * selectedProduct.price
  }, [selectedProduct, quantity])

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('currentUser')
      }
    }
  }, [])

  const showMessage = (msg, type = 'info') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 5000)
  }

  const startCheckout = (product) => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    setSelectedProduct(product)
    setQuantity(1)
    setShipping({ fullName: '', email: '', phone: '', address: '', city: '', state: '', postalCode: '' })
    setPayment({ method: 'card', cardNumber: '', expiry: '', cvv: '', cardholder: '', upiId: '' })
    setStep('shipping')
    setShowCheckout(true)
    setMessage('')
  }

  const validateShipping = () => {
    if (!currentUser) {
      navigate('/login')
      return false
    }
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'postalCode']
    for (const key of required) {
      if (!shipping[key]?.trim()) {
        showMessage('Please fill all shipping details', 'error')
        return false
      }
    }
    return true
  }

  const validatePayment = () => {
    const method = payment.method || 'card'
    if (method === 'card') {
      if (!payment.cardNumber || payment.cardNumber.replace(/\s/g, '').length !== 16) {
        showMessage('Card number must be 16 digits', 'error')
        return false
      }
      if (!payment.expiry) {
        showMessage('Expiry date is required', 'error')
        return false
      }
      if (!payment.cvv || payment.cvv.length !== 3) {
        showMessage('CVV must be 3 digits', 'error')
        return false
      }
      if (!payment.cardholder) {
        showMessage('Cardholder name is required', 'error')
        return false
      }
    }

    if (method === 'upi') {
      if (!payment.upiId || !payment.upiId.includes('@')) {
        showMessage('Enter a valid UPI ID (name@bank)', 'error')
        return false
      }
    }
    return true
  }

  const handlePostalChange = (value) => {
    const clean = (value || '').replace(/\D/g, '').slice(0, 6)
    const detected = getStateFromPostal(clean)
    setShipping((prev) => ({
      ...prev,
      postalCode: clean,
      state: detected || prev.state,
    }))
  }

  const handleContinueToPayment = () => {
    if (validateShipping()) setStep('payment')
  }

  const handleOrder = async () => {
    if (!selectedProduct) {
      showMessage('Select a headset first', 'error')
      return
    }
    if (!currentUser) {
      navigate('/login')
      return
    }
    if (step !== 'payment') {
      showMessage('Complete shipping first', 'error')
      return
    }
    if (!validatePayment()) return

    setIsLoading(true)
    const method = payment.method || 'card'
    const orderId = `VRH-${selectedProduct.id}-${Date.now()}`

    try {
      const res = await apiFetch('/payments', {
        method: 'POST',
        body: JSON.stringify({
          booking_id: orderId,
          user_id: currentUser.user_id,
          amount: total,
          payment_method: method,
          ...(method === 'upi' ? { upi_id: payment.upiId } : {}),
        }),
      })

      const text = await res.text()
      let result = {}
      try {
        result = text ? JSON.parse(text) : {}
      } catch (parseErr) {
        console.warn('Payment response parse failed', parseErr, text)
      }

      if (!res.ok || result.error) {
        const reason = result.error || result.message || res.statusText || 'Unknown error'
        // In dev, allow simulated success so demos are not blocked by sleeping backend
        if (import.meta.env.DEV) {
          console.warn('Payment failed in dev, simulating success:', reason)
          showMessage('Payment service unreachable; simulated success for demo.', 'success')
          setShowCheckout(false)
          setSelectedProduct(null)
          setLastOrderId(orderId)
          setShowSuccess(true)
        } else {
          showMessage(`Payment failed: ${reason}`, 'error')
        }
        return
      }

      showMessage('Order placed successfully! We have logged your payment.', 'success')
      setShowCheckout(false)
      setSelectedProduct(null)
      setLastOrderId(orderId)
      setShowSuccess(true)
    } catch (err) {
      console.error('Order error', err)
      if (import.meta.env.DEV) {
        showMessage('Payment service unreachable; simulated success for demo.', 'success')
        setShowCheckout(false)
        setSelectedProduct(null)
        setLastOrderId(orderId)
        setShowSuccess(true)
      } else {
        showMessage('Could not process order. Try again.', 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Hero banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#131a2d] to-[#0f172a] border border-gray-800 shadow-2xl p-6 md:p-8 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-300">
            <span className="px-3 py-1 rounded-full bg-gold/15 text-gold font-semibold border border-gold/30">VR Headsets</span>
            <span>VR</span><span>MR</span><span>AR</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Choose the perfect headset for immersive heritage</h1>
            <p className="text-gray-300 text-base max-w-2xl">Browse tiers like a marketplace: compare specs, see price up front, and check out fast.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl bg-gray-900/70 border border-gray-800 p-3">
              <p className="text-gray-400">Lens</p>
              <p className="text-lg font-semibold">Pancake / OLED</p>
            </div>
            <div className="rounded-xl bg-gray-900/70 border border-gray-800 p-3">
              <p className="text-gray-400">Tracking</p>
              <p className="text-lg font-semibold">Inside-out 6DoF</p>
            </div>
            <div className="rounded-xl bg-gray-900/70 border border-gray-800 p-3">
              <p className="text-gray-400">Comfort</p>
              <p className="text-lg font-semibold">Feather strap</p>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="grid lg:grid-cols-[260px,1fr] gap-6 items-start">
          {/* Filters like Amazon sidebar */}
          <div className="rounded-2xl bg-gray-900/80 border border-gray-800 p-4 space-y-4 self-start">
            <div>
              <h3 className="text-sm font-bold mb-2">Price Band</h3>
              <div className="space-y-2 text-sm text-gray-200">
                {tiers.map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setActiveTier(tier)}
                    className={`w-full text-left px-3 py-2 rounded border ${activeTier === tier ? 'border-gold text-gold bg-gold/10' : 'border-gray-800 hover:border-gold/40'}`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-800 pt-4">
              <h3 className="text-sm font-bold mb-2">Quick picks</h3>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-gray-700">Ships fast</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-gray-700">Great for demos</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-gray-700">Creator kit</span>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-4">
              <h3 className="text-sm font-bold mb-2">Support</h3>
              <p className="text-xs text-gray-300">Concierge onboarding on Pro/Ultra tiers. Classroom tips for Budget.</p>
            </div>
          </div>

          {/* Product grid */}
          <div className="rounded-2xl bg-gray-900/60 border border-gray-800 p-4">
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-gray-800 bg-gray-950 overflow-hidden shadow-lg flex flex-col"
                >
                  <div className="relative h-36">
                    <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover" onError={(e) => { e.target.src = '/assets/placeholder-image.svg' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                    <div className="absolute top-2 right-2 bg-gold text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow">₹{product.price.toLocaleString('en-IN')}</div>
                    <div className="absolute bottom-2 left-3 right-3 flex flex-wrap gap-2">
                      {product.badges.map((b) => (
                        <span key={b} className="px-2 py-1 rounded-full bg-white/10 text-white text-[11px] border border-white/20">{b}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 space-y-2 text-white flex-1">
                    <p className="text-xs uppercase tracking-wide text-gray-400">{product.tier}</p>
                    <h3 className="text-lg font-bold leading-tight">{product.name}</h3>
                    <p className="text-sm text-gray-300 line-clamp-2">{product.tagline}</p>
                  </div>
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => startCheckout(product)}
                      className="w-full py-2.5 rounded-lg bg-gold text-gray-900 font-semibold hover:bg-gold/90 transition"
                    >
                      Buy Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showCheckout && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowCheckout(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl max-w-3xl w-full overflow-hidden border border-gold/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Checkout</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedProduct.name}</h3>
              </div>
              <button onClick={() => setShowCheckout(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white text-2xl">×</button>
            </div>

            <div className="px-6 pt-4 pb-2 flex flex-wrap items-center gap-3 text-sm font-semibold">
              <button onClick={() => setStep('shipping')} className={`px-3 py-1 rounded-full border ${step === 'shipping' ? 'border-gold text-gold bg-gold/10' : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}>1. Shipping</button>
              <button disabled className="opacity-50 cursor-default">→</button>
              <button onClick={() => step === 'payment' && setStep('payment')} className={`px-3 py-1 rounded-full border ${step === 'payment' ? 'border-gold text-gold bg-gold/10' : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}>2. Payment</button>
              <div className="ml-auto text-gray-900 dark:text-white">Qty
                <input type="number" min="1" max="5" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="ml-2 w-16 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1" />
              </div>
              <div className="text-lg font-extrabold text-gold">₹{total.toLocaleString('en-IN')}</div>
            </div>

            {message && (
              <div className={`mx-6 my-2 p-3 rounded text-sm ${messageType === 'error' ? 'bg-red-100 text-red-800' : messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                {message}
              </div>
            )}

            {step === 'shipping' && (
              <div className="px-6 pb-6 grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Full Name</label>
                  <input type="text" value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Email</label>
                  <input type="email" value={shipping.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Phone</label>
                  <input type="tel" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Postal Code</label>
                  <input type="text" value={shipping.postalCode} onChange={(e) => handlePostalChange(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-2" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Address</label>
                  <textarea value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-2" rows={2} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">City</label>
                  <input type="text" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">State</label>
                  <input type="text" value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-2" />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button onClick={handleContinueToPayment} className="px-5 py-3 rounded-lg bg-gold text-gray-900 font-bold hover:bg-gold/90 transition">Continue to Payment</button>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="px-6 pb-6 space-y-4">
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3 bg-white dark:bg-gray-800">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Payment Method</p>
                  <div className="flex gap-3">
                    <button onClick={() => setPayment({ ...payment, method: 'card' })} className={`px-4 py-2 rounded-lg border ${payment.method === 'card' ? 'border-gold text-gold' : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}>Card</button>
                    <button onClick={() => setPayment({ ...payment, method: 'upi' })} className={`px-4 py-2 rounded-lg border ${payment.method === 'upi' ? 'border-gold text-gold' : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}>UPI</button>
                  </div>

                  {payment.method === 'card' && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Card Number</label>
                        <input type="text" placeholder="1234 5678 9012 3456" value={payment.cardNumber} onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Expiry</label>
                        <input type="month" value={payment.expiry} onChange={(e) => setPayment({ ...payment, expiry: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">CVV</label>
                        <input type="password" value={payment.cvv} onChange={(e) => setPayment({ ...payment, cvv: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Cardholder Name</label>
                        <input type="text" value={payment.cardholder} onChange={(e) => setPayment({ ...payment, cardholder: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-3 py-2" />
                      </div>
                    </div>
                  )}

                  {payment.method === 'upi' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">UPI ID</label>
                      <input type="text" placeholder="name@bank" value={payment.upiId} onChange={(e) => setPayment({ ...payment, upiId: e.target.value })} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-3 py-2" />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between bg-gray-900 text-white rounded-xl p-4 border border-gold/40">
                  <div>
                    <p className="text-sm text-gray-300">Total (incl. taxes)</p>
                    <p className="text-3xl font-extrabold text-gold">₹{total.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-400 mt-1">Payment processed via existing `/payments` API</p>
                  </div>
                  <button onClick={handleOrder} disabled={isLoading} className="px-5 py-3 rounded-lg bg-gold text-gray-900 font-bold hover:bg-gold/90 transition disabled:opacity-60">
                    {isLoading ? 'Processing...' : 'Pay & Order'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4" onClick={() => setShowSuccess(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gold/40 max-w-md w-full p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-gold/20 flex items-center justify-center text-3xl">✅</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Payment successful</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Order confirmed. We have logged your payment.</p>
            {lastOrderId && <p className="mt-1 text-xs text-gray-500">Order ID: {lastOrderId}</p>}
            <div className="mt-6 flex justify-center">
              <button onClick={() => setShowSuccess(false)} className="px-5 py-2.5 rounded-lg bg-gold text-gray-900 font-semibold hover:bg-gold/90 transition">Close</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
