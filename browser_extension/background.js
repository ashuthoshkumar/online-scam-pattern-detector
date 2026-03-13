// ── BACKGROUND SERVICE WORKER ────────────────────────────

chrome.runtime.onInstalled.addListener(function() {
    console.log('Scam Detector Extension installed!');
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url) {
        // Store last visited URL
        chrome.storage.local.set({lastUrl: tab.url});
    }
});