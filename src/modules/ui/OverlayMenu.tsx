import React, { useContext, useState } from "react";
import { SelectBaseLayer } from "./SelectBaseLayer";
import { RegionLayerCheckbox } from "../layers/regions/regionLayerCheckbox";
import { map, MapContext } from "../map/MapContext";
import { ShelterLayerCheckbox } from "../layers/shelters/ShelterLayerCheckbox";
import { PowerplantLayerCheckbox } from "../layers/powerplants/powerplantLayerCheckbox";
import { RoadTunnelLayerCheckbox } from "../layers/roads/roadTunnelLayerCheckbox";
/* import { CountriesLayerCheckbox } from "../layers/countries/countriesLayerCheckbox";*/
import { HealthRegionLayerCheckbox } from "../layers/healthRegion/healthRegionLayerCheckbox";
import { FoodStoreLayerCheckbox } from "../layers/foodstores/foodStoreLayerCheckbox";
import { geocode } from "../map/Geocoder";

export default function OverlayMenu() {
  const { map } = useContext(MapContext);
  const [isOpen, setIsOpen] = useState(true);

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

  const [address, setAddress] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const coords = await geocode(address);
    map.getView().setCenter(coords as number[]);
    map.getView().setZoom(18);
  };

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
          textAlign: "center",
          flexDirection: "column",
          justifyContent: "center",
          padding: "20px",
          borderRadius: "5px",
          boxShadow: "3px -1px 34px -15px rgba(0,0,0,0.75)",
        }}
      >
        <h1>Menu</h1>

        <button
          className={`menu ${isOpen ? "menu-open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Hide Content" : "Show Content"}
        </button>

        <div
          style={{
            backgroundColor: "rgb(15, 32, 51)",
            opacity: "95%",
            zIndex: "20",
            display: isOpen ? "flex" : "none", // Hide or show the content by changing the display property
            justifyContent: "center",
            padding: "20px",
            borderRadius: "5px",
            boxShadow: "3px -1px 34px -15px rgba(0,0,0,0.75)",
          }}
        >
          <div>
            <div className={"w-full pr-3 pl-3 pb-1"}>
              <br />
              <button className="focusMe" onClick={handleFocusUser}>
                Focus on me!
              </button>
              <button className="focusOslo" onClick={handleFocusOslo}>
                Focus on Oslo!
              </button>
              <FoodStoreLayerCheckbox />
              <RoadTunnelLayerCheckbox />
              <RegionLayerCheckbox />
              <HealthRegionLayerCheckbox />
              <PowerplantLayerCheckbox />
              <ShelterLayerCheckbox />
              <br />
              <br />
              <form onSubmit={handleSubmit}>
                <div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="searchBar"
                    placeholder="Enter an address"
                  />
                </div>
                <div>
                  <button type="submit" className="buttons">
                    Search
                  </button>
                </div>
              </form>
              {(SelectBaseLayer as { layer?: any }).layer
                ?.getSource()
                ?.getProjection()
                ?.getCode()}
              {/*  <br />
              <br />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
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
              </div> */}
            </div>
          </div>
        </div>

        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "50px",
            height: "11",
            width: "185px",
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
