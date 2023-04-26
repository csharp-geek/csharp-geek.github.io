importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyCYdztTgy4otlOiOs03m9J5BFoBUArqV0U",
    authDomain: "opentext-d4d09.firebaseapp.com",
    databaseURL: "https://opentext-d4d09.firebaseio.com",
    projectId: "opentext-d4d09",
    storageBucket: "opentext-d4d09.appspot.com",
    messagingSenderId: "144479104452",
    appId: "1:144479104452:web:0f360def0245efee530891",
    measurementId: "G-T1SQRJ6K6R"
  };
  
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message', payload);
    
    // Customize notification here
    const title = payload.data.title;
    const options = {
        body: payload.data.body,
        icon: payload.data.icon,
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        tag: payload.data.tag,
        data: { 
            actions : JSON.parse(payload.data.actions),
            customData: JSON.parse(payload.data.data)
        }
    }
    
    registration.showNotification(title, options)
})

// Not necessary, but if you want to handle clicks on notifications
self.addEventListener('notificationclick', (event) => {
    console.log("[firebase-messaging-sw.js] Received notificationclick() event", event);

    if (!event.notification.data.actions.click) {
        return
    }

    const url = event.notification.data.actions.click
    event.notification.close()
    event.waitUntil(
        self.clients
            .matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientsArr) => {
                const hadWindowToFocus = clientsArr.some((windowClient) =>
                    windowClient.url === url ? (windowClient.focus(), true) : false
                )

                if (!hadWindowToFocus)
                    self.clients
                        .openWindow(url)
                        .then((windowClient) =>
                            windowClient ? windowClient.focus() : null
                        )
            })
    )
})