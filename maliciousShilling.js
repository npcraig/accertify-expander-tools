async function simulateTyping(element, text) {
    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i);
      element.value += char;
      element.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event after each character
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate typing delay
    }
  }
  
  async function simulateArrowDown(element, times) {
    for (let i = 0; i < times; i++) {
      element.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowDown', 'keyCode': 40}));
      await new Promise(resolve => setTimeout(resolve, 100)); // Delay to simulate user arrow key navigation
    }
  }
  
  async function handleMaliciousShilling() {
    // Open "Quick Notes" and wait for options to appear
    document.querySelector("#header-portlet-4 > div > div").click();
    await new Promise(resolve => setTimeout(resolve, 500));
  
    // Select the necessary checkboxes
    document.querySelector("#group-0-question-3-yes").click();
    document.querySelector("#group-0-question-13-yes").click();
  
    // Open the "SFH" popup
    document.querySelector("#button-quick-resolve-0").click();
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    // Input the note
    const noteTextArea = document.querySelector("#resolve-note-textarea");
    noteTextArea.focus(); // Ensure focus before setting value
    noteTextArea.value = "Malicious shilling regional trend - Resolved with Accertify Expander Tools";
    noteTextArea.dispatchEvent(new Event('input', { bubbles: true })); // Mimic user typing to ensure the input is captured
  
    await new Promise(resolve => setTimeout(resolve, 500)); // Wait for the note to be processed
  
    // Click "Save" to finalize the resolution
    document.querySelector("#resolve-save-bottom > span").click();
  }
  
  handleMaliciousShilling();
  
  
  