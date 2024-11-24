document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.sendMessage({getStatus: true}, function(response) {
        document.getElementById('toggleSwitch').checked = response.isActive;
    });

    document.getElementById('toggleSwitch').addEventListener('change', function() {
        const isActive = this.checked;
        chrome.runtime.sendMessage({isActive: isActive});
    });
});
