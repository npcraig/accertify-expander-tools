function openLinksInNewTabs() {
  const selectors = [
    'body > md-content > md-content > div.layout-column.flex > md-content > acc-main-container > main > div > div > div.transaction-detail > div:nth-child(2) > div.summaryPortlet > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div > div > div.row.portlet-body-wrapper > div > div:nth-child(3) > table > tbody > tr:nth-child(2) > td:nth-child(2) > a',
    'body > md-content > md-content > div.layout-column.flex > md-content > acc-main-container > main > div > div > div.transaction-detail > div:nth-child(2) > div.summaryPortlet > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div > div > div.row.portlet-body-wrapper > div > div:nth-child(3) > table > tbody > tr:nth-child(4) > td:nth-child(2) > a',
    'body > md-content > md-content > div.layout-column.flex > md-content > acc-main-container > main > div > div > div.transaction-detail > div:nth-child(2) > div.summaryPortlet > div:nth-child(2) > div:nth-child(3) > div:nth-child(3) > div > div > div.row.portlet-body-wrapper > div > div > table > tbody > tr:nth-child(2) > td:nth-child(2) > a',      
    'body > md-content > md-content > div.layout-column.flex > md-content > acc-main-container > main > div > div > div.transaction-detail > div:nth-child(2) > div.summaryPortlet > div:nth-child(2) > div:nth-child(3) > div:nth-child(3) > div > div > div.row.portlet-body-wrapper > div > div > table > tbody > tr:nth-child(3) > td:nth-child(2) > a'
  ];
  
    selectors.forEach(selector => {
      const link = document.querySelector(selector);
      if (link) {
        window.open(link.href, '_blank');
      }
    });
  }
  
  openLinksInNewTabs();
  