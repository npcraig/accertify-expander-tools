// settings.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('settingsForm');
    const keyboardShortcutInput = document.getElementById('keyboardShortcut');
    const themeSelect = document.getElementById('theme');
    const linkCheckboxes = document.querySelectorAll('input[type="checkbox"]');
  
    // Load current settings
    chrome.storage.sync.get('settings', (data) => {
      if (data.settings) {
        keyboardShortcutInput.value = data.settings.keyboardShortcut;
        themeSelect.value = data.settings.theme;
        data.settings.selectedLinks.forEach((isSelected, index) => {
          linkCheckboxes[index].checked = isSelected;
        });
      }
    });
  
    // Save settings
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const newSettings = {
        keyboardShortcut: keyboardShortcutInput.value,
        selectedLinks: Array.from(linkCheckboxes).map(checkbox => checkbox.checked),
        theme: themeSelect.value
      };
  
      chrome.runtime.sendMessage({action: 'saveSettings', settings: newSettings}, (response) => {
        if (response.status === 'Settings saved') {
          alert('Settings saved successfully!');
        } else {
          alert('Error saving settings. Please try again.');
        }
      });
    });
  });