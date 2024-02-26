import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Fill, Stroke, Style } from "ol/style";

export const countriesLayer = new VectorLayer({
  source: new VectorSource({
    url: "/Kartbaserte/layers/countries.json",
    format: new GeoJSON(),
  }),
  style: style,
});

export function style() {
  return new Style({
    stroke: new Stroke({ color: "black", width: 3 }),
  });
}

export function selectedStyle() {
  return new Style({
    stroke: new Stroke({ color: "black", width: 3 }),
    fill: new Fill({ color: [0, 0, 0, 0.2] }),
  });
}
