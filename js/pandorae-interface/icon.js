// =========== Icons ===========

const iconTypes = [
  { name: "menu-icon", code: "menu" },
  { name: "option-icon", code: "code" },
  { name: "export-icon", code: "save_alt" },
  { name: "step-icon", code: "aspect_ratio" },
  { name: "sort-icon", code: "shuffle" },
  { name: "align-icon", code: "toc" },
  { name: "tutoSlide-icon", code: "create" },
  { name: "save-icon", code: "save" },
  { name: "back-to-pres", code: "arrow_back_ios" },
];

const iconCreator = (target, action, hoverMessage) => {
  iconTypes.forEach((icon) => {
    if (target === icon.name) {
      var thisIcon = document.createElement("i");
      thisIcon.innerHTML = icon.code;
      thisIcon.id = icon.name;
      thisIcon.className = "material-icons";
      thisIcon.style = "display:flex;";
      thisIcon.onclick = action;

      var thisIconDiv = document.createElement("div");
      thisIconDiv.className = "themeCustom";
      thisIconDiv.title = hoverMessage;
      thisIconDiv.style =
        "margin-bottom:10px;background-color:white;border: 1px solid rgb(230,230,230);cursor:pointer;";

      thisIconDiv.appendChild(thisIcon);

      document.getElementById("icons").appendChild(thisIconDiv);
    }
  });
};

export { iconCreator };
