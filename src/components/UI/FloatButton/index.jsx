import React from "react";
import "./floatButton.scss";

const FloatButton = ({ float, iconClass }) => {
  let floatClass = null;

  switch (float) {
    case "r":
      floatClass = "float-right";
      break;
    case "l":
      floatClass = "float-left";
      break;

    default:
      floatClass = "float-right";
      break;
  }
  return (
    <button className={["float-button", floatClass].join(" ")}>
      <span className={iconClass}></span>
    </button>
  );
};

export default FloatButton;
