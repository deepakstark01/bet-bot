let lossCount = 0;
let winCount = 0;
const requiredWins = 3;
let betting = false;
let winRatio = 33; // Default win ratio
let bettingInterval = null; // Store interval ID for starting/stopping the cycle
// Handle messages from popup to set win ratio or start/stop betting
chrome.runtime.onMessage.addListener( async (message, sender, sendResponse) => {
  if (message.action === 'startBetting') {
    winRatio = message.ratio;
    console.log("Setting win ratio", winRatio);
    await setWinRatio(winRatio);
    console.log("Starting betting cycle");
   await startBettingCycle();
    sendResponse({status: "Betting started"}); // Respond back if necessary
  }
  if (message.action === 'stopBetting') {
    stopBettingCycle();
    sendResponse({status: "Betting stopped"}); // Respond back if necessary
  }
});

// Function to set the win ratio
async function setWinRatio(ratio) {
  const inputField = document.evaluate("//input[@data-test='chance']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  
  if (inputField) {
    inputField.value = ratio; // Set the input field with the provided ratio
    inputField.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event to simulate user interaction
    console.log(`Win ratio set to: ${ratio}`);
  } else {
    console.log("Win ratio input field not found.");
  }
}

// Function to click the "Bet" button
async function clickBetButton() {
  const betButton = document.evaluate("//button[@data-test='bet-button']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  
  if (betButton) {
    betButton.click();
    console.log("Bet button clicked");
  } else {
    console.log("Bet button not found");
  }
}

// Function to check the result and determine if the win ratio is met
async function checkResult() {
  const resultElement = document.evaluate("(//div[@class='past-bets svelte-1cfosht full']/button)[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  console.log(resultElement ? resultElement.textContent : "No result element found");

  if (resultElement) {
    const resultNum = parseInt(resultElement.textContent.trim());
    
    if (resultNum > winRatio) {
      winCount++;
      lossCount = 0;
      console.log(`Win detected. Total wins: ${winCount}`);
    } else {
      lossCount++;
      console.log(`Loss detected. Total losses: ${lossCount}`);
    }

    if (lossCount >= 3) {
      betting = true; // Start betting after 3 or more losses
    }

    if (winCount >= requiredWins) {
      betting = false; // Stop betting after required wins
      winCount = 0;
      console.log("Win streak met, stopping bets.");
      stopBettingCycle(); // Stop the cycle after required wins
    }
  }
}

// Betting logic
async function startBettingCycle() {
  betting = true; // Start betting
  console.log("Betting started");
  
  // Use setInterval to continuously run the betting cycle
  bettingInterval = setInterval(() => {
    if (betting) {
      clickBetButton();
      checkResult();
    }
  }, 3000); // Run every 3 seconds
}

// Function to stop the betting cycle
async function stopBettingCycle() {
  betting = false; // Stop betting
  clearInterval(bettingInterval); // Stop the interval
  bettingInterval = null;
  console.log("Betting stopped");
}

