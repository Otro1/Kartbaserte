import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Fill, Stroke, Style } from "ol/style";

export const regionLayer = new VectorLayer({
  //className: "regions",
  source: new VectorSource({
    url: "/kws2100-publishing-a-map-application-williamcaamot/layers/civilDefenceRegions.json",
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
