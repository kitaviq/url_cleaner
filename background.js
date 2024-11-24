let currentVersion = "1.1.1";
let isActive = true;

function checkForUpdates() {
    console.log('Checking for updates...');
    fetch("https://raw.githubusercontent.com/kitaviq/url_cleaner/main/version.json")
        .then(response => response.json())
        .then(data => {
            console.log('Fetched version:', data.version);
            if (data.version !== currentVersion) {
                alert("New version available! Please update your extension.");
                chrome.tabs.create({ url: data.downloadUrl });
            }
        })
        .catch(error => console.error('Error fetching version:', error));
}

chrome.runtime.onInstalled.addListener(() => {
    checkForUpdates();
});

chrome.runtime.onStartup.addListener(() => {
    checkForUpdates();
});

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

        // Исключить важные запросы для показа номера
        if (details.url.includes("/clickstream/events") || details.url.includes("/stat/radar") || details.url.includes("/web/1/items/phone")) {
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
