const saveSlides = () => {
  let name = document.getElementById("presNamer").value;
  mainPresContent[activeIndex].text =
    document.getElementsByClassName("ql-editor")[0].innerHTML;
  let date =
    new Date().toLocaleDateString() + "-" + new Date().toLocaleTimeString();
  if (priorDate) {
    date = priorDate;
  }
  let id = name + date;
  pandodb.slider.put({
    id: id,
    date: date,
    name: name,
    content: mainPresContent,
  });
};

const slideCreator = () => {
  nameDisplay("");
  document.getElementById("version").innerHTML = "";
  field.style.display = "none";
  document.removeEventListener("keydown", keyShortCuts);
  document.getElementById("menu-icon").addEventListener("click", () => {
    document.body.style.animation = "fadeout 0.1s";
    setTimeout(() => {
      document.body.remove();
      location.reload();
    }, 100);
  });

  iconCreator("save-icon", saveSlides, "Save slides");

  var quillCont = document.createElement("div");
  quillCont.style.margin = "15%";
  quillCont.style.width = "70%";
  quillCont.style.height = "400px";
  quillCont.style.backgroundColor = "white";
  quillCont.style.zIndex = "7";
  quillCont.style.pointerEvents = "all";
  quillCont.style.position = "fixed";

  var textCont = document.createElement("div");
  textCont.id = "textcontainer";
  textCont.style =
    "background-color:rgba(0, 10, 10, .8);padding:10px;color:white;";

  quillCont.appendChild(textCont);

  document.getElementById("mainSlideSections").appendChild(quillCont);
  quillEdit = new Quill("#textcontainer", {
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        ["image", "code-block", "link"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
      ],
    },
    placeholder: "",
    theme: "snow",
  });

  var slideToolbar = document.createElement("div");
  slideToolbar.style.float = "right";
  slideToolbar.innerHTML =
    "<input type='field' placeholder='Presentation name' id='presNamer'>" +
    " <input type='button' id='▲' value='▲'>" +
    " <input type='button' id='▼' value='▼'>" +
    " <input type='button' id='+' value='+'>" +
    " <input type='button' id='-' value='-'>" +
    " <input type='button' id='typeSelector' value='TYPE'>" +
    " <input type='field' placeholder='Slide reference name' value='begin' id='slidetitle'>";

  mainPresContent.push({ title: "begin", text: "" });

  document.getElementsByClassName("ql-toolbar")[0].appendChild(slideToolbar);
  document.getElementById("typeSelector").addEventListener("click", typeSelect);
  document.getElementById("▲").addEventListener("click", (e) => {
    slideSaver(-1);
  });
  document.getElementById("▼").addEventListener("click", (e) => {
    slideSaver(1);
  });
  document.getElementById("+").addEventListener("click", (e) => {
    let newSlideTitle = "slide" + parseInt(activeIndex + 1);
    mainPresContent.splice(activeIndex + 1, 0, {
      title: newSlideTitle,
      text: "",
    });
    slideSaver(1);
    //                                  activeIndex+=1;
  });
  document.getElementById("-").addEventListener("click", (e) => {
    mainPresContent.splice(activeIndex, 1);
    slideSaver(-1);
  });

  const slideSaver = (delta) => {
    let editor = document.getElementsByClassName("ql-editor")[0];
    let slidetitle = document.getElementById("slidetitle");
    if (activeIndex > -1) {
      // save current slide
      mainPresContent[activeIndex].title = slidetitle.value;
      mainPresContent[activeIndex].text = editor.innerHTML;
      // add delta
      activeIndex += delta;
      // display next slide
      slidetitle.value = mainPresContent[activeIndex].title;
      editor.innerHTML = mainPresContent[activeIndex].text;
    }
  };
};

const slideDisp = (block) => {
  document.body.style.overflow = "auto";

  switch (block) {
    case "load":
      field.value = "loading presentations";
      listTableDatasets("slider");
      toggleTertiaryMenu();

      break;
    case "edit":
      field.value = "loading presentations";
      mainPresEdit = true;
      listTableDatasets("slider");
      toggleTertiaryMenu();
      break;
    case "create":
      slideCreator();
      toggleMenu();
      break;
  }
};

var quillEdit;

ipcRenderer.on("backToPres", (event, message) => {
  setTimeout(() => {
    populateSlides(message.id);
    setTimeout(() => {
      // the DOM needs to be there
      smoothScrollTo(message.step);
      document.body.style.overflow = "auto";
    }, 1500);
  }, 200);
});

const selectOption = (type, id) => {
  if (typeSelector) {
    let order =
      "[actionType:" +
      JSON.stringify(type) +
      "," +
      JSON.stringify(id) +
      "/actionType]";
    let editor = document.getElementsByClassName("ql-editor")[0];
    editor.innerHTML = editor.innerHTML + order;
    typeSelector = false;
    toggleMenu();
  } else {
    if (toggledMenu) {
      toggleMenu();
    }

    document.getElementById("menu-icon").onclick = "";
    document.getElementById("menu-icon").addEventListener(
      "click",
      () => {
        location.reload();
      },
      { once: true }
    );
    field.value = CM.global.field.starting + " " + type;
    currentType = { type: type, id: id };
    //types.typeSwitch(type, id);

    // Give time to the menu to get closed
    setTimeout(() => typeSwitch(type, id), 400);

    window.electron.send("audio-channel", "button2");
    pulse(1, 1, 10);
    window.electron.send(
      "console-logs",
      CM.console.starting[0] +
        type +
        CM.console.starting[1] +
        JSON.stringify(id)
    );
  }
};
