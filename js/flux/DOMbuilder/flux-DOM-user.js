import { updateUserData, userData } from "../userdata";
import { fluxButtonClicked } from "../actionbuttons";
import { serviceTester } from "../service-tester";
import { genHr } from "./flux-DOM-common";
import { serviceModels } from "./service-models";

// ===== Flux User DOM button ====
//
// The USER tab is very specific, with routines that only apply to it.
// Some of it (like DOM field generation) could be mutualized, but
// the clarity cost is too important.
//
// This file is hence longer than most, but it belongs to the core
// PANDORAE architecture so it should not change very often.
//

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

const addField = (sectionData, service, value, serviceContainer, fieldType) => {
  const fieldContainer = document.createElement("div");
  fieldContainer.className = "fluxInputContainer";

  const label = document.createElement("label");
  label.style = "width:20%";
  label.innerText = `${service} : `;

  const field = document.createElement("input");
  field.className = "fluxInput fluxServiceInput";
  field.style =
    "width:80%;font-family:monospace;font-size:11px;margin-left:1rem;";
  field.type =
    service === "apikey" || service === "password" ? "password" : "text";
  field.placeholder = service;
  field.spellcheck = false;
  field.value = value;
  field.setAttribute("id", field.value);

  field.addEventListener("change", () => field.setAttribute("id", field.value));

  //adding attributes to populate user data easily;
  field.setAttribute("data-proximity", sectionData.proximity);
  field.setAttribute("data-service-name", sectionData.name);
  field.setAttribute("data-field-type", fieldType);
  field.setAttribute("data-field-name", service);

  fieldContainer.append(label, field);

  serviceContainer.append(fieldContainer);
};

const addFieldButton = (
  sectionData,
  service,
  value,
  fieldList,
  serviceContainer
) => {
  const addFieldButton = document.createElement("div");
  addFieldButton.className = "flux-button";
  addFieldButton.style = "width:100px;margin:0.5rem;margin-left:150px;";
  addFieldButton.innerText = "Add a new library";
  addFieldButton.addEventListener("click", () =>
    addField(sectionData, service, value, fieldList, "array")
  );

  serviceContainer.append(addFieldButton);
};

const addServiceCredentials = (tabData, sectionData, tab) => {
  const serviceContainer = document.createElement("div");
  serviceContainer.style = "padding:0.5rem";
  const title = document.createElement("div");
  title.innerText = sectionData.name;
  title.style = "font-size:14px; text-transform: capitalize;";

  serviceContainer.append(title);

  if (sectionData.description.length > 0) {
    const description = document.createElement("div");
    description.innerHTML = sectionData.description;
    description.style = "text-align:justify;padding:1rem;";
    serviceContainer.append(description);
  }

  if (sectionData.hasOwnProperty("helper")) {
    const helper = document.createElement("div");
    helper.innerHTML = sectionData.helper.text;
    helper.className = "helperBox";
    helper.addEventListener("click", () =>
      window.electron.send("openEx", sectionData.helper.url)
    );
    serviceContainer.append(helper);
  }

  for (const service in sectionData.fields) {
    const value = sectionData.fields[service];

    if (Array.isArray(value)) {
      const fieldList = document.createElement("div");
      fieldList.style = "margin-top:1rem";
      serviceContainer.append(fieldList);

      value.forEach((d, i) => {
        addField(sectionData, service, d, fieldList, "array");
      });

      if (value.length === 0) {
        addField(sectionData, service, "", serviceContainer, "array");
      }

      addFieldButton(sectionData, service, "", fieldList, serviceContainer);
    } else {
      addField(sectionData, service, value, serviceContainer, "string");
    }
  }

  // service tester
  // button to click to load the relevant datasets

  addServiceTesterButton(sectionData, serviceContainer);

  tab.append(genHr(), serviceContainer);
};

const addServiceTesterButton = (sectionData, serviceContainer) => {
  const inputs = serviceContainer.querySelectorAll("input.fluxServiceInput");

  const serviceTesterButton = document.createElement("button");
  serviceTesterButton.style.margin = "1rem";
  serviceTesterButton.type = "submit";
  serviceTesterButton.className = "flux-button";
  serviceTesterButton.innerText = "Test service connectivity";

  serviceTesterButton.addEventListener("click", () => {
    fluxButtonClicked(
      serviceTesterButton,
      sectionData.aftermath,
      "Requests sent"
    );
    serviceTester(sectionData.name, inputs);
  });

  serviceContainer.append(serviceTesterButton);
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
  proximityDiv.className = "newServiceForm";

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
  serviceTypeDiv.className = "newServiceForm";

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
    modelDiv.innerHTML = "";

    thisServiceDOM = [];

    serviceModels[selectServiceType.value].fields.forEach((d) => {
      const fieldContainer = document.createElement("div");
      fieldContainer.className = "fluxInputContainer";

      const label = document.createElement("label");
      label.innerText = `${d} : `;
      label.style.width = "20%";

      const field = document.createElement("input");
      field.className = "fluxInput fluxServiceInput";
      field.style = "font-size:11px;width:80%;font-family:monospace;";
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
    "To connect to a new service, select the relevant options below:<br>";

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
