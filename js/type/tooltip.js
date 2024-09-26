// ====== TOOLTIP MANAGEMENT =======
//
// Normalizing what the tooltip is showing.
//
// What do you want to display in the explorer tooltip?
// Here are your premade options:
// - A document's metadata
// - Informations about a group of documents
// - A series of filters to select clusters in your dataset
//

var tooltip;

const createTooltip = () => {
  tooltip = document.createElement("div");
  tooltip.id = "tooltip";
  xtype.appendChild(tooltip);
};

const removeTooltip = () => {
  let tooltip = document.getElementById("tooltip");
  xtype.removeChild(tooltip);
  tooltip = null;
};

const displayDatasetBasicInfo = (dataset) => {
  const basicHeader = document.createElement("div");
  basicHeader.id = "basicHeader";
  basicHeader.innerHTML = `
  <span style="font-size:1rem;font-weight:bolder">${dataset.name}</span><br>
  <span>Source : ${dataset.source}</span><br>
  <span>Date : ${dataset.date}</span>
  `;

  tooltip.append(basicHeader);
};

const displayDocumentMetadata = (doc) => {};

const displayClusterMetadata = (cluster) => {};

const datasetFilters = (dataset) => {};

export {
  displayDocumentMetadata,
  displayClusterMetadata,
  displayDatasetBasicInfo,
  datasetFilters,
  createTooltip,
  removeTooltip,
};
