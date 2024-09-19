var pump = {};
let coreLogoArchive = "";
var pandoratio = 0;

const resetPandoratio = () => (pandoratio = 0);

const pulse = (status, coeff, rhythm, clear) => {
  let rate = (number) => {
    status = status += 0.1 * coeff;
    let pulseValue = 0.05 + 0.05 * Math.sin(number);
    pandoratio = pulseValue;
  };

  if (clear) {
    clearInterval(pump);
    detransfect();
  } else {
    pump = setInterval(() => {
      rate(status);
    }, rhythm);
  }
};

var decrement = 0;
var floor = 0;

const detransfect = () => {
  var reach = true;
  decrement = 0.0004;
  floor = 0;

  function decondense() {
    if (reach == true && pandoratio > floor) {
      pandoratio -= decrement;

      if (pandoratio === floor) {
        reach = false;
      }
    } else {
      reach = false;
    }
  }
  setInterval(decondense, 1);
};

// ====== PROGRESS BAR ======

const progBarSign = (prog) => {
  prog = parseInt(prog);
  if (prog > 100) {
    prog = 100;
  }
  document.getElementById("version").style.backgroundImage =
    "linear-gradient(0.25turn,rgba(0,0,255,0.3) 0%,rgba(0,0,255,0.3) " +
    prog +
    "%,transparent " +
    (prog + 0.1) +
    "%)";
};

/* ipcRenderer.on("progressBar", (event, prog) => {
  progBarSign(prog);
});
 */

// ========== CORE SIGNALS ===========
// TO BE REINSTATED

/* 
window.electron.coreSignal((message) => {
  try {
    field.value = message;
  } catch (err) {
    field.value = err;
  }
});

ipcRenderer.on("chaeros-notification", (event, message, options) => {
  field.value = message;
  if (message === "return to tutorial") {
    tutoSlide = options;
  }
});

ipcRenderer.on("chaeros-failure", (event, message) => {
  field.value = message;
  window.electron.send("audio-channel", "error");
});

ipcRenderer.on("pulsar", (event, message) => {
  pulse(1, 1, 10, message);
}); */

const nameDisplay = (name) => {
  document
    .getElementById("core-logo")
    .animate([{ opacity: 1 }, { opacity: 0 }], 700);

  let display = "";

  for (var i = 0; i < name.length; i++) {
    display = display + name[i];
  }

  coreLogoArchive = name;
  document.getElementById("core-logo").innerHTML = display;
  document
    .getElementById("core-logo")
    .animate([{ opacity: 0 }, { opacity: 1 }], 700);
};

export { nameDisplay, pulse, resetPandoratio };
