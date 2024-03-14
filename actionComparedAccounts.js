async function actionComparedAccounts() {
  // Step 1: Interact with the 'Take Action' button
  document.querySelector("#compare-actions > input.bulk-admin-action.btn.btn-secondary.btn-small").click();
  
  // Wait for navigation to new page
  await new Promise(resolve => setTimeout(resolve, 2000)); // Adjust timing as necessary

  // Assuming the next steps are in the callback or next content script execution after navigation
}

// Since navigating to a new page, consider splitting the script or dynamically injecting the next part of the script post-navigation
actionComparedAccounts();

// Additional steps would be added here or in a separate script, depending on how you handle page navigation in your extension
function showCompletionBanner() {
    const banner = document.createElement('div');
    banner.style.position = 'fixed';
    banner.style.top = '50%';
    banner.style.left = '50%';
    banner.style.transform = 'translate(-50%, -50%)';
    banner.style.backgroundColor = 'lightgreen';
    banner.style.padding = '20px';
    banner.style.zIndex = '1000';
    banner.innerText = "Tab can be closed if users were actioned";
  
    // Add an image or additional styling as needed
    document.body.appendChild(banner);
  
    // Automatically remove the banner after a few seconds if desired
    setTimeout(() => banner.remove(), 3000);
  }
  
  // Call showCompletionBanner at the appropriate time in your script
  