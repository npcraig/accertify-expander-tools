chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateSidebar") {
        document.getElementById('content-frame').src = request.url;
    }
});