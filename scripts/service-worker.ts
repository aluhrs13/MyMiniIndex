var CACHE = "network-or-cache";

self.addEventListener("install", function (evt) {
  console.log("The service worker is being installed.");
  //@ts-ignore
  evt.waitUntil(precache());
});

self.addEventListener("fetch", function (evt) {
  console.log("The service worker is serving the asset.");
  //@ts-ignore
  evt.respondWith(
    //@ts-ignore
    fromNetwork(evt.request, 400).catch(function () {
      //@ts-ignore
      return fromCache(evt.request);
    })
  );
});

function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll([
      "./index.html",
      "./pages/directories.html",
      "./pages/pending.html",
    ]);
  });
}

function fromNetwork(request, timeout) {
  return new Promise(function (fulfill, reject) {
    var timeoutId = setTimeout(reject, timeout);

    fetch(request).then(function (response) {
      caches.open(CACHE).then(function (cache) {
        return cache.add(request);
      });
      clearTimeout(timeoutId);
      fulfill(response);
    }, reject);
  });
}

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject("no-match");
    });
  });
}
