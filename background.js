// background.js

chrome.runtime.onInstalled.addListener(() => {
    // Create the parent menu
    chrome.contextMenus.create({
        id: "accertifyExpander",
        title: "Accertify Expander Tools",
        contexts: ["all"]
    });

    // Sub-menu for Links
    chrome.contextMenus.create({
        id: "links",
        parentId: "accertifyExpander",
        title: "Links",
        contexts: ["all"]
    });

    // Sub-option under Links
    chrome.contextMenus.create({
        id: "openSellerLinks",
        parentId: "links",
        title: "Open New Seller Links",
        contexts: ["all"]
    });

    // Sub-menu for Approve
    chrome.contextMenus.create({
        id: "approve",
        parentId: "accertifyExpander",
        title: "Approve",
        contexts: ["all"]
    });

    // Sub-option under Approve
    chrome.contextMenus.create({
        id: "approveLowerRisk",
        parentId: "approve",
        title: "Approve - Lower Risk",
        contexts: ["all"]
    });

    // Sub-menu for Deny
    chrome.contextMenus.create({
        id: "deny",
        parentId: "accertifyExpander",
        title: "Deny",
        contexts: ["all"]
    });

    // Sub-option under Deny
    chrome.contextMenus.create({
        id: "maliciousShilling",
        parentId: "deny",
        title: "Malicious Shilling Regional Trend",
        contexts: ["all"]
    });
});

// Execute the appropriate script when a context menu item is clicked
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "openSellerLinks") {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ["content.js"]
        });
    } else if (info.menuItemId === "approveLowerRisk") {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ["resolveOrder.js"] // Ensure this file exists and contains the relevant logic
        });
    } else if (info.menuItemId === "maliciousShilling") {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ["maliciousShilling.js"] // Ensure this file exists and contains the relevant logic
        });
    }
});

