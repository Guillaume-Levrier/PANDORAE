const fluxButtonClicked = (buttonElement, aftermath, buttonText) => {
  //buttonElement.style.transition = "all 1s ease-in"; // Animate button
  buttonElement.style.backgroundPosition = "left bottom"; // Move background white->black
  buttonElement.style.color = "white"; // Change button font color to white

  if (buttonText) {
    buttonElement.innerText = buttonText;
  }

  switch (aftermath) {
    case "timeout":
      buttonElement.disabled = true;
      buttonElement.style.cursor = "not-allowed";
      setTimeout(() => {
        buttonElement.style.backgroundPosition = "right bottom"; // Move background white->black
        buttonElement.style.color = "black"; // Change button font color to white
        buttonElement.disabled = false;
        buttonElement.style.cursor = "pointer";
      }, 2500);
      break;

    case "disable":
      buttonElement.disabled = true;
      buttonElement.style.cursor = "not-allowed";

    default:
      break;
  }
};

export { fluxButtonClicked };
