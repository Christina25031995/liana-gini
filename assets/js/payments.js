// Payment layer — provider-agnostic. No provider chosen yet, no keys in frontend.
// Wire a real provider later by implementing createCheckout() against your OWN backend
// endpoint; the backend holds the secret key and returns a redirect URL.
// Download/access URLs are intentionally NOT present in page source — they are issued
// by the backend only after the provider confirms payment (webhook -> signed link).

export const PRODUCTS = {
  'pdf-collections':      { id: 'pdf-collections',      name: 'PDF-подборки коллекций',      price: 999,  currency: 'RUB' },
  'factory-check-guide':  { id: 'factory-check-guide',  name: '9 шагов проверки фабрики',    price: 490,  currency: 'RUB' },
  'factory-search-guide': { id: 'factory-search-guide', name: 'Самостоятельный поиск фабрики', price: 490, currency: 'RUB' },
  'guangzhou-markets':    { id: 'guangzhou-markets',    name: 'Рынки Гуанчжоу с адресами',   price: 5500, currency: 'RUB' },
  // Service, not a download: after payment the backend confirms and schedules.
  'personal-consultation': { id: 'personal-consultation', name: 'Личная консультация с Лианой Гини', price: 15000, currency: 'RUB',
    kind: 'service', collect: ['name', 'contact', 'email', 'question'] },
};

// Backend endpoints to be implemented server-side (paths are placeholders, not live).
export const ENDPOINTS = {
  createCheckout: '/api/payments/checkout',   // POST {productId} -> {checkoutUrl, orderId}
  orderStatus:    '/api/payments/status',     // GET  ?orderId    -> {status}
  issueDownload:  '/api/orders/download',     // GET  ?orderId    -> {signedUrl} (paid only)
  createBooking:  '/api/bookings',            // POST {productId, fields} -> {bookingId}
  bookingConfirm: '/api/bookings/confirm',    // GET  ?bookingId  -> {scheduling} (paid only)
};

export const STATES = { IDLE: 'idle', PENDING: 'pending', SUCCESS: 'success', ERROR: 'error' };

// CTA -> checkout. Until a provider is connected this resolves to a no-op marker
// so the UI never fakes a payment.
export async function startCheckout(productId) {
  const product = PRODUCTS[productId];
  if (!product) throw new Error('Unknown product: ' + productId);
  return { state: STATES.IDLE, product, reason: 'payment-provider-not-connected' };
}

// Called on return from the provider (?orderId=...). Backend verifies, then issues
// a short-lived signed download link.
export async function resolveDelivery(orderId) {
  if (!orderId) return { state: STATES.IDLE };
  return { state: STATES.PENDING, orderId };
}
