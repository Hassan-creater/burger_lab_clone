import { messaging } from '@/lib/firebaseClient';
import { getToken, deleteToken } from 'firebase/messaging';

export const getFreshFcmToken = async (): Promise<string | null> => {
  try {
    // Attempt to get and delete the previous token
    const oldToken = await getToken(messaging);
    if (oldToken) {
      await deleteToken(messaging);
    //   console.log('Previous FCM token deleted');
    }

    // Generate a fresh token
    const newToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (newToken) {
    //   console.log('New FCM token:', newToken);
      return newToken;
    } else {
    //   console.warn('No FCM token retrieved');
      return null;
    }
  } catch (error) {
    // console.error('Error refreshing FCM token:', error);
    return null;
  }
};