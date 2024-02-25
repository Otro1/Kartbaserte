import React, { useContext } from "react";
import { SelectBaseLayer } from "./SelectBaseLayer";
import { RegionLayerCheckbox } from "../layers/regions/regionLayerCheckbox";
import { map, MapContext } from "../map/MapContext";
import { ShelterLayerCheckbox } from "../layers/shelters/ShelterLayerCheckbox";

export default function OverlayMenu() {
  const { map } = useContext(MapContext);

  function handleFocusUser(e: React.MouseEvent) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      map.getView().animate({
        center: [longitude, latitude],
        zoom: 17,
      });
    });
  }

  function handleFocusOslo() {
    map.getView().animate({
      center: [10.7, 59.9],
      zoom: 12,
    });
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          height: "auto",
          width: "200px",
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
        <div>
          <h1>MAPZTER</h1>
          <div className={"w-full pr-3 pl-3 pb-1"}>
            <br />
            <button className="focusMe" onClick={handleFocusUser}>
              Focus on me!
            </button>
            <button className="focusOslo" onClick={handleFocusOslo}>
              Focus on Oslo!
            </button>
            <RegionLayerCheckbox />
            <ShelterLayerCheckbox />
            {(SelectBaseLayer as { layer?: any }).layer
              ?.getSource()
              ?.getProjection()
              ?.getCode()}
            <br />
            <br />
            <div style={{ display: "flex", alignItems: "center" }}>
              <h3
                style={{
                  margin: "0",
                  color: "rgb(234, 242, 250)",
                }}
              >
                Debug info:
              </h3>
              <span
                style={{
                  marginLeft: "10px",
                  color: "rgb(238, 238, 241)",
                }}
              >
                {map.getView().getProjection().getCode()}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "50px",
            height: "auto",
            width: "400px",
            backgroundColor: "rgb(15, 32, 51)",
            opacity: "95%",
            zIndex: "20",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "20px",
            borderRadius: "5px",
            boxShadow: "3px -1px 34px -15px rgba(0,0,0,0.75)",
          }}
        >
          <SelectBaseLayer />
        </div>
      </div>
    </>
  );
}
