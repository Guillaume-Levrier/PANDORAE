//======= NARRATIVE FUNCTIONS =======

var zoomed = (targetDrag, transTime) => {
  console.log("error: zoom couldn't load");
};

var dragged = (target, transTime) => {
  console.log("error: drag couldn't load");
};

var currentZoom;
var currentDrag;

const moveTo = (step) => {
  let buttons = document.querySelectorAll("div.presentationStep");

  buttons.forEach((but) => {
    but.style.backgroundColor = "white";
    but.style.color = "black";
  });

  buttons[parseInt(step.stepIndex) - 1].style.backgroundColor = "black";
  buttons[parseInt(step.stepIndex) - 1].style.color = "white";

  if (step.hasOwnProperty("slideContent")) {
    showSlide(step.slideContent);
  } else {
    hideSlide();
  }

  if (step.hasOwnProperty("zoom")) {
    zoomed(step.zoom, 2000);
    currentZoom = step.zoom;
  }

  if (step.hasOwnProperty("drag")) {
    dragged({}, step.drag, 2000);
  }
};

window.addEventListener("keydown", (e) => {
  let buttons = document.querySelectorAll("div.presentationStep");
  let currentButtonId = 0;

  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].style.backgroundColor === "black") {
      currentButtonId = i;
    }
  }

  switch (e.key) {
    case "ArrowRight":
      if (currentButtonId <= buttons.length - 1) {
        moveTo(presentationStep[currentButtonId + 1]);
      }
      break;

    case "ArrowLeft":
      if (currentButtonId >= 1) {
        moveTo(presentationStep[currentButtonId - 1]);
      }
      break;

    case "Backspace":
      if (currentButtonId > 0) {
        //issue here to remove last remaining slide
        presentationStep.splice(currentButtonId, 1);
        regenerateSteps();
      }
      break;
  }
});

// text slides
const createSlide = () => {
  if (document.getElementById("slide")) {
  } else {
    var slide = document.createElement("div");
    slide.id = "slide";

    var slideText = document.createElement("div");
    slideText.id = "slideText";

    var textcontainer = document.createElement("div");
    textcontainer.id = "textcontainer";

    var validateSlide = document.createElement("div");
    validateSlide.id = "validSlide";
    validateSlide.innerText = "✓";
    validateSlide.onclick = () => {
      addPresentationStep();
      hideSlide();
    };

    slideText.appendChild(textcontainer);
    slide.appendChild(slideText);
    slide.appendChild(validateSlide);

    document.body.appendChild(slide);

    var quillEdit = new Quill("#textcontainer", {
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          ["image", "code-block"],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
        ],
      },
      placeholder: "Write here...",
      theme: "snow",
    });

    slide.style.animation = "darken 1s forwards";
    slideText.style.animation = "slideIn 1s forwards";
    validateSlide.style.animation = "slideIn 1s forwards";
  }
};

const showSlide = (text) => {
  if (document.getElementById("slide")) {
    hideSlide();
  }

  var slide = document.createElement("div");
  slide.id = "slide";

  var slideText = document.createElement("div");
  slideText.id = "slideText";
  slideText.className = "ql-snow ql-editor";
  slideText.innerHTML = text;

  slide.appendChild(slideText);

  document.body.appendChild(slide);

  slide.style.animation = "darken 1s forwards";
  slideText.style.animation = "slideIn 1s forwards";
};

const hideSlide = () => {
  if (document.getElementById("slide")) {
    slide.style.animation = "brighten 1s forwards";
    slideText.style.animation = "slideOut 1s forwards";
    setTimeout(() => {
      document.getElementById("slide").remove();
    }, 1100);
  }
};

const stepCreator = (thisStep) => {
  let stepIndex = thisStep.stepIndex;

  var step = document.createElement("DIV");
  step.innerText = stepIndex;
  step.className = "presentationStep";
  step.id = "presentationStep" + parseInt(stepIndex);

  step.addEventListener("click", () => {
    moveTo(presentationStep[parseInt(stepIndex) - 1]);
  });

  presentationBox.appendChild(step);
};

const addPresentationStep = () => {
  let stepData = {
    zoom: currentZoom,
    tooltip: JSON.stringify(tooltip.innerHTML),
    drag: currentDrag,
  };

  if (document.getElementById("slideText")) {
    stepData.slideContent =
      document.getElementsByClassName("ql-editor")[0].innerHTML;
  }

  let buttons = document.querySelectorAll("div.presentationStep");
  let currentButtonId = 0;

  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].style.backgroundColor === "black") {
      currentButtonId = i;
    }
  }

  if (currentButtonId === 0) {
    presentationStep.push(stepData);
  } else {
    presentationStep.splice(currentButtonId + 1, 0, stepData);
  }
  regenerateSteps();
};

const regenerateSteps = () => {
  while (presentationBox.firstChild) {
    presentationBox.removeChild(presentationBox.firstChild);
  }

  for (let i = 0; i < presentationStep.length; i++) {
    presentationStep[i].stepIndex = i + 1;
    stepCreator(presentationStep[i]);
  }
};

const regenPrevSteps = (data) => {
  if (data.hasOwnProperty("presentation")) {
    presentationStep = data.presentation;
    regenerateSteps();
  }
};

const savePresentation = () => {
  pandodb[currentType.type].get(currentType.id).then((data) => {
    data.presentation = presentationStep;
    pandodb[currentType.type].put(data);
  });
};

const backToPres = () => {
  document.body.style.animation = "fadeout 0.7s";
  setTimeout(() => {
    document.body.remove();
    window.electron.send("backToPres", currentMainPresStep);
  }, 700);
};
