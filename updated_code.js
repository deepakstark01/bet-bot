let outcomes = []; // Array to store the win/loss pattern
let winPatternCount = 0;
const requiredWinPatterns = 3; // Number of valid patterns needed
let winRatio = 33; // Default win ratio


const validWinPatternt ={
  'pattern':['L','L','L','W'],
}

const ResetPatternt ={
  'pattern':['L','W'],
  'pattern':['L','L','W'],
  'pattern':['L','L','L','W','W'],

}
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

// Function to check results and update the pattern
function checkResults() {
  // Monitoring results at short intervals
  const resultCheckInterval = setInterval(() => {
    const resultElement = document.querySelector('div.past-bets.svelte-1cfosht.full button.button-tag');
    
    if (resultElement) {
      const resultNum = parseFloat(resultElement.textContent.trim());
      
      // If it's a win
      if (resultNum > winRatio) {
        console.log(`W: ${resultNum}`);
        outcomes.push("W");
      } else {
        
        console.log(`L: ${resultNum}`);
        outcomes.push("L");
      }

      if (winPatternCount >= requiredWinPatterns) {
        notifyUser();
        stopAutoBet();
        clearInterval(resultCheckInterval); // Stop checking results
      }
    } else {
      console.log("No result element found.");
    }
  }, 1000); // Checking every second
}


// Function to stop the auto-betting
function stopAutoBet() {
  const stopButton = document.querySelector('button[data-test="auto-bet-button"]');
  if (stopButton) {
    stopButton.click();
    console.log("Auto-bet stopped");
  } else {
    console.log("Stop auto-bet button not found");
  }
}

// Function to notify the user
function notifyUser() {
  alert("Three valid win patterns detected!");
}

// Initialize the betting process
function initiateBettingCycle() {
  winPatternCount = 0;
  outcomes = []; // Reset the outcomes array
  setWinRatio(winRatio);
  startAutoBet();
  checkResults();
}

initiateBettingCycle();
