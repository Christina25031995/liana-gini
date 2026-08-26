// Centralized legal/requisites values that are currently BLANK in the
// lawyer-supplied source documents (Public Offer, Personal Data package).
// Do not invent values here — fill in once the client confirms them, then
// wire these into oferta.html / privacy-policy.html / pd-consent.html /
// ad-consent.html / the site footer, wherever a blank was left in this pass.
//
// Unresolved in the supplied DOCX files:
//   - E-mail          — Offer §14 "Реквизиты", Policy §8.2, PD Consent cl. 4,
//                        Ad Consent cl. 3 all leave the operator's contact
//                        e-mail as "__________".
//   - Site URL        — Offer §1.1 "Сайт — ... расположенный по адресу
//                        __________", Policy §1.3 leave the site's own URL
//                        blank.
//   - Revision date    — Both the Offer and the Policy header read
//                        'Редакция от «___» __________ 20__ г.' — no date
//                        was filled in.
//
// These are left empty (not fake values) so nothing false gets published;
// the site currently omits these fields from public pages rather than
// showing literal "__________" placeholders.

export const LEGAL_EMAIL = '';        // TODO: confirm with client — see notes above
export const SITE_URL = '';           // TODO: confirm with client — see notes above
export const LEGAL_REVISION_DATE = ''; // TODO: confirm with client — see notes above
