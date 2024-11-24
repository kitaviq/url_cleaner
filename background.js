let isActive = true;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.getStatus) {
        sendResponse({isActive: isActive});
    }
    if (request.isActive !== undefined) {
        isActive = request.isActive;
    }
});

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (!isActive) {
            return {};
        }
        var cleanUrl = details.url.split('?')[0];
        if (cleanUrl !== details.url) {
            return {redirectUrl: cleanUrl};
        }
    },
    {urls: [
        "*://www.avito.ru/*",
        "*://*.domclick.ru/*",
        "*://*.cian.ru/*"
    ]},
    ["blocking"]
);
