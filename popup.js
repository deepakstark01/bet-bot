document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("startBetting").addEventListener("click", () => {
    const winRatio = parseInt(document.getElementById("winRatio").value, 10) || 33; // Default to 33 if no value is provided
    chrome.runtime.sendMessage({ action: "startBetting", ratio: winRatio }); // Send a message to start the cycle
  });

  document.getElementById("stopBetting").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "stopBetting" }); // Send a message to stop the cycle
  });
});
