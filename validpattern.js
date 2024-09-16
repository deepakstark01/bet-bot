let outcomes = []; // Array to store the win/loss pattern
let winPatternCount = 0;
const requiredWinPatterns = 3; // Number of valid patterns needed
let winRatio =33.33; // Default win ratio
let rollover=0;
// 3 or more losses followed by a win  -> win point
const validWinPatternt ={
  'pattern':['L','L','L','W'],
}

// 2 loss or less loss followed by a win   -> reset point
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
      if (resultNum > rollover) {
        console.log(`W: ${resultNum}`);
        outcomes.push("W");
      } else {
        
        console.log(`L: ${resultNum}`);
        outcomes.push("L");
      }
      console.log(outcomes);
      checkWin();
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


function checkWin(){
    let pattern = outcomes.slice(-validWinPatternt.pattern.length);
    let resetPattern = outcomes.slice(-ResetPatternt.pattern.length);
    if(JSON.stringify(pattern) === JSON.stringify(validWinPatternt.pattern)){
        winPatternCount++;
        console.log(`Valid win pattern detected. Total valid patterns: ${winPatternCount}`);
    }
    if(JSON.stringify(resetPattern) === JSON.stringify(ResetPatternt.pattern)){
        winPatternCount = 0;
        outcomes = [];
        console.log(`Reset pattern detected. Total valid patterns: ${winPatternCount}`);
    }
 
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


function setRollOver()
{
    rollover= parseFloat(document.querySelector('input[data-test="reverse-roll"]').value);
    console.log(rollover);

}

// Initialize the betting process
function initiateBettingCycle() {
  winPatternCount = 0;
  outcomes = []; // Reset the outcomes array
  setWinRatio(winRatio);
  setTimeout(setRollOver, 1000);
  startAutoBet();
  checkResults();
}
// 
initiateBettingCycle();
