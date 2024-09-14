//===== Adding a new local service ======

const addLocalService = () => {
  const serviceName = document.getElementById("newServiceName").value;
  const serviceLocation = document.getElementById("newServiceLocation").value;
  const serviceType = document.getElementById("newServiceType").value;

  const serviceArkViewer = document.getElementById("newArkViewer").value;

  const service = {
    serviceName,
    serviceLocation,
    serviceType,
    serviceArkViewer,
  };

  window.electron.invoke("addLocalService", service);

  const serviceBut = document.getElementById("new-service-button");

  serviceBut.style.transition = "all 1s ease-out";
  serviceBut.style.backgroundPosition = "right bottom";
  serviceBut.style.color = "black";
  serviceBut.innerText = "Service added - please reload this page";
};

const removeLocalService = (serviceName) =>
  window.electron.invoke("removeLocalService", serviceName);
