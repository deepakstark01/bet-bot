let outcomes = []; // Array to store the win/loss pattern
let winPatternCount = 0;
const requiredWinPatterns = 5; // Number of valid patterns needed
let winRatio = 33.33; // Default win ratio
let rollover = 0;
const speedcontrol =700; // speed in milliseconds limit is 700 
// 3 or more losses followed by a win -> win point
const validWinPatternt = {
  pattern: ['L', 'L', 'L', 'W'],
};

// Reset patterns 2 or less losses followed by a win -> reset
const resetPatterns = [
  ['L', 'W'],
  ['L', 'L', 'W'],
  ['L', 'L', 'L', 'W', 'W'],
];

// Function to introduce delay
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to update the win ratio on the UI
function setWinRatio(ratio) {
  const inputField = document.querySelector('input[data-test="chance"]');
  if (inputField) {
    inputField.value = ratio;
    inputField.dispatchEvent(new Event('input', { bubbles: true }));
    console.log(`Win ratio set to: ${ratio}`);
  } else {
    console.log('Win ratio input field not found.');
  }
}

// Function to start the auto-betting cycle
async function startAutoBet() {
  const betButton = document.querySelector('button[data-test="bet-button"]');
  if (betButton) {
    // Add a delay of 1 second before starting the betting
    betButton.click();
    console.log('Auto-bet started');
  } else {
    console.log('Auto-bet button not found');
  }
}

// Function to check results and update the pattern
// Function to check results and update the pattern using MutationObserver
function checkResults() {
  // Target the container that holds the results
  const resultsContainer = document.querySelector('div.past-bets.svelte-1cfosht');

  // Create an instance of MutationObserver
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.tagName === 'BUTTON' && node.classList.contains('button-tag')) {
          const resultNum = parseFloat(node.textContent.trim());
          
          // Determine if it's a win based on rollover
          if (resultNum >rollover) {
            console.log(`W: ${resultNum}  > Rollover: ${rollover}`);
            outcomes.push('W');
          } else {
            console.log(`L: ${resultNum} < Rollover: ${rollover}`);
            outcomes.push('L');
          }

          // Log outcomes and evaluate patterns
          console.log(outcomes);
          evaluatePatterns();

          // Check if win pattern count reaches the required patterns
          if (winPatternCount >=requiredWinPatterns) {
            stopAutoBet() ;
            notifyUser();
            console.log('Win pattern detected');  
            observer.disconnect();  // Stop observing
          }
        }
      });
    });
  });

  // Configuration of the observer:
  const config = { childList: true, subtree: true };

  // Start observing
  if (resultsContainer) {
    observer.observe(resultsContainer, config);
  } else {
    console.log('Results container not found');
  }
}
// Function to check for valid win or reset patterns
function evaluatePatterns() {
  // Check for a valid win pattern: 3 or more losses followed by a win
  if (outcomes.length >= 4) {  // Minimum length for a valid win pattern
    let lastOutcome = outcomes[outcomes.length - 1];
    if (lastOutcome === 'W') { // Check if the last outcome is a win
      // Check if there are at least 3 losses before the last win
      let lossCount = 0;
      for (let i = outcomes.length - 2; i >= 0 && outcomes[i] === 'L'; i--) {
        lossCount++;
      }
      if (lossCount >= 3) {
        outcomes.length = 0; // Clear outcomes to reset
        winPatternCount++;
        console.log(`Valid win pattern detected after ${lossCount} losses. Total valid patterns: ${winPatternCount}`);
      }
    }
  }

  // Check reset patterns: 2 or less losses followed by a win
  if (outcomes.length >= 2 && outcomes[outcomes.length - 1] === 'W') {
    let lossCount = 0;
    for (let i = outcomes.length - 2; i >= 0 && outcomes[i] === 'L'; i--) {
      lossCount++;
    }
    if (lossCount <= 2) {
      outcomes.length = 0; // Clear outcomes to reset
      winPatternCount = 0; // Reset win pattern count
      console.log(`Reset pattern detected after ${lossCount} losses. Outcomes and count reset.`);
    }
  }
}


// Function to stop the auto-betting
function stopAutoBet() {
    console.log('Auto-bet stopped');
    clearInterval(autoBetInterval);
}

// Function to notify the user
function notifyUser() {
  // alert(`${requiredWinPatterns} : valid win patterns detected!`);
  beepboop();
  console.log('Notifying user we got the required win patterns');
}

// Function to set the rollover value
function setRollOver() {
  rollover = parseFloat(document.querySelector('input[data-test="reverse-roll"]').value);
  console.log({rollover});
}

// Initialize the betting process
async function initiateBettingCycle() {
 
  checkResults();
}
winPatternCount = 0;
outcomes.length = 0; // Clear the outcomes array
setWinRatio(winRatio);
await delay(3000);
setRollOver();
await delay(3000);
// Start the betting cycle


autoBetInterval = setInterval(() => {
  startAutoBet(); 
}, speedcontrol);
initiateBettingCycle();

function beepboop() {
for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    beep();
  }, i * 250);
}
}


function beep() {
  const snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
  snd.play();
}
