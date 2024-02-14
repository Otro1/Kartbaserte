import React, { useContext, useEffect, useState } from "react";
import { useLayer } from "../map/useLayer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";
import { Feature, MapBrowserEvent } from "ol";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { MapContext } from "../map/mapContext";

const powerplantLayer = new VectorLayer({
  source: new VectorSource({
    url: "/KartbaserteF2/kraftverk.json",
    format: new GeoJSON(),
  }),
  style: powerplantStyle,
});

type PowerplantProperties = {
  vannkraf_3: string;
  maksytelse: number;
  vannkraf_2: "Mini" | "Micro";
};

type PowerplantFeature = {
  getProperties(): PowerplantProperties;
} & Feature<Point>;

function powerplantStyle(f: FeatureLike) {
  const feature = f as PowerplantFeature;
  const powerplant = feature.getProperties();
  return new Style({
    image: new Circle({
      stroke: new Stroke({ color: "white", width: 1 }),
      fill: new Fill({
        color: powerplant.vannkraf_2 === "Mini" ? "blue" : "purple",
      }),
      radius: 4 + powerplant.maksytelse / 0.5,
    }),
  });
}

function activePowerplantStyle(f: FeatureLike, resolution: number) {
  const feature = f as PowerplantFeature;
  const powerplant = feature.getProperties();
  return new Style({
    image: new Circle({
      stroke: new Stroke({ color: "white", width: 3 }),
      fill: new Fill({
        color: powerplant.vannkraf_2 === "Mini" ? "blue" : "purple",
      }),
      radius: 4 + powerplant.maksytelse / 1.5,
    }),
    text:
      resolution < 75
        ? new Text({
            text: powerplant.vannkraf_3,
            offsetY: -15,
            font: "bold 14px sans-serif",
            fill: new Fill({ color: "black" }),
            stroke: new Stroke({ color: "white", width: 2 }),
          })
        : undefined,
  });
}

export function PowerplantLayerCheckbox() {
  const { map } = useContext(MapContext);
  const [checked, setChecked] = useState(true);

  const [activeFeature, setActiveFeature] = useState<PowerplantFeature>();

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const resolution = map.getView().getResolution();
    if (!resolution || resolution > 100) {
      return;
    }
    const features: FeatureLike[] = [];
    map.forEachFeatureAtPixel(e.pixel, (f) => features.push(f), {
      hitTolerance: 5,
      layerFilter: (l) => l === powerplantLayer,
    });
    if (features.length === 1) {
      setActiveFeature(features[0] as PowerplantFeature);
    } else {
      setActiveFeature(undefined);
    }
  }

  useEffect(() => {
    activeFeature?.setStyle(activePowerplantStyle);
    return () => activeFeature?.setStyle(undefined);
  }, [activeFeature]);

  useLayer(powerplantLayer, checked);

  useEffect(() => {
    if (checked) {
      map?.on("pointermove", handlePointerMove);
    }
    return () => map?.un("pointermove", handlePointerMove);
  }, [checked]);

  return (
    <div>
      <label>
        <input
          type={"checkbox"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        Show powerplants
        {activeFeature && " (" + activeFeature.getProperties().vannkraf_3 + ")"}
      </label>
    </div>
  );
}
