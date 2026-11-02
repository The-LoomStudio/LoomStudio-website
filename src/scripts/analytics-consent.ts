const measurementId = 'G-T81JY514CC';
const storageKey = 'loom-site-analytics-consent';
type Consent = 'granted' | 'denied' | null;
const analyticsWindow = window as typeof window & {
  dataLayer?: IArguments[];
  'ga-disable-G-T81JY514CC'?: boolean;
};
const root = document.querySelector<HTMLElement>('[data-analytics-consent]')!;
const panel = root.querySelector<HTMLElement>('#analytics-consent-panel')!;
const settings = root.querySelector<HTMLButtonElement>('[data-consent-settings]')!;
const status = root.querySelector<HTMLElement>('[data-consent-status]')!;
const isProductionSite = import.meta.env.PROD && location.hostname === 'loomstudio.pages.dev';
let initialized = false;

function readConsent(): Consent {
  try {
    const value = localStorage.getItem(storageKey);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    // Storage may be blocked; consent then lasts only for this page.
    return null;
  }
}

function gtag(..._args: unknown[]) {
  (analyticsWindow.dataLayer ??= []).push(arguments);
}

function applyConsent(consent: Consent) {
  const allowed = consent === 'granted';
  analyticsWindow['ga-disable-G-T81JY514CC'] = !allowed;
  status.textContent = allowed ? status.dataset.allowed! : status.dataset.denied!;
  if (!isProductionSite) return;

  if (allowed && !initialized) {
    initialized = true;
    gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied',
    });
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', measurementId, {
      cookie_domain: location.hostname,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.append(script);
  } else if (initialized) {
    gtag('consent', 'update', { analytics_storage: allowed ? 'granted' : 'denied' });
  }

  if (!allowed) {
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.trim().split('=')[0];
      if (name !== '_ga' && name !== '_ga_T81JY514CC') continue;
      for (const domain of ['', `; Domain=${location.hostname}`]) {
        document.cookie = `${name}=; Max-Age=0; Path=/${domain}; SameSite=Lax`;
      }
    }
  }
}

function showPanel(open: boolean, focus = false) {
  panel.hidden = !open;
  settings.setAttribute('aria-expanded', String(open));
  if (focus) {
    if (open) panel.querySelector<HTMLButtonElement>('[data-consent-choice]')!.focus();
    else settings.focus();
  }
}

root.hidden = false;
const initialConsent = readConsent();
applyConsent(initialConsent);
showPanel(initialConsent === null);
settings.addEventListener('click', () => showPanel(Boolean(panel.hidden), true));
root.querySelector('[data-consent-close]')!.addEventListener('click', () => showPanel(false, true));
root.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !panel.hidden) showPanel(false, true);
});
root.querySelectorAll<HTMLButtonElement>('[data-consent-choice]').forEach(button => {
  button.addEventListener('click', () => {
    const consent = button.dataset.consentChoice as Exclude<Consent, null>;
    try { localStorage.setItem(storageKey, consent); } catch {
      // Keep the current page's choice even when persistent storage is unavailable.
    }
    applyConsent(consent);
    showPanel(false, true);
  });
});
window.addEventListener('storage', event => {
  if (event.key !== storageKey && event.key !== null) return;
  const consent = readConsent();
  applyConsent(consent);
  showPanel(consent === null);
});
window.addEventListener('pageshow', event => {
  if (!event.persisted) return;
  const consent = readConsent();
  applyConsent(consent);
  showPanel(consent === null);
});
