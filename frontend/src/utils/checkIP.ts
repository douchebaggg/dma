export function isLocalNetwork() {
    const hostname = window.location.hostname;
    return hostname === 'localhost' || 
           hostname.startsWith('192.168.') ||
           hostname.startsWith('10.0.') ||
           hostname.startsWith('172.') || 
           hostname.startsWith('127.') ||
           hostname === '[::1]' || // IPv6 localhost
           hostname.endsWith('.local'); // Bonjour/mDNS addresses
}
export const currentHost = window.location.hostname;
<<<<<<< HEAD
export const port = 8000; // Default port for local development
=======
export const port = 8000; 
>>>>>>> f35a647 (fix some code and run build cmd)
export const urlPort = isLocalNetwork() ? `http://${currentHost}:${port}` : import.meta.env.VITE_API_URL
export const url = isLocalNetwork() ? `http://192.168.10.105` : import.meta.env.VITE_API_URL