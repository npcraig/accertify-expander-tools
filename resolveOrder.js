function performApprovalProcess() {
    // Click "Quick Notes"
    document.querySelector("#header-portlet-4 > div > div").click();
  
    // Wait a bit for the options to show up, then click the checkboxes
    setTimeout(() => {
      document.querySelector("#group-0-question-2-no").click();
      document.querySelector("#group-0-question-3-no").click();
  
      // Open "All Notes"
      document.querySelector("#header-portlet-3 > div > span").click();
  
      // Wait for the text area to be visible
      setTimeout(() => {
        const textArea = document.querySelector("#header-portlet-3 > div > div > div > div.row.add-note-button-wrapper > div.col-md-10 > textarea");
        textArea.value = "Resolved with Accertify Expander Tools";
  
        // Click the Approve button
        document.querySelector("#button-quick-resolve-2 > div").click();
      }, 500); // Adjust timeout as necessary
    }, 500); // Adjust timeout as necessary
  }
  
  performApprovalProcess();
  