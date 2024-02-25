import React, { MouseEvent, useContext, useEffect, useState } from "react";
import { MapContext } from "../../map/MapContext";

import { Feature, MapBrowserEvent } from "ol";
import {
  activeRoadTunnelStyle,
  roadTunnelFeature,
  roadTunnelLayer,
} from "./roadTunnelLayer";
import { Geometry } from "ol/geom";

export function RoadTunnelLayerCheckbox() {
  const [checked, setChecked] = useState(false);
  const { map, setLayers, setActiveFeatureDetails } = useContext(MapContext);

  const [activeFeature, setActiveFeature] = useState<roadTunnelFeature>();

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, roadTunnelLayer]);
    } else {
      setLayers((old) => old.filter((l) => l !== roadTunnelLayer));
    }
  }, [checked]);

  function handlePointerMove(e: MapBrowserEvent<any>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 100) {
      return;
    }
    const featuresAtCoordinate = roadTunnelLayer
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
        hitTolerance: 10,
        layerFilter: (l) => l === roadTunnelLayer,
      },
    );

    if (features.length === 1) {
      setActiveFeature(features[0] as unknown as roadTunnelFeature);
    } else {
      setActiveFeature(undefined);
    }
  }

  function handlePointerClick(e: MapBrowserEvent<any>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 100) {
      return;
    }
    const source = roadTunnelLayer?.getSource();
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
        hitTolerance: 10,
        layerFilter: (l) => l === roadTunnelLayer,
      },
    );

    if (features.length === 1) {
      setActiveFeatureDetails(
        roadTunnelFeatureDetails(features[0] as roadTunnelFeature),
      );
    }
  }

  useEffect(() => {
    activeFeature?.setStyle(activeRoadTunnelStyle);
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
    <span className={"roadTunnelCheckbox"}>
      <button className="focusMe" onClick={() => setChecked(!checked)}>
        {checked ? "Hide" : "Show"} Road Tunnels
      </button>
    </span>
  );
}

function roadTunnelFeatureDetails(roadTunnelFeature: roadTunnelFeature) {
  return (
    <>
      <h2>Road Tunnel feature details:</h2>
      <ul>
        <li>Name: {roadTunnelFeature.getProperties().gatenavn}</li>
        <li>Type: {roadTunnelFeature.getProperties().vegkategor}</li>
        <li>Year: {roadTunnelFeature.getProperties().kopidato}</li>
      </ul>
    </>
  );
}
