/**
 * Sona Luxury Hotel - Website Backend Integration
 * Connects public website forms (Hero Booking, Contact Form, Room Details) to MySQL backend.
 */

const BACKEND_API = window.location.origin.includes(':5000') 
  ? '/api/public' 
  : 'http://localhost:5000/api/public';

document.addEventListener('DOMContentLoaded', () => {
  setupHeroBookingForm();
  setupContactForm();
});

// Setup Booking Forms across site (Hero form on index.html and room reservation forms): redirects seamlessly to dedicated booking.html
function setupHeroBookingForm() {
  const forms = document.querySelectorAll('.booking-form form, .room-booking form');
  if (!forms || forms.length === 0) return;

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const dateIn = form.querySelector('#date-in, input[name="check_in"]')?.value;
      const dateOut = form.querySelector('#date-out, input[name="check_out"]')?.value;
      const guestEl = form.querySelector('#guest, select[name="guests"]');
      const roomEl = form.querySelector('#room, select[name="rooms"]');
      const roomIdEl = form.querySelector('input[name="room_id"]');

      const params = new URLSearchParams();

      // Helper to format date string to YYYY-MM-DD
      const formatToYMD = (dStr) => {
        if (!dStr) return '';
        if (/^\d{4}-\d{2}-\d{2}$/.test(dStr.trim())) return dStr.trim();
        try {
          const d = new Date(dStr);
          if (!isNaN(d.getTime())) {
            const yr = d.getFullYear();
            const mo = String(d.getMonth() + 1).padStart(2, '0');
            const da = String(d.getDate()).padStart(2, '0');
            return `${yr}-${mo}-${da}`;
          }
        } catch (err) {}
        return '';
      };

      const inYMD = formatToYMD(dateIn);
      const outYMD = formatToYMD(dateOut);

      if (inYMD) params.set('check_in', inYMD);
      if (outYMD) params.set('check_out', outYMD);

      if (roomIdEl && roomIdEl.value) {
        params.set('room_id', roomIdEl.value);
      }

      // Get guest count from select value or option text
      let guestVal = guestEl?.value;
      if (!guestVal && guestEl && guestEl.selectedIndex >= 0) {
        guestVal = guestEl.options[guestEl.selectedIndex].text;
      }
      const guestMatch = String(guestVal || '').match(/\d+/);
      if (guestMatch) {
        params.set('guests', guestMatch[0]);
      }

      // Get room count from select value or option text
      let roomVal = roomEl?.value;
      if (!roomVal && roomEl && roomEl.selectedIndex >= 0) {
        roomVal = roomEl.options[roomEl.selectedIndex].text;
      }
      const roomMatch = String(roomVal || '').match(/\d+/);
      if (roomMatch) {
        params.set('rooms', roomMatch[0]);
      }

      // Smoothly redirect to dedicated booking page
      const query = params.toString();
      window.location.href = query ? `booking.html?${query}` : 'booking.html';
    });
  });
}

function showPublicBookingConfirmation(booking) {
  let modal = document.getElementById('publicBookingSuccessModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'publicBookingSuccessModal';
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(17, 17, 17, 0.85); backdrop-filter: blur(5px);
      display: flex; align-items: center; justify-content: center;
      z-index: 99999; padding: 20px; font-family: 'Cabin', sans-serif;
    `;
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background: #19191a; color: #fff; border: 1px solid #dfa974; border-radius: 8px; max-width: 500px; width: 100%; padding: 35px; box-shadow: 0 20px 50px rgba(0,0,0,0.8); text-align: center; position: relative;">
      <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(223, 169, 116, 0.15); color: #dfa974; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 20px auto; border: 2px solid #dfa974;">
        <i class="fa fa-check"></i>
      </div>
      <h3 style="font-family: 'Lora', serif; color: #dfa974; margin-bottom: 10px; font-size: 24px;">Reservation Confirmed!</h3>
      <p style="color: #ccc; font-size: 14px; margin-bottom: 20px;">Thank you for choosing Sona Luxury Hotel. Your booking request has been securely recorded.</p>
      
      <div style="background: #252528; padding: 18px; border-radius: 6px; text-align: left; margin-bottom: 24px; font-size: 14px; line-height: 1.8; border: 1px solid rgba(255,255,255,0.08);">
        <div>Booking Reference: <strong style="color: #dfa974; font-size: 15px;">${booking.reference}</strong></div>
        <div>Room: <strong>${booking.roomName}</strong></div>
        <div>Check In: <strong>${booking.checkIn}</strong></div>
        <div>Check Out: <strong>${booking.checkOut}</strong> (${booking.nights} nights)</div>
        <div>Estimated Total: <strong style="color: #dfa974;">$${parseFloat(booking.totalAmount).toFixed(2)}</strong></div>
      </div>

      <button style="background: #dfa974; color: #111; font-weight: 700; border: none; padding: 12px 30px; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 4px; cursor: pointer;" onclick="document.getElementById('publicBookingSuccessModal').remove()">
        Done
      </button>
    </div>
  `;
}

// Setup Contact Form on contact.html
function setupContactForm() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = contactForm.querySelector('input[placeholder="Your Name"]');
    const emailInput = contactForm.querySelector('input[placeholder="Your Email"]');
    const messageInput = contactForm.querySelector('textarea[placeholder="Your Message"]');

    if (!nameInput || !emailInput || !messageInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      alert('Please fill in your name, email, and message.');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending message...';

    try {
      const res = await fetch(`${BACKEND_API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject: 'Website Contact Inquiry', message })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        alert('Thank you! Your message has been sent to our concierge team. We will reply to your email shortly.');
        contactForm.reset();
      } else {
        alert('Could not submit message: ' + (data.message || 'Error occurred.'));
      }
    } catch (err) {
      alert('Error connecting to contact service. Please make sure backend is running on http://localhost:5000.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}
