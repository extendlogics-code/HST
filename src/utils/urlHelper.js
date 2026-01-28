import { BASE_URL } from '../api/api';

/**
 * Normalizes a URL to work in both development and production.
 * If the URL is already a full URL (starting with http), it replaces localhost:5000/5001 with the current BASE_URL.
 * If the URL is a relative path, it appends it to the BASE_URL.
 * 
 * @param {string} url - The URL or path to normalize
 * @param {string} defaultFallback - Fallback if url is null/undefined
 * @returns {string} - The normalized URL
 */
export const getFullUrl = (url, defaultFallback = null) => {
  if (!url) return defaultFallback;
  
  // If it's already a base64 or blob, return as is
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  
  if (url.startsWith('http')) {
    // Handle legacy localhost URLs stored in DB
    return url.replace(/http:\/\/localhost:500[01]/, BASE_URL);
  }
  
  // Ensure the path starts with /
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${BASE_URL}${cleanPath}`;
};
