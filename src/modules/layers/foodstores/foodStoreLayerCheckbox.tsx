import React, { MouseEvent, useContext, useEffect, useState } from "react";
import { MapContext } from "../../map/MapContext";

import { Feature, MapBrowserEvent } from "ol";
import {
  activeFoodStoreStyle,
  foodStoreFeature,
  foodStoreLayer,
} from "./foodStoreLayer";
import { Geometry } from "ol/geom";

export function FoodStoreLayerCheckbox() {
  const [checked, setChecked] = useState(false);
  const { map, setLayers, setActiveFeatureDetails } = useContext(MapContext);

  const [activeFeature, setActiveFeature] = useState<foodStoreFeature>();

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, foodStoreLayer]);
    }
    return () => {
      setLayers((old) => old.filter((l) => l !== foodStoreLayer));
    };
  }, [checked]);

  function handlePointerMove(e: MapBrowserEvent<any>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 100) {
      return;
    }
    const featuresAtCoordinate = foodStoreLayer
      ?.getSource()
      ?.getClosestFeatureToCoordinate(e.coordinate);
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
        layerFilter: (l) => l === foodStoreLayer,
      },
    );

    if (features.length === 1) {
      setActiveFeature(features[0] as unknown as foodStoreFeature);
    } else {
      setActiveFeature(undefined);
    }
  }

  function handlePointerClick(e: MapBrowserEvent<any>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 100) {
      return;
    }
    const featuresAtCoordinate = foodStoreLayer
      ?.getSource()
      ?.getClosestFeatureToCoordinate(e.coordinate);
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
        layerFilter: (l) => l === foodStoreLayer,
      },
    );

    if (features.length === 1) {
      setActiveFeatureDetails(
        foodStoreFeatureDetails(features[0] as foodStoreFeature),
      );
    }
  }

  useEffect(() => {
    activeFeature?.setStyle(activeFoodStoreStyle);
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
    <span className="foodStoreCheckbox">
      <button
        className={`focusMe buttons ${checked ? "buttons-open" : ""}`}
        onClick={() => setChecked(!checked)}
      >
        {checked ? "Hide" : "Show"} Food Stores
      </button>
    </span>
  );
}
function foodStoreFeatureDetails(foodStoreFeature: foodStoreFeature) {
  const properties = foodStoreFeature.getProperties();
  console.log(properties.name);
  console.log(properties.address);
  console.log(properties.phone);

  return (
    <>
      <h2>Food Store feature details:</h2>
      <ul>
        <li>Name: {properties.name}</li>
        <li>Address: {properties.address}</li>
        <li>Phone: {properties.phone}</li>
      </ul>
    </>
  );
}
