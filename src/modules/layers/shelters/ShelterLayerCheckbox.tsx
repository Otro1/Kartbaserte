import React, { MouseEvent, useContext, useEffect, useState } from "react";
import { MapContext } from "../../map/MapContext";

import { Feature, MapBrowserEvent } from "ol";
import {
  activeShelterStyle,
  shelterFeature,
  shelterLayer,
} from "./ShelterLayer";
import { Geometry } from "ol/geom";

export function ShelterLayerCheckbox() {
  //TODO Should school layer be moved here?

  const [checked, setChecked] = useState(false);
  const { map, setLayers, setActiveFeatureDetails } = useContext(MapContext);

  const [activeFeature, setActiveFeature] = useState<shelterFeature>();

  useEffect(() => {
    // Add and remove layer from the layers based on clicking on the checkbox
    if (checked) {
      setLayers((old) => [...old, shelterLayer]);
    }
    return () => {
      setLayers((old) => old.filter((l) => l !== shelterLayer));
    };
  }, [checked]);

  function handlePointerMove(e: MapBrowserEvent<any>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 100) {
      return;
    }
    // @ts-ignore
    const featuresAtCoordinate = shelterLayer
      .getSource()
      .getClosestFeatureToCoordinate(e.coordinate);
    const features: Feature<Geometry>[] = [];
    map.forEachFeatureAtPixel(
      e.pixel,
      (f) => {
        if (typeof f.getGeometry === "function") {
          features.push(f as Feature<Geometry>);
        }
      },
      {
        hitTolerance: 5,
        layerFilter: (l) => l === shelterLayer,
      },
    );

    if (features.length === 1) {
      // Assuming shelterFeature is a type alias or interface extending Feature<Geometry>
      setActiveFeature(features[0] as unknown as shelterFeature); // Use unknown as an intermediary if direct casting is not possible
    } else {
      setActiveFeature(undefined);
    }
  }

  function handlePointerClick(e: MapBrowserEvent<any>) {
    console.log("clicking");
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 100) {
      return;
    }
    // @ts-ignore
    const featuresAtCoordinate = shelterLayer
      .getSource()
      .getClosestFeatureToCoordinate(e.coordinate);
    const features: Feature<Geometry>[] = [];
    map.forEachFeatureAtPixel(
      e.pixel,
      (f) => {
        if (typeof f.getGeometry === "function") {
          features.push(f as Feature<Geometry>);
        }
      },
      {
        hitTolerance: 5,
        layerFilter: (l) => l === shelterLayer,
      },
    );

    if (features.length === 1) {
      setActiveFeatureDetails(
        shelterFeatureDetails(features[0] as shelterFeature),
      );
    }
  }

  useEffect(() => {
    activeFeature?.setStyle(activeShelterStyle);
    return () => activeFeature?.setStyle(undefined);
  }, [activeFeature]);

  useEffect(() => {
    if (checked) {
      map?.on("pointermove", handlePointerMove);
      map?.on("click", handlePointerClick);
    }
    return () => {
      map?.un("pointermove", handlePointerMove);
      map?.un("click", handlePointerClick);
    };
  }, [checked]);

  return (
    <span className="shelterCheckbox">
      <button
        className={`focusMe buttons ${checked ? "buttons-open" : ""}`}
        onClick={() => setChecked(!checked)}
      >
        {checked ? "Hide" : "Show"} Emergency Shelters
      </button>
      {/*
            activeFeature && " (" + activeFeature.getProperties().navn + ")"
        */}
    </span>
  );
}

function shelterFeatureDetails(shelterFeature: shelterFeature) {
  return (
    <>
      <h2>Shelter feature details:</h2>
      <ul>
        <li>Adresse: {shelterFeature.getProperties().adresse}</li>
        <li>Plasser: {shelterFeature.getProperties().plasser}</li>
        <li>Rommr: {shelterFeature.getProperties().romnr}</li>
      </ul>
    </>
  );
}
