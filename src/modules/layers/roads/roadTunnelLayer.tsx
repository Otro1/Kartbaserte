import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";
import { Feature } from "ol";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";

export const roadTunnelLayer = new VectorLayer({
  className: "roadTunnels",
  source: new VectorSource({
    url: "/KartbaserteF2/layers/roadTunnels.json",
    format: new GeoJSON(),
  }),
  style: roadTunnelStyle,
});

interface roadTunnelProperties {
  gatenavn: string;
  vegkategor: string;
  kopidato: number;
}

export type roadTunnelFeature = {
  getProperties(): roadTunnelProperties;
} & Feature<Point>;

function roadTunnelStyle(f: FeatureLike) {
  const feature = f as roadTunnelFeature;

  return new Style({
    stroke: new Stroke({
      color: "black",
      width: 5, // Adjust this value to make the line thicker or thinner
    }),
  });
}

export function activeRoadTunnelStyle(f: FeatureLike, resolution: number) {
  console.log({ resolution });
  const feature = f as roadTunnelFeature;
  const roadTunnel = feature.getProperties();

  return new Style({
    stroke: new Stroke({
      color: "black",
      width: 15, // Adjust this value to make the line thicker or thinner
    }),
    text: new Text({
      text: roadTunnel.gatenavn,
      offsetY: -15,
      font: "bold 14px arial",
      fill: new Fill({ color: "black" }),
      stroke: new Stroke({ color: "white" }),
    }),
  });
}
