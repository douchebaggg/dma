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
export const apiPort = 8080; 
//const apiUrl = isLocalNetwork() ? `http://${currentHost}:${apiPort}/api/method` : `http://erp.alzo.io:10580/api/method`;