// Απλό login gate (email + κωδικός) για τα panel των ιατρών και το admin.
// Οι κωδικοί ΔΕΝ αποθηκεύονται σε καθαρή μορφή: κρατάμε μόνο το SHA-256 hash.
// Το hash μπορεί να οριστεί/αλλάξει μέσω μεταβλητών περιβάλλοντος στο Netlify
// (VITE_<KEY>_PW_HASH). Αν δεν οριστεί, χρησιμοποιείται το ενσωματωμένο default
// (ώστε να δουλεύει άμεσα με τους κωδικούς που δόθηκαν).
//
// ⚠️ Σημείωση ασφαλείας: πρόκειται για client-side gate (αποτρέπει την απευθείας
// πρόσβαση μέσω URL). Δεν αντικαθιστά πραγματικό server-side auth.

export interface PanelIdentity {
  key: string;
  email: string;
  passHash: string;
}

const env = (import.meta as any).env || {};

export const PANEL_IDENTITIES: Record<string, PanelIdentity> = {
  admin: {
    key: 'admin',
    email: 'iatreiodrfytrou@gmail.com',
    passHash: env.VITE_ADMIN_PW_HASH || 'b96ead42549518f37d84009766b0483443ab082cee251c9aea82e2aec1fc85c8'
  },
  eirini: {
    key: 'eirini',
    email: 'eirini.ster88@gmail.com',
    passHash: env.VITE_EIRINI_PW_HASH || '37f6ee38df7179252f355e33703419290914ca85813b81ccd5fbdc1635384538'
  },
  ioanna: {
    key: 'ioanna',
    email: 'ioannapissari@outlook.com',
    passHash: env.VITE_IOANNA_PW_HASH || 'a9877cccd9dc102717a15d288d81d2c2bbade5f638d5bacd3a127fbbfe8cc712'
  },
  maria: {
    key: 'maria',
    email: 'dimitriadoumaria00@gmail.com',
    passHash: env.VITE_MARIA_PW_HASH || '9bc19b6e869d8821aede6e23136031bb09d4492c838f09d2386f56547b9d1146'
  },
  niki: {
    key: 'niki',
    email: 'niki_tsim@hotmail.com',
    passHash: env.VITE_NIKI_PW_HASH || '70637ab0a391d83035ec08cbf6625e4f2b2ceee920ec93814c52543292284bd9'
  }
};

const SESSION_PREFIX = 'panelSession_';

const sha256Hex = async (input: string): Promise<string> => {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

// Το session token είναι παράγωγο του hash (όχι το ίδιο το hash), ώστε να μην
// αρκεί η γνώση του public hash για να «κολλήσει» κανείς session απευθείας.
const sessionTokenFor = (id: PanelIdentity) => `${id.passHash}.session-v1`;

export const isAuthed = (key: string): boolean => {
  const id = PANEL_IDENTITIES[key];
  if (!id) return false;
  try {
    return localStorage.getItem(SESSION_PREFIX + key) === sessionTokenFor(id);
  } catch {
    return false;
  }
};

export const login = async (key: string, email: string, password: string): Promise<boolean> => {
  const id = PANEL_IDENTITIES[key];
  if (!id) return false;
  if ((email || '').trim().toLowerCase() !== id.email.toLowerCase()) return false;
  const h = await sha256Hex(`${key}|${password}`);
  if (h !== id.passHash) return false;
  try {
    localStorage.setItem(SESSION_PREFIX + key, sessionTokenFor(id));
  } catch {
    /* ignore */
  }
  return true;
};

export const logout = (key: string): void => {
  try {
    localStorage.removeItem(SESSION_PREFIX + key);
  } catch {
    /* ignore */
  }
};

export const panelEmail = (key: string): string => PANEL_IDENTITIES[key]?.email || '';
