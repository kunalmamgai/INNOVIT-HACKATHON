import { jsPDF } from 'jspdf'

const GOLD = [212, 175, 55]
const DARK = [28, 25, 48]
const GRAY = [120, 120, 130]
const LIGHT = [245, 243, 237]

const rupees = (amount) => `Rs. ${Number(amount || 0).toFixed(2)}`

function drawHeader(doc, title, subtitle) {
  // Brand band
  doc.setFillColor(...GOLD)
  doc.rect(0, 0, 210, 26, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('AR-Chaelogist Heritage Portal', 14, 12)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text(title, 14, 20)
  if (subtitle) {
    doc.setFontSize(9)
    doc.text(subtitle, 14, 24)
  }
}

function drawFooter(doc, note) {
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.4)
  doc.line(14, 282, 196, 282)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...GRAY)
  doc.text('AR-Chaelogist · Heritage & Culture Portal · E-ticket / Itinerary', 14, 288)
  doc.text(`Generated ${new Date().toLocaleString()}`, 14, 292)
  if (note) doc.text(note, 14, 296)
}

function drawField(doc, x, y, label, value) {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...GRAY)
  doc.text(label.toUpperCase(), x, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  doc.setTextColor(...DARK)
  doc.text(String(value), x, y + 5)
}

/**
 * Export a booking + payment as a downloadable PDF ticket.
 * @param {{booking: object, payment: object}} data
 */
export function exportTicketPdf({ booking, payment }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const b = booking || {}
  const p = payment || {}

  drawHeader(doc, 'Monument Visit — E-Ticket', 'Scan or carry this ticket to the monument entrance')

  // Ticket card
  doc.setFillColor(...LIGHT)
  doc.roundedRect(14, 34, 182, 110, 3, 3, 'F')
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.8)
  doc.roundedRect(14, 34, 182, 110, 3, 3, 'S')

  doc.setFillColor(...DARK)
  doc.rect(14, 34, 182, 12, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text(b.place_name || 'Heritage Site', 20, 42)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('CONFIRMED', 180, 42, { align: 'right' })

  let y = 60
  drawField(doc, 20, y, 'Booking ID', b.booking_id || '—')
  drawField(doc, 108, y, 'Visit Date', b.visit_date || '—')
  y += 22
  drawField(doc, 20, y, 'Tickets', `${b.num_tickets ?? '—'} x ${b.ticket_type || 'indian'}`)
  drawField(doc, 108, y, 'Price / Ticket', rupees(b.price_per_ticket))
  y += 22
  drawField(doc, 20, y, 'Payment ID', p.payment_id || '—')
  drawField(doc, 108, y, 'Payment Method', p.payment_method || '—')
  y += 22

  // Total box
  doc.setFillColor(...GOLD)
  doc.roundedRect(20, y, 70, 14, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('TOTAL PAID', 24, y + 6)
  doc.setFontSize(13)
  doc.text(rupees(p.amount ?? b.total_price), 24, y + 12)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...GRAY)
  doc.text(`Status: ${(p.status || 'completed').toUpperCase()} · Booking: ${b.status || 'confirmed'}`, 100, y + 10)

  drawFooter(doc, 'Thank you for exploring India\'s heritage with us!')

  doc.save(`ticket-${b.booking_id || 'booking'}.pdf`)
}

/**
 * Export a personalized recommendation itinerary as a PDF.
 * @param {{places: Array, userName?: string}} data
 */
export function exportItineraryPdf({ places, userName }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const list = Array.isArray(places) ? places : []

  drawHeader(
    doc,
    'Personalized Heritage Itinerary',
    userName ? `Curated for ${userName}` : 'Curated by the AR-Chaelogist recommendation engine'
  )

  if (!list.length) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(...GRAY)
    doc.text('No places in this itinerary yet. Log in and generate recommendations first.', 14, 60)
    drawFooter(doc)
    doc.save('itinerary.pdf')
    return
  }

  let y = 44
  list.forEach((place, idx) => {
    if (y > 265) {
      doc.addPage()
      y = 20
    }
    const name = place.name || `Place ${idx + 1}`
    const meta = [
      place.cluster,
      place.category,
      place.avg_time ? `~${place.avg_time} hr` : null,
      place.tickets && place.tickets.indian != null ? `Entry ${rupees(place.tickets.indian)}` : null,
    ].filter(Boolean).join(' · ')

    doc.setFillColor(idx % 2 === 0 ? LIGHT : [255, 255, 255])
    doc.roundedRect(14, y - 5, 182, 24, 2, 2, 'F')
    doc.setFillColor(...GOLD)
    doc.rect(14, y - 5, 2, 24, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...DARK)
    doc.text(`${idx + 1}. ${name}`, 20, y + 2)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...GRAY)
    doc.text(meta || '—', 20, y + 8)

    if (place.description) {
      const snippet = place.description.length > 130
        ? `${place.description.slice(0, 130)}…`
        : place.description
      doc.setFontSize(8.5)
      doc.setTextColor(90, 90, 100)
      doc.text(doc.splitTextToSize(snippet, 170), 20, y + 13)
    }
    y += 28
  })

  drawFooter(doc)
  doc.save('heritage-itinerary.pdf')
}
