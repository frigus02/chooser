const CACHE_NAME = "v1";
const CACHE_URLS = [
	"/index.html",
	"/index.css",
	"/index.js",
	"/favicon.ico",
	"/manifest.webmanifest",
	"/images/logo-16.png",
	"/images/logo-32.png",
	"/images/logo-48.png",
	"/images/logo-72.png",
	"/images/logo-96.png",
	"/images/logo-144.png",
	"/images/logo-168.png",
	"/images/logo-192.png",
	"/images/logo-192-opaque.png",
];

addEventListener("install", (event) => {
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
