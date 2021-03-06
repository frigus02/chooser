const CACHE_NAME = "v7";
const CACHE_URLS = [
	"/",
	"/index.css",
	"/index.js",
	"/favicon.ico",
	"/manifest.webmanifest",
	"/images/logo-16.png",
	"/images/logo-32.png",
	"/images/logo-48.png",
	"/images/logo-96.png",
	"/images/logo-144.png",
	"/images/logo-192.png",
	"/images/logo-192-opaque.png",
	"/images/logo-384.png",
	"/images/logo-maskable-48.png",
	"/images/logo-maskable-96.png",
	"/images/logo-maskable-144.png",
	"/images/logo-maskable-192.png",
	"/images/logo-maskable-384.png",
];

addEventListener("install", (event) => {
	self.skipWaiting();
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHE_URLS))
	);
});

addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) =>
			Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName !== CACHE_NAME) {
						return caches.delete(cacheName);
					}
				})
			)
		)
	);
});

addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			if (response) {
				return response;
			}

			return fetch(event.request);
		})
	);
});

addEventListener("message", (event) => {
	if (event.data === "version") {
		event.source.postMessage({ version: CACHE_NAME });
	}
});
