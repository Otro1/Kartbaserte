import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { boundingExtent } from "ol/extent";

export const shelterLayer = new VectorLayer({
  className: "shelters",
  source: new VectorSource({
    url: "/kws2100-publishing-a-map-application-williamcaamot/layers/emergencyShelters.json",
    format: new GeoJSON(),
  }),
  style: shelterStyle,
});

interface shelterProperties {
  // This has to match the content of the actual data
  romnr: number;
  plasser: number;
  adresse: string;
}

export type shelterFeature = {
  getProperties(): shelterProperties;
} & Feature<Point>;

function shelterStyle(f: FeatureLike) {
  const feature = f as shelterFeature;

  return new Style({
    image: new Circle({
      radius: 2 + feature.getProperties().plasser / 350,
      stroke: new Stroke({ color: "white", width: 2 }),
      fill: new Fill({ color: "purple" }),
    }),
  });
}

export function activeShelterStyle(f: FeatureLike, resolution: number) {
  console.log({ resolution });
  const feature = f as shelterFeature;
  const shelter = feature.getProperties();

  return new Style({
    image: new Circle({
      radius: 2 + feature.getProperties().plasser / 350,
      stroke: new Stroke({ color: "white", width: 4 }),
      fill: new Fill({ color: "purple" }),
    }),
    text:
      resolution < 75
        ? new Text({
            text: shelter.adresse,
            offsetY: -15,
            font: "bold 14px arial",
            fill: new Fill({ color: "black" }),
            stroke: new Stroke({ color: "white" }),
          })
        : undefined,
  });
}
