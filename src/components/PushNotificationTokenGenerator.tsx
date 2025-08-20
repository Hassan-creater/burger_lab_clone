// components/PushTokenGenerator.tsx
'use client';
import { useEffect } from 'react';
import { getFcmToken, onMessageListener } from '@/lib/firebaseClient';

export default function PushTokenGenerator() {
  useEffect(() => {
    let unsub: (() => void) | undefined;

    (async () => {
      try {
        if (!('serviceWorker' in navigator)) {
          console.log('Service workers are not supported in this browser.');
          return;
        }
        if (!('Notification' in window)) {
          console.log('Notifications are not supported in this browser.');
          return;
        }

        // register the service worker (register returns existing registration if already registered)
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service worker registered:', registration.scope);

        // ask for permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.log('Notification permission not granted:', permission);
          return;
        }

        // get FCM token (this will create/generate the token)
        const token = await getFcmToken(registration);
        console.log('FCM token:', token);

        // OPTIONAL: send the token to your server so you can target this client later:
        if (token) {
          try {
            await fetch('/api/save-fcm-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token }),
            });
          } catch (sendErr) {
            console.warn('Failed to save FCM token to server', sendErr);
          }
        }

        // optional: handle foreground messages
        unsub = onMessageListener((payload) => {
          console.log('Foreground message received:', payload);
        });
      } catch (err) {
        console.error('Error initializing FCM on app open:', err);
      }
    })();

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  return null; // this component does not render UI
}
