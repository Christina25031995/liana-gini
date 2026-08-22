// Production enquiry submission — destination NOT yet confirmed.
// Two candidate channels: Liana's Telegram (via a bot + backend relay) or the team's
// shared email. Both require a server-side endpoint; a bot token or SMTP credential
// must never live in frontend code. Implement ONE of these in the backend, point
// ENQUIRY_ENDPOINT at it, and flip WIRED to true.

export const ENQUIRY_ENDPOINT = '/api/enquiry';   // POST payload -> {ok: true}
export const WIRED = false;

export const STATES = { IDLE: 'idle', PENDING: 'pending', SUCCESS: 'success', ERROR: 'error' };

export const FIELDS = ['product', 'design', 'volume', 'targetCost', 'contact'];

export function validate(payload) {
  const errors = {};
  if (!payload.product?.trim()) errors.product = 'required';
  if (!payload.contact?.trim()) errors.contact = 'required';
  return { valid: Object.keys(errors).length === 0, errors };
}

export async function submitEnquiry(payload) {
  const { valid, errors } = validate(payload);
  if (!valid) return { state: STATES.ERROR, errors };
  if (!WIRED) return { state: STATES.ERROR, reason: 'enquiry-channel-not-connected' };

  const res = await fetch(ENQUIRY_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return { state: STATES.ERROR, reason: 'request-failed' };
  return { state: STATES.SUCCESS };
}
