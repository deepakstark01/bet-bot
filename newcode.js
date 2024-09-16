let lossCount = 0;
let winCount = 0;
const requiredWins = 3;
let betting = true; // Assume betting starts immediately upon loading the script
let winRatio = 33; // Default win ratio

// Function to update the win ratio on the UI
function setWinRatio(ratio) {
  const inputField = document.querySelector('input[data-test="chance"]');
  if (inputField) {
    inputField.value = ratio;
    inputField.dispatchEvent(new Event('input', { bubbles: true }));
    console.log(`Win ratio set to: ${ratio}`);
  } else {
    console.log("Win ratio input field not found.");
  }
}

// Function to start the auto-betting cycle
function startAutoBet() {
  const betButton = document.querySelector('button[data-test="auto-bet-button"]');
  if (betButton) {
    betButton.click();
    console.log("Auto-bet started");
  } else {
    console.log("Auto-bet button not found");
  }
}

// Function to check results and adjust betting strategy
function checkResults() {
  // Monitoring results at short intervals
  const resultCheckInterval = setInterval(() => {
    const resultElement = document.querySelector('div.past-bets.svelte-1cfosht.full button.button-tag');
    
    if (resultElement) {
      const resultNum = parseInt(resultElement.textContent.trim());
      if (resultNum > winRatio) {
        winCount++;
        lossCount = 0;
        console.log(`${resultNum} Win detected. Total wins: ${winCount}`);
      } else {
        lossCount++;
        console.log(`${resultNum} Loss detected. Total losses: ${lossCount}`);
      }

      if (lossCount >= 3 || winCount >= requiredWins) {
        console.log(lossCount >= 3 ? "Three losses in a row, stopping auto-bet." : "Required win streak achieved, stopping auto-bet.");
        stopAutoBet();
        clearInterval(resultCheckInterval);
        setTimeout(initiateBettingCycle, 3000); // Wait for 3 seconds before restarting
      }
    } else {
      console.log("No result element found");
    }
  }, 1000); // Checking every second
}

// Function to stop the auto-betting
function stopAutoBet() {
  const stopButton = document.querySelector('button[data-test="auto-bet-button"]');
  if (stopButton) {
    stopButton.click();
    console.log("Auto-bet stopped");
    betting = false;
  } else {
    console.log("Stop auto-bet button not found");
  }
}

// Initialize the betting process
function initiateBettingCycle() {
    winCount = 0;
    lossCount = 0;
    setWinRatio(winRatio);
    startAutoBet();
    checkResults();
}

initiateBettingCycle();
