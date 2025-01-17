chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['content.js']
            });
        }
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'updateView') {
        const liveView = document.getElementById('live-view');
        if (liveView) {
            liveView.innerText = JSON.stringify(message.data, null, 2);
        }
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'updateView') {
        chrome.runtime.sendMessage(message);
    }
});
