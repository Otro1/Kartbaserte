import React, { useContext } from "react";
import { MapContext } from "../map/MapContext";

export default function ActiveFeatureInfo() {
  const { activeFeatureDetails, setActiveFeatureDetails } =
    useContext(MapContext);

  if (activeFeatureDetails)
    return (
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "50px",
          height: "auto",
          width: "400px",
          color: "rgb(238, 238, 241)",
          backgroundColor: "rgb(15, 32, 51)",
          opacity: "95%",
          zIndex: "20",
          display: "flex",
          justifyContent: "center",
          padding: "20px",
          borderRadius: "5px",
          boxShadow: "3px -1px 34px -15px rgba(0,0,0,0.75)",
        }}
      >
        <div>{activeFeatureDetails}</div>
        <div
          style={{
            position: "relative",
            top: "5px",
            right: "2px",
            cursor: "pointer",
            color: "rgb(204, 24, 0)",
          }}
          onClick={() => {
            setActiveFeatureDetails(undefined);
          }}
        >
          CLOSE
        </div>
      </div>
    );
}
