// hooks/useFcmToken.ts
'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { getFcmToken, onMessageListener } from '@/lib/firebaseClient';
import { toast } from 'sonner';
import Image from 'next/image';

type PermissionState = NotificationPermission; // 'granted' | 'denied' | 'default'

export interface UseFcmTokenOptions {
  /** If true the hook will request permission automatically on mount if permission is 'default' (ask user). Default: true */
  autoRequestPermission?: boolean;
  /** Optional callback invoked when a token is obtained; return value ignored. Use it to persist token on server. */
  onToken?: (token: string) => void | Promise<void>;
  /** Path to the service worker (default '/firebase-messaging-sw.js') */
  swPath?: string;
}

export function useFcmToken(options: UseFcmTokenOptions = {}) {
  const { autoRequestPermission = true, onToken, swPath = '/firebase-messaging-sw.js' } = options;

  const [fcmToken, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<PermissionState>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const unsubRef = useRef<(() => void) | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // cleanup message listener if set
      if (typeof unsubRef.current === 'function') unsubRef.current();
    };
  }, []);

  const registerSW = useCallback(async (): Promise<ServiceWorkerRegistration | null> => {
    if (!('serviceWorker' in navigator)) {
      setError('Service worker not supported in this browser.');
      return null;
    }
    try {
      const reg = await navigator.serviceWorker.register(swPath);
      registrationRef.current = reg;
      return reg;
    } catch (err) {
      setError(err);
      return null;
    }
  }, [swPath]);

  const obtainToken = useCallback(
    async (reg?: ServiceWorkerRegistration) => {
      setLoading(true);
      setError(null);
      try {
        const registration = reg ?? (await registerSW());
        if (!registration) {
          setLoading(false);
          return null;
        }

        const t = await getFcmToken(registration);
        if (!mountedRef.current) return null;
        setToken(t);
        if (t && onToken) {
          try {
            await onToken(t);
          } catch (cbErr) {
            // don't block token setting if callback fails
            // console.warn('onToken callback error:', cbErr);
          }
        }
        return t;
      } catch (err) {
        setError(err);
        return null;
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [onToken, registerSW]
  );

  const requestPermission = useCallback(async (): Promise<string | null> => {
    if (!('Notification' in window)) {
      setError('Notifications are not supported in this browser.');
      return null;
    }
    try {
      // If permission already granted/denied, don't re-request - but still try to obtain token if granted
      if (Notification.permission === 'granted') {
        setPermission('granted');
        return await obtainToken(registrationRef.current ?? undefined);
      }

      const perm = await Notification.requestPermission();
      if (!mountedRef.current) return null;
      setPermission(perm);
      if (perm === 'granted') {
        return await obtainToken(registrationRef.current ?? undefined);
      }
      return null;
    } catch (err) {
      setError(err);
      return null;
    }
  }, [obtainToken]);

  const refreshToken = useCallback(async (): Promise<string | null> => {
    // Re-run getToken to get the latest.
    return await obtainToken(registrationRef.current ?? undefined);
  }, [obtainToken]);

  useEffect(() => {
    // Setup flow on mount:
    (async () => {
      // Only run in browsers with Notification support
      if (typeof window === 'undefined' || !('Notification' in window)) {
        setError('Notifications are not supported in this environment.');
        return;
      }

      // register service worker first (non-blocking)
      const reg = await registerSW();

      // ensure we reflect current permission
      setPermission(Notification.permission);

      if (Notification.permission === 'granted') {
        // if already granted, just obtain token
        await obtainToken(reg ?? undefined);
      } else if (Notification.permission === 'default' && autoRequestPermission) {
        // ask user permission (auto) if configured
        await requestPermission();
      }

      // set up foreground message listener (optional debug/usage)
      try {
        unsubRef.current = onMessageListener((payload) => {
          // console.log('FCM foreground message:', payload);
          
          // Extract notification data
          const notificationTitle = payload.notification?.title || 'New Notification';
          const notificationBody = payload.notification?.body || 'You have a new notification';
          // Show toast with proper formatting
          toast(
            <div className="flex items-center gap-3">
              <Image 
                src="/logo-symbol-2.png"
                alt="Logo"
                width={48}
                height={32}
                className="rounded-full"
              />
              <div>
                <div className="font-semibold">{notificationTitle}</div>
                <div className="text-sm text-gray-600">{notificationBody}</div>
              </div>
            </div>,
            {
              position: 'bottom-right',
              style: {
                background: '#ffffff',
                color: '#1a1a1a',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px 16px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                minWidth: '300px',
              },
              className: 'group',
              duration: 5000,
            }
          );

          // Show browser notification if permission is granted
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notificationTitle, {
              body: notificationBody,
              icon: '/logo-symbol-2.png',
              data: payload.data || {}
            });
          }
        });
      } catch (err) {
        // console.warn('Failed to attach onMessage listener:', err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  return {
    fcmToken,
    permission,
    loading,
    error,
    requestPermission,
    refreshToken,
  } as const;
}
