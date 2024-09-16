  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message:", message); // Check received message
    if (message.action === 'startBetting') {
      // Code to start betting
      console.log("Betting started with ratio:", message.ratio);
      sendResponse({status: "startBetting"});
    }
  });