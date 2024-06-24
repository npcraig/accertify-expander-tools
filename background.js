// background.js
chrome.runtime.onInstalled.addListener(() => {
    // Initialize default settings
    chrome.storage.sync.set({
      settings: {
        keyboardShortcut: 'ctrl+shift+O',
        selectedLinks: [true, true, true, true],
        theme: 'default'
      }
    });
  
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
  
    // Add Settings option
    chrome.contextMenus.create({
      id: "settings",
      parentId: "accertifyExpander",
      title: "Settings",
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
        files: ["resolveOrder.js"]
      });
    } else if (info.menuItemId === "maliciousShilling") {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ["maliciousShilling.js"]
      });
    } else if (info.menuItemId === "settings") {
      chrome.windows.create({
        url: 'settings.html',
        type: 'popup',
        width: 400,
        height: 600
      });
    }
  });
  
  // Listen for messages from the settings page
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'saveSettings') {
      chrome.storage.sync.set({ settings: request.settings }, () => {
        // Notify all tabs about the updated settings
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id, { action: 'updateSettings', settings: request.settings });
          });
        });
        sendResponse({status: 'Settings saved'});
      });
      return true; // Indicates that the response is sent asynchronously
    }
  });