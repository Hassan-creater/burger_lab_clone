

// Client-side function
export const getClientCookie = (name: string): string | undefined => {
  // Ensure this only runs in the browser
  if (typeof window === 'undefined') {
    console.warn('getClientCookie should only be used in client components');
    return undefined;
  }

  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [cookieName, value] = cookie.split('=');
    if (cookieName === name) {
      return decodeURIComponent(value);
    }
  }
  return undefined;
};

// Universal cookie getter that works in both environments
