export const CYBERSOFT_TOKEN = import.meta.env.VITE_CYBERSOFT_TOKEN || '';
export const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN || '';

export const getHeaders = () => ({
  'Authorization': `Bearer ${ACCESS_TOKEN}`,
  'TokenCybersoft': CYBERSOFT_TOKEN,
  'Content-Type': 'application/json-patch+json'
});
