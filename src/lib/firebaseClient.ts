// lib/firebaseClient.ts
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

if (!getApps().length) initializeApp(firebaseConfig);

const messaging = getMessaging();

export async function getFcmToken(
  serviceWorkerRegistration?: ServiceWorkerRegistration
): Promise<string | null> {
  try {
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!;
    if (!vapidKey) {
      // console.warn('VAPID key is missing. Set NEXT_PUBLIC_FIREBASE_VAPID_KEY.');
      return null;
    }
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration,
    });
    return token ?? null;
  } catch (err) {
    // console.error('getFcmToken error', err);
    return null;
  }
}

export const onMessageListener = (cb: (payload: any) => void) =>
  onMessage(messaging, (payload) => cb(payload));
