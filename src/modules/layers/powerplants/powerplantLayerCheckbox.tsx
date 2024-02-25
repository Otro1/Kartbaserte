import React, { MouseEvent, useContext, useEffect, useState } from "react";
import { MapContext } from "../../map/MapContext";

import { Feature, MapBrowserEvent } from "ol";
import {
  activePowerplantStyle,
  powerplantFeature,
  powerplantLayer,
} from "./powerplantLayer";
import { Geometry } from "ol/geom";

export function PowerplantLayerCheckbox() {
  const [checked, setChecked] = useState(false);
  const { map, setLayers, setActiveFeatureDetails } = useContext(MapContext);

  const [activeFeature, setActiveFeature] = useState<powerplantFeature>();

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, powerplantLayer]);
    }
    return () => {
      setLayers((old) => old.filter((l) => l !== powerplantLayer));
    };
  }, [checked]);

  function handlePointerMove(e: MapBrowserEvent<any>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 100) {
      return;
    }
    const featuresAtCoordinate = powerplantLayer
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
        layerFilter: (l) => l === powerplantLayer,
      },
    );

    if (features.length === 1) {
      setActiveFeature(features[0] as unknown as powerplantFeature);
    } else {
      setActiveFeature(undefined);
    }
  }

  function handlePointerClick(e: MapBrowserEvent<any>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 100) {
      return;
    }
    const source = powerplantLayer?.getSource();
    const featuresAtCoordinate = source
      ? source.getClosestFeatureToCoordinate(e.coordinate)
      : null;
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
        layerFilter: (l) => l === powerplantLayer,
      },
    );

    if (features.length === 1) {
      setActiveFeatureDetails(
        powerplantFeatureDetails(features[0] as powerplantFeature),
      );
    }
  }

  useEffect(() => {
    activeFeature?.setStyle(activePowerplantStyle);
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
    <span className="powerplantCheckbox">
      <button
        className={`focusMe buttons ${checked ? "buttons-open" : ""}`}
        onClick={() => setChecked(!checked)}
      >
        {checked ? "Hide" : "Show"} Powerplants
      </button>
    </span>
  );
}

function powerplantFeatureDetails(powerplantFeature: powerplantFeature) {
  return (
    <>
      <h2>Powerplant feature details:</h2>
      <ul>
        <li>Name: {powerplantFeature.getProperties().vannkraf_1}</li>
        <li>Type: {powerplantFeature.getProperties().vannkraf_2}</li>
        <li>Year: {powerplantFeature.getProperties().idriftaar}</li>
      </ul>
    </>
  );
}
