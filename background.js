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
// ... (other menu items remain the same)

    // Sub-menu for Atlas Tools
    chrome.contextMenus.create({
        id: "atlasTools",
        parentId: "accertifyExpander",
        title: "Atlas Tools",
        contexts: ["selection"]
    });

    // Sub-options under Atlas Tools
    chrome.contextMenus.create({
        id: "atlasProfile",
        parentId: "atlasTools",
        title: "Open Atlas Profile",
        contexts: ["selection"]
    });

    chrome.contextMenus.create({
        id: "loginHistory",
        parentId: "atlasTools",
        title: "Open Login History",
        contexts: ["selection"]
    });

    chrome.contextMenus.create({
        id: "purchaseHistory",
        parentId: "atlasTools",
        title: "Open Purchase History",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "openSellerLinks") {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ["content.js"]
        });
    } else if (info.menuItemId === "approveLowerRisk") {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ["resolveOrder.js"]
        });
    } else if (info.menuItemId === "maliciousShilling") {
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ["maliciousShilling.js"]
        });
    } else if (["atlasProfile", "loginHistory", "purchaseHistory"].includes(info.menuItemId)) {
        let url;
        switch (info.menuItemId) {
            case "atlasProfile":
                url = `https://atlas.etsycorp.com/members/${encodeURIComponent(info.selectionText)}`;
                break;
            case "loginHistory":
                url = `https://atlas.etsycorp.com/members/${encodeURIComponent(info.selectionText)}/login_history`;
                break;
            case "purchaseHistory":
                url = `https://atlas.etsycorp.com/members/${encodeURIComponent(info.selectionText)}/transactions/purchases`;
                break;
        }
        if (url) {
            chrome.tabs.create({ url: url });
        }
    }
});