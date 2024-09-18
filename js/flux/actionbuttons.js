//========== fluxButtonAction ==========
// fluxButtonAction makes flux button change shape on click. It takes 4 arguments:
// - buttonID is the id of the DOM input button to be modified
// - success is a boolean, true means the action succeeded, false that it failed
// - successPhrase is the string to be displayed as button value (the text of the button) if success = true
// - errorPhrase is the same thing if success = false

const fluxButtonAction = (
  buttonElement,
  success,
  successPhrase,
  errorPhrase
) => {
  //to be moved to the DOM builder
  /* buttonElement.style.transition = "all 1s ease-out"; // Animate button
  buttonElement.style.backgroundPosition = "left bottom"; // Move background white->black
  buttonElement.style.color = "white"; // Change button font color to white
 */
  /*   if (success) {
    // If success = true
    buttonElement.innerText = successPhrase; // Display success phrase
  } else {
    // If success = false
    buttonElement.innerText = errorPhrase; // Display error phrase
  }

  // Disable button after request to prevent external request spamming and subsequent API throttling.
  buttonElement.disabled = true; */
};

const fluxButtonClicked = (buttonElement, disable, buttonText) => {
  //buttonElement.style.transition = "all 1s ease-in"; // Animate button
  buttonElement.style.backgroundPosition = "left bottom"; // Move background white->black
  buttonElement.style.color = "white"; // Change button font color to white
  buttonElement.disabled = disable;
  buttonElement.style.cursor = disable ? "not-allowed" : "pointer";

  if (buttonText) {
    buttonElement.innerText = buttonText;
  }

  if (!disable) {
    // reset the style
    setTimeout(() => {
      buttonElement.style.backgroundPosition = "right bottom"; // Move background white->black
      buttonElement.style.color = "black"; // Change button font color to white
    }, 1300);
  }
};

export { fluxButtonAction, fluxButtonClicked };
