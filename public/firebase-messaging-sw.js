// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js');

// console.log('[firebase-messaging-sw] loaded');

const firebaseConfig = {
  apiKey: "AIzaSyAx130AWO4LNx_tataR6BkSOX39AlRXtgg",
  authDomain: "zest-up.firebaseapp.com",
  projectId: "zest-up",
  storageBucket: "zest-up.appspot.com",
  messagingSenderId: "61182238429",
  appId: "1:61182238429:web:714cdebe20f14ddc130534",
  measurementId: "G-0302RJ2X38"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();

// Handle background messages
if(self && "serviceWorker" in self){
messaging.onBackgroundMessage(function (payload) {
    // console.log('[firebase-messaging-sw] Received background message', payload);
  
    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationOptions = {
      body: payload.notification?.body || '',
      icon: '/logo-symbol-2.png',
      badge: '/logo-symbol-2.png',
      data: payload.data || {}, // so you can handle clicks
    };
  
    // VERY IMPORTANT: return/waitUntil so Chrome shows it
    return self.registration.showNotification(notificationTitle, notificationOptions);
  });
  
  // Fallback: capture raw push events too
//   self.addEventListener('push', (event) => {
//     console.log('[firebase-messaging-sw] push event', event);
//     if (event.data) {
//       const data = event.data.json();
//       const title = data.notification?.title || data.title || 'Notification';
//       const options = data.notification || { body: data.body || '' };
//       event.waitUntil(self.registration.showNotification(title, options));
//     }
//   });
  

// Handle notification click

// self.addEventListener('notificationclick', function(event) {
//   // console.log('Notification click received.', event);
  
//   // Android needs explicit close
//   event.notification.close();
  
//   // This looks to see if the current tab is already open and focuses it
//   event.waitUntil(
//     clients.matchAll({type: 'window'}).then(function(clientList) {
//       // Check if there's already a window/tab open
//       for (const client of clientList) {
//         if (client.url === '/' && 'focus' in client) {
//           return client.focus();
//         }
//       }
      
//       // If no matching tab is found, open a new one
//       if (clients.openWindow) {
//         return clients.openWindow('/');
//       }
//     })
//   );
// });

// // Optional: Handle notification close
// self.addEventListener('notificationclose', function(event) {
//   // console.log('Notification was closed', event);
// });
 }  