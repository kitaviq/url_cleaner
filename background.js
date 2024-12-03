let currentVersion = "1.1.2";
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

// Добавление правил для declarativeNetRequest
chrome.declarativeNetRequest.updateDynamicRules({
    addRules: [{
        "id": 1,
        "priority": 1,
        "action": {
            "type": "redirect",
            "redirect": {
                "regexSubstitution": "\\0"
            }
        },
        "condition": {
            "urlFilter": "|https://www.avito.ru/.*",
            "resourceTypes": ["main_frame", "sub_frame"]
        }
    }, {
        "id": 2,
        "priority": 1,
        "action": {
            "type": "allow"
        },
        "condition": {
            "urlFilter": "|https://www.avito.ru/clickstream/events",
            "resourceTypes": ["xmlhttprequest", "script"]
        }
    }, {
        "id": 3,
        "priority": 1,
        "action": {
            "type": "allow"
        },
        "condition": {
            "urlFilter": "|https://www.avito.ru/stat/radar",
            "resourceTypes": ["xmlhttprequest", "script"]
        }
    }, {
        "id": 4,
        "priority": 1,
        "action": {
            "type": "allow"
        },
        "condition": {
            "urlFilter": "|https://www.avito.ru/web/1/items/phone",
            "resourceTypes": ["xmlhttprequest", "script"]
        }
    }],
    removeRuleIds: [1, 2, 3, 4]
});

// Удаление блока mortgage broker
chrome.webNavigation.onCompleted.addListener(function(details) {
    chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        func: () => {
            const element = document.querySelector(".style-mortgage-broker-wrapper-blk8j.js-mortgage-broker");
            if (element) {
                element.remove();
            }
        }
    });
}, {url: [{urlMatches: '.*://www.avito.ru/.*'}]});
