import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";

export const powerplantLayer = new VectorLayer({
  className: "powerplants",
  source: new VectorSource({
    url: "/Kartbaserte/layers/powerplant.json",
    format: new GeoJSON(),
  }),
  style: powerplantStyle,
});

interface powerplantProperties {
  vannkraf_1: string;
  vannkraf_2: string;
  idriftaar: number;
}

export type powerplantFeature = {
  getProperties(): powerplantProperties;
} & Feature<Point>;

function powerplantStyle(f: FeatureLike) {
  const feature = f as powerplantFeature;
  const powerplantType = feature.getProperties().vannkraf_2; // Use vannkraf_2 instead of type

  return new Style({
    image: new Circle({
      radius: 2 + feature.getProperties().idriftaar / 350,
      stroke: new Stroke({ color: "white", width: 2 }),
      fill: new Fill({
        color:
          powerplantType === "Mini"
            ? "red"
            : powerplantType === "Mikro"
              ? "blue"
              : "yellow",
      }),
    }),
  });
}

export function activePowerplantStyle(f: FeatureLike, resolution: number) {
  console.log({ resolution });
  const feature = f as powerplantFeature;
  const powerplant = feature.getProperties();
  const powerplantType = powerplant.vannkraf_2; // Use vannkraf_2 instead of type

  return new Style({
    image: new Circle({
      radius: 2 + feature.getProperties().idriftaar / 350,
      stroke: new Stroke({ color: "white", width: 4 }),
      fill: new Fill({
        color:
          powerplantType === "Mini"
            ? "red"
            : powerplantType === "Mikro"
              ? "blue"
              : "yellow",
      }),
    }),
    text:
      resolution < 75
        ? new Text({
            text: powerplant.vannkraf_1,
            offsetY: -15,
            font: "bold 14px arial",
            fill: new Fill({ color: "black" }),
            stroke: new Stroke({ color: "white" }),
          })
        : undefined,
  });
}
