// Production enquiry submission — delivered via FormSubmit (formsubmit.co) to the
// operator's confirmed inbox. AJAX endpoint (not the redirect-based form action), so
// the user stays on the LIANA GINI site — no redirect to a FormSubmit-hosted page.
//
// FormSubmit is a third-party form-delivery processor: the payload below is sent to
// formsubmit.co, which relays it by email. This is flagged for legal-policy review
// (see chat report) — not something this script decides on its own.
//
// No secret/API key here by design: FormSubmit's AJAX endpoint authenticates by the
// destination email address itself. On the very first submission, FormSubmit sends
// an activation email to that address; delivery only starts once it's confirmed
// there. That is expected FormSubmit behavior, not a bug in this integration.

export const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/liana.Giniyatulina@yandex.com';
export const WIRED = true;

export const STATES = { IDLE: 'idle', PENDING: 'pending', SUCCESS: 'success', ERROR: 'error' };

export const FIELDS = ['product', 'design', 'volume', 'targetCost', 'phone', 'contactHandle'];

export function validate(payload) {
  const errors = {};
  if (!payload.product?.trim()) errors.product = 'required';
  if (!payload.phone?.trim()) errors.phone = 'required';
  if (!payload.pdConsent) errors.pdConsent = 'required';
  return { valid: Object.keys(errors).length === 0, errors };
}

// Builds the FormSubmit payload with readable Russian field labels (so the email
// Liana receives is self-explanatory), plus FormSubmit's own control fields.
// Only real form fields are included — nothing fabricated, no hidden DOM values.
function buildFormSubmitPayload(payload) {
  return {
    'Опишите вашу задачу': payload.product || '',
    'Есть готовый дизайн или прототип': payload.design || '',
    'Планируемый объём': payload.volume || '',
    'Целевая себестоимость': payload.targetCost || '',
    'Телефон': payload.phone || '',
    'Email / мессенджер': payload.contactHandle || '',
    'Согласие на обработку персональных данных': payload.pdConsent ? 'Да' : 'Нет',
    'Согласие на рекламные рассылки': payload.marketingConsent ? 'Да' : 'Нет',
    _subject: 'Новая заявка с сайта LIANA GINI',
    _template: 'table',
    _captcha: 'false',
    // Honeypot: FormSubmit silently discards any submission where this field is
    // non-empty. The input itself lives in the form markup (display:none), never
    // shown to real users.
    _honey: payload._honey || '',
  };
}

export async function submitEnquiry(payload) {
  const { valid, errors } = validate(payload);
  if (!valid) return { state: STATES.ERROR, errors, reason: 'validation-failed' };
  if (!WIRED) return { state: STATES.ERROR, reason: 'enquiry-channel-not-connected' };

  try {
    const res = await fetch(FORMSUBMIT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(buildFormSubmitPayload(payload)),
    });
    if (!res.ok) return { state: STATES.ERROR, reason: 'request-failed' };
    const data = await res.json().catch(() => null);
    // FormSubmit's ajax endpoint responds {success: "true", ...} on delivery.
    if (data && (data.success === 'true' || data.success === true)) {
      return { state: STATES.SUCCESS };
    }
    return { state: STATES.ERROR, reason: 'formsubmit-rejected', detail: data };
  } catch (err) {
    return { state: STATES.ERROR, reason: 'network-error' };
  }
}
