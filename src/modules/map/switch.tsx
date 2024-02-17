import React, { useState } from "react";
import "./Switch.css"; // Import the CSS
import { useLayer } from "../map/useLayer"; // Import the useLayer hook

interface SwitchProps {
  layer: any; // Replace 'any' with the type of your layer
}

function Switch({ layer }: SwitchProps) {
  const [isToggled, setToggled] = useState(false);

  useLayer(layer, isToggled);

  const toggleSwitch = () => {
    setToggled(!isToggled);
  };

  return (
    <div
      className={`switch ${isToggled ? "switch--toggled" : ""}`}
      onClick={toggleSwitch}
    >
      <div className="switch__slider" />
    </div>
  );
}

export default Switch;
