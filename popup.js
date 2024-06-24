// popup.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('settingsForm');
    const keyboardShortcutInput = document.getElementById('keyboardShortcut');
    const themeSelect = document.getElementById('theme');
    const linkCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    const calculateButton = document.getElementById('calculateRiskScore');
    const riskScoreDisplay = document.getElementById('riskScoreDisplay');

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

        chrome.storage.sync.set({settings: newSettings}, () => {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'updateSettings',
                    settings: newSettings
                }, (response) => {
                    if (response && response.status === 'Settings updated') {
                        alert('Settings saved successfully!');
                    } else {
                        alert('Error saving settings. Please try again.');
                    }
                });
            });
        });
    });

    // Calculate Risk Score
    calculateButton.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "getRiskScore"}, function(response) {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                    riskScoreDisplay.textContent = "Error: Unable to calculate score";
                    return;
                }
                if (response && response.riskScore !== undefined) {
                    const scorePercentage = Math.round(response.riskScore * 100);
                    riskScoreDisplay.textContent = `${scorePercentage}%`;
                    riskScoreDisplay.style.color = getColorForScore(response.riskScore);
                } else {
                    riskScoreDisplay.textContent = "Error calculating score";
                    riskScoreDisplay.style.color = "red";
                }
            });
        });
    });

    function getColorForScore(score) {
        const hue = (1 - score) * 120; // 120 for green (low risk), 0 for red (high risk)
        return `hsl(${hue}, 100%, 50%)`;
    }
});