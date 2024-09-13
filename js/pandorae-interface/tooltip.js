// ========== TOOLTIP ===========
const createTooltip = () => {
  let tooltip = document.createElement("div");
  tooltip.id = "tooltip";
  xtype.appendChild(tooltip);
};

const removeTooltip = () => {
  let tooltip = document.getElementById("tooltip");
  xtype.removeChild(tooltip);
};

export { createTooltip, removeTooltip };
