import { updateUserData, userData } from "../userdata";
import { fluxButtonClicked } from "../actionbuttons";
import { serviceTester } from "../service-tester";
import { genHr } from "./flux-DOM-common";
import { serviceModels } from "./service-models";

const saveUserConfigs = (tabData, sectionData, tab) => {
  const user = Object.assign({}, userData);

  // reset user service config
  user.distantServices = {};
  user.localServices = {};

  const updateFields = () => {
    // credentials
    const credentials = tab.querySelectorAll("div.credential > input");

    for (let i = 0; i < credentials.length; i++) {
      const element = credentials[i];
      const property = element.id.replace("Input", "");
      user[property] = element.value;
    }

    // for all service input field
    const serviceInput = tab.querySelectorAll("input.fluxServiceInput");

    for (let i = 0; i < serviceInput.length; i++) {
      const input = serviceInput[i];

      console.log(input.dataset);

      // check if it is expected to be a local or distant service
      // (network wise, relative to this pandorae instance)
      const proximity = input.dataset.proximity + "Services";

      // name of the given service
      const serviceName = input.dataset.serviceName;

      // if it doesn't exist in the user data file, create the object
      if (!user[proximity].hasOwnProperty(serviceName)) {
        user[proximity][serviceName] = {};
      }

      // now point to this service
      const service = user[proximity][serviceName];

      // depending if we are looking for a single value or array
      switch (input.dataset.fieldType) {
        case "string":
          service[input.dataset.fieldName] = input.value;
          break;

        case "array":
          if (!service.hasOwnProperty(input.dataset.fieldName)) {
            service[input.dataset.fieldName] = [];
          }

          service[input.dataset.fieldName].push(input.value);

          break;

        default:
          break;
      }
    }

    // services
    console.log(user);
  };

  const updateUserButton = document.createElement("button");
  updateUserButton.type = "submit";
  updateUserButton.className = "flux-button";
  updateUserButton.innerText = "Save user information";

  updateUserButton.addEventListener("click", () => {
    updateFields();

    updateUserData(user);
    fluxButtonClicked(updateUserButton, "disabled", "User updated");
  });

  tab.append(genHr(), updateUserButton);
};

const addUserField = (tabData, sectionData, tab) => {
  const userFieldContainer = document.createElement("div");
  userFieldContainer.className = "credential";

  const label = document.createElement("label");
  label.innerText = `${sectionData.name} : `;
  label.style.width = "100px";

  const field = document.createElement("input");
  field.className = "fluxInput";
  field.style = "font-size;12px;width:400px;";
  field.type = "text";
  field.placeholder = "Enter your " + sectionData.name;
  field.spellcheck = false;
  field.id = sectionData.id + "Input";

  if (userData.hasOwnProperty(sectionData.id)) {
    field.value = userData[sectionData.id];
  }

  userFieldContainer.append(label, field);

  tab.append(userFieldContainer);
};

const addServiceCredentials = (tabData, sectionData, tab) => {
  const serviceContainer = document.createElement("div");
  serviceContainer.style = "padding:0.5rem";
  const title = document.createElement("div");
  title.innerText = sectionData.name;
  title.style = "font-size:14px; text-transform: capitalize;";

  const description = document.createElement("div");
  description.innerHTML = sectionData.description;
  description.style = "text-align:justify;padding:1rem;";
  serviceContainer.append(title, description);

  if (sectionData.hasOwnProperty("helper")) {
    const helper = document.createElement("div");
    helper.innerHTML = sectionData.helper.text;
    helper.className = "helperBox";
    helper.addEventListener("click", () =>
      window.electron.send("openEx", sectionData.helper.url)
    );
    serviceContainer.append(helper);
  }

  if (sectionData.fields.hasOwnProperty("libraries")) {
    let count = 1;
    const librarylist = document.createElement("div");
    librarylist.style = "margin-top:1rem";

    const addLib = document.createElement("div");
    addLib.className = "flux-button";
    addLib.style = "width:100px;margin:0.5rem;margin-left:150px;";
    addLib.innerText = "Add a new library";

    const addLibraryField = (libID) => {
      const libraryfieldContainer = document.createElement("div");
      libraryfieldContainer.style = `display: flex;
      width: 220px;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;padding:0.3rem;`;

      const label = document.createElement("label");
      label.innerText = `Library ${count} : `;

      const libraryfield = document.createElement("input");
      libraryfield.className = "zoteroLibraryField fluxInput fluxServiceInput";
      libraryfield.type = "text";
      libraryfield.placeholder = "0000000"; //5361175
      libraryfield.spellcheck = false;
      libraryfield.id = libID ? libID : sectionData.name + count + "-Library";
      libraryfield.value = libID ? libID : "";

      //adding attributes to populate user data easily;
      libraryfield.setAttribute("data-proximity", sectionData.proximity);
      libraryfield.setAttribute("data-service-name", sectionData.name);
      libraryfield.setAttribute("data-field-type", "array");
      libraryfield.setAttribute("data-field-name", "libraries");

      libraryfieldContainer.append(label, libraryfield);
      librarylist.append(libraryfieldContainer);
      count++;
    };

    addLib.addEventListener("click", () => addLibraryField());

    if (userData.distantServices.hasOwnProperty("zotero")) {
      if (userData.distantServices.zotero.libraries.length > 0) {
        userData.distantServices.zotero.libraries.forEach((d) =>
          addLibraryField(d)
        );
      }
    } else {
      addLibraryField();
    }

    serviceContainer.append(librarylist, addLib);
  }

  if (
    sectionData.fields.hasOwnProperty("apikey") &&
    userData.distantServices.hasOwnProperty(sectionData.name)
  ) {
    const label = document.createElement("label");
    label.innerText = `API key : `;
    const apikeyfield = document.createElement("input");
    apikeyfield.style = "font-size;12px;width:auto;margin-top:15px;";
    apikeyfield.type = "password";
    apikeyfield.className = "fluxInput fluxServiceInput";
    apikeyfield.placeholder =
      "Paste your " + sectionData.name + " API key here";
    apikeyfield.spellcheck = false;
    apikeyfield.id = sectionData.name + "-APIkey";

    apikeyfield.setAttribute("data-proximity", sectionData.proximity);
    apikeyfield.setAttribute("data-service-name", sectionData.name);
    apikeyfield.setAttribute("data-field-type", "string");
    apikeyfield.setAttribute("data-field-name", "apikey");

    const apikey = userData.distantServices[sectionData.name].apikey;
    apikeyfield.value = apikey ? apikey : 0;
    serviceContainer.append(label, apikeyfield);
  }

  // service tester
  // button to click to load the relevant datasets
  const serviceTesterButton = document.createElement("button");
  serviceTesterButton.type = "submit";
  serviceTesterButton.className = "flux-button";
  serviceTesterButton.innerText = "Test service connectivity";

  serviceTesterButton.addEventListener("click", () => {
    fluxButtonClicked(
      serviceTesterButton,
      sectionData.aftermath,
      "Requests sent"
    );
    serviceTester(sectionData.name, userData.distantServices[sectionData.name]);
  });

  serviceContainer.append(serviceTesterButton);

  tab.append(genHr(), serviceContainer);
};

// This one is static, and needs to be enriched every time a new non-standard
// system is added.

const newServiceFormBuilder = (tab) => {
  const serviceContainer = document.createElement("div");
  serviceContainer.style = "padding:0.5rem";

  const neutral = document.createElement("option");
  neutral.innerText = "";
  neutral.value = "";

  // proximity

  const proximityDiv = document.createElement("div");

  const proximityLabel = document.createElement("label");
  proximityLabel.for = "proximitySelect";
  proximityLabel.innerText = "Select proximity : ";

  const selectProximity = document.createElement("select");
  selectProximity.id = "proximitySelect";
  selectProximity.innerText = "Select proximity";
  selectProximity.value = "";

  const distant = document.createElement("option");
  distant.innerText = "distant";
  distant.value = "distant";

  const local = document.createElement("option");
  local.innerText = "local";
  local.value = "local";

  selectProximity.append(neutral.cloneNode(), local, distant);
  proximityDiv.append(proximityLabel, selectProximity);

  // ===== service type
  const serviceTypeDiv = document.createElement("div");

  const serviceTypeLabel = document.createElement("label");
  serviceTypeLabel.for = "selectServiceType";
  serviceTypeLabel.innerText = "Select service type : ";

  const selectServiceType = document.createElement("select");
  selectServiceType.id = "selectServiceType";
  selectServiceType.innerText = "Select service type";
  selectServiceType.value = "";
  selectServiceType.innerText = "Service type";

  serviceTypeDiv.append(serviceTypeLabel, selectServiceType);

  const modelDiv = document.createElement("div");

  let thisServiceDOM = [];

  selectServiceType.addEventListener("change", () => {
    console.log(serviceModels[selectServiceType.value]);

    modelDiv.innerHTML = "";

    thisServiceDOM = [];

    serviceModels[selectServiceType.value].forEach((d) => {
      const fieldContainer = document.createElement("div");

      const label = document.createElement("label");
      label.innerText = `${d} : `;
      label.style.width = "100px";

      const field = document.createElement("input");
      field.className = "fluxInput fluxServiceInput";
      field.style = "font-size;12px;width:400px;";
      field.type = "text";
      field.placeholder = "Enter " + d;
      field.spellcheck = false;
      field.id = d + "Input";

      thisServiceDOM.push(field);

      field.setAttribute("data-proximity", selectProximity.value);
      field.setAttribute("data-field-type", "string");
      field.setAttribute("data-field-name", d);

      // a bit convoluted, but fastest way to have a name for
      // the service
      if (d === "name") {
        field.addEventListener("change", () => {
          for (let i = 0; i < thisServiceDOM.length; i++) {
            thisServiceDOM[i].setAttribute("data-service-name", field.value);
          }
        });
      }

      fieldContainer.append(label, field);
      modelDiv.append(fieldContainer);
    });
  });

  selectServiceType.append(neutral.cloneNode());

  for (const model in serviceModels) {
    const option = document.createElement("option");
    option.innerText = model;
    option.value = model;
    selectServiceType.append(option);
  }

  const formDiv = document.createElement("div");
  formDiv.innerHTML =
    "To connect to a new service, select the relevant options below:";

  formDiv.append(proximityDiv, serviceTypeDiv, modelDiv);

  const addService = document.createElement("button");
  addService.type = "submit";
  addService.className = "flux-button";
  addService.innerText = "Connect new service";

  addService.addEventListener("click", () => {
    serviceContainer.append(formDiv);
    fluxButtonClicked(addService, "destroy", "Connect new service");
  });
  serviceContainer.append(addService);
  tab.append(genHr(), serviceContainer);
};

export {
  saveUserConfigs,
  addServiceCredentials,
  addUserField,
  newServiceFormBuilder,
};
