// content.js

let settings = {
  keyboardShortcut: 'ctrl+shift+O',
  selectedLinks: [true, true, true, true],
  theme: 'default'
};

const selectors = [
  'body > md-content > md-content > div.layout-column.flex > md-content > acc-main-container > main > div > div > div.transaction-detail > div:nth-child(2) > div.summaryPortlet > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div > div > div.row.portlet-body-wrapper > div > div:nth-child(3) > table > tbody > tr:nth-child(2) > td:nth-child(2) > a',
  'body > md-content > md-content > div.layout-column.flex > md-content > acc-main-container > main > div > div > div.transaction-detail > div:nth-child(2) > div.summaryPortlet > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div > div > div.row.portlet-body-wrapper > div > div:nth-child(3) > table > tbody > tr:nth-child(4) > td:nth-child(2) > a',
  'body > md-content > md-content > div.layout-column.flex > md-content > acc-main-container > main > div > div > div.transaction-detail > div:nth-child(2) > div.summaryPortlet > div:nth-child(2) > div:nth-child(3) > div:nth-child(3) > div > div > div.row.portlet-body-wrapper > div > div > table > tbody > tr:nth-child(2) > td:nth-child(2) > a',      
  'body > md-content > md-content > div.layout-column.flex > md-content > acc-main-container > main > div > div > div.transaction-detail > div:nth-child(2) > div.summaryPortlet > div:nth-child(2) > div:nth-child(3) > div:nth-child(3) > div > div > div.row.portlet-body-wrapper > div > div > table > tbody > tr:nth-child(3) > td:nth-child(2) > a'
];

function openLinksInNewTabs() {
  selectors.forEach((selector, index) => {
    if (settings.selectedLinks[index]) {
      const link = document.querySelector(selector);
      if (link) {
        window.open(link.href, '_blank');
      }
    }
  });
}

function handleKeyboardShortcut(event) {
  const keys = settings.keyboardShortcut.toLowerCase().split('+');
  const eventKey = event.key.toLowerCase();
  
  if (
    (keys.includes('ctrl') === event.ctrlKey) &&
    (keys.includes('shift') === event.shiftKey) &&
    (keys.includes('alt') === event.altKey) &&
    keys.includes(eventKey)
  ) {
    openLinksInNewTabs();
  }
}

document.addEventListener('keydown', handleKeyboardShortcut);

function displayRiskScore(score) {
  const riskScoreElement = document.createElement('div');
  riskScoreElement.id = 'risk-score-display';
  riskScoreElement.innerHTML = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="none" stroke="#ccc" stroke-width="10" />
      <path d="M50 5 A45 45 0 ${score > 0.5 ? 1 : 0} 1 ${50 + 45 * Math.sin(2 * Math.PI * score)} ${50 - 45 * Math.cos(2 * Math.PI * score)}"
            fill="none" stroke="${getColorForScore(score)}" stroke-width="10" />
      <text x="50" y="50" text-anchor="middle" dy="7" font-size="20" fill="#333">${Math.round(score * 100)}%</text>
    </svg>
    <p>Risk Score</p>
  `;
  
  const targetElement = document.querySelector('body > md-content > md-content > div.layout-column.flex > md-content > acc-main-container > main > div > div > div.transaction-detail > div:nth-child(2) > div.summaryPortlet');
  
  if (targetElement) {
    targetElement.insertAdjacentElement('afterend', riskScoreElement);
  } else {
    document.body.appendChild(riskScoreElement);
  }

  setTimeout(() => {
    riskScoreElement.style.transform = 'translateY(0)';
    riskScoreElement.style.opacity = '1';
  }, 100);
}

function getColorForScore(score) {
  const hue = (1 - score) * 120;
  return `hsl(${hue}, 100%, 50%)`;
}

function applyTheme() {
  document.body.classList.remove('theme-default', 'theme-dark', 'theme-neon');
  document.body.classList.add(`theme-${settings.theme}`);
}

function injectScript(file, node) {
  const th = document.getElementsByTagName(node)[0];
  const s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', file);
  th.appendChild(s);
}

// Inject the risk_score.js script
injectScript(chrome.runtime.getURL('risk_score.js'), 'body');

// Listen for messages from the background script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateSettings') {
    settings = request.settings;
    applyTheme();
    sendResponse({status: 'Settings updated'});
  } else if (request.action === "getRiskScore") {
    const firstName = document.querySelector('body > md-content > md-content > div.layout-column.flex > md-content > acc-main-container > main > div > div > div.transaction-detail > div:nth-child(2) > div.summaryPortlet > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > div > div.row.portlet-body-wrapper > div > div:nth-child(3) > table > tbody > tr:nth-child(7) > td:nth-child(2)').textContent.trim();
    const lastName = document.querySelector('body > md-content > md-content > div.layout-column.flex > md-content > acc-main-container > main > div > div > div.transaction-detail > div:nth-child(2) > div.summaryPortlet > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > div > div.row.portlet-body-wrapper > div > div:nth-child(3) > table > tbody > tr:nth-child(8) > td:nth-child(2)').textContent.trim();
    const email = document.querySelector('body > md-content > md-content > div.layout-column.flex > md-content > acc-main-container > main > div > div > div.transaction-detail > div:nth-child(2) > div.summaryPortlet > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > div > div.row.portlet-body-wrapper > div > div:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(2) > span > span > span > span').textContent.trim();

    // Use a promise to handle the asynchronous nature of calculateRiskScore
    new Promise((resolve) => {
      const checkRiskScoreFunction = setInterval(() => {
        if (window.calculateRiskScore) {
          clearInterval(checkRiskScoreFunction);
          resolve(window.calculateRiskScore(firstName, lastName, email));
        }
      }, 100);
    }).then(riskScore => {
      sendResponse({riskScore: riskScore});
    });

    return true; // Indicates that the response will be sent asynchronously
  }
});

// Initial setup
chrome.storage.sync.get('settings', (data) => {
  if (data.settings) {
    settings = data.settings;
    applyTheme();
  }
});

// Display risk score on page load
window.addEventListener('load', async () => {
  const firstName = document.querySelector('body > md-content > md-content > div.layout-column.flex > md-content > acc-main-container > main > div > div > div.transaction-detail > div:nth-child(2) > div.summaryPortlet > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > div > div.row.portlet-body-wrapper > div > div:nth-child(3) > table > tbody > tr:nth-child(7) > td:nth-child(2)').textContent.trim();
  const lastName = document.querySelector('body > md-content > md-content > div.layout-column.flex > md-content > acc-main-container > main > div > div > div.transaction-detail > div:nth-child(2) > div.summaryPortlet > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > div > div.row.portlet-body-wrapper > div > div:nth-child(3) > table > tbody > tr:nth-child(8) > td:nth-child(2)').textContent.trim();
  const email = document.querySelector('body > md-content > md-content > div.layout-column.flex > md-content > acc-main-container > main > div > div > div.transaction-detail > div:nth-child(2) > div.summaryPortlet > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > div > div.row.portlet-body-wrapper > div > div:nth-child(3) > table > tbody > tr:nth-child(1) > td:nth-child(2) > span > span > span > span').textContent.trim();

  // Wait for the calculateRiskScore function to be available
  const checkRiskScoreFunction = setInterval(async () => {
    if (window.calculateRiskScore) {
      clearInterval(checkRiskScoreFunction);
      const riskScore = await window.calculateRiskScore(firstName, lastName, email);
      displayRiskScore(riskScore);
    }
  }, 100);
});