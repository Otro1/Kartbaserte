import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Fill, Stroke, Style } from "ol/style";

export const healthRegionLayer = new VectorLayer({
  source: new VectorSource({
    url: "/Kartbaserte/layers/healthRegion.json",
    format: new GeoJSON({
      dataProjection: "EPSG:25833",
      featureProjection: "EPSG:3857",
    }),
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
