const PREFIX = 'garagepro_prefs_';

export function getPreferences(role) {
  try {
    const raw = localStorage.getItem(`${PREFIX}${role}`);
    return raw ? JSON.parse(raw) : getDefaults(role);
  } catch {
    return getDefaults(role);
  }
}

export function savePreferences(role, prefs) {
  localStorage.setItem(`${PREFIX}${role}`, JSON.stringify(prefs));
}

function getDefaults(role) {
  const base = {
    compactTables: false,
    emailAlerts: true,
    showTips: true,
  };
  if (role === 'Admin') {
    return { ...base, defaultReport: 'monthly', lowStockThreshold: 10, autoRefreshLists: true };
  }
  if (role === 'Staff') {
    return { ...base, defaultCustomerId: '', rememberLastSearch: true };
  }
  return { ...base, appointmentReminders: true, marketingEmails: false };
}
