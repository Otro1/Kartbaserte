import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";
import { Feature } from "ol";
import { Geometry, Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { boundingExtent } from "ol/extent";

export const foodStoreLayer = new VectorLayer({
  className: "foodStores",
  source: new VectorSource({
    loader: function (extent, resolution, projection) {
      // Update the URL to point to your server endpoint
      var url = "http://localhost:3000/api/foodstores";

      fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          var geojson = {
            type: "FeatureCollection",
            features: json.data.map((store: any) => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [
                  parseFloat(store.position.lng),
                  parseFloat(store.position.lat),
                ],
              },
              properties: {
                id: store.id,
                group: store.group,
                name: store.name,
                address: store.address,
                detailUrl: store.detailUrl,
                email: store.email,
                fax: store.fax,
                logo: store.logo,
                phone: store.phone,
                website: store.website,
              },
            })),
          };

          var format = new GeoJSON();
          var features = format.readFeatures(geojson, {
            dataProjection: "EPSG:4326",
            featureProjection: projection,
          }) as Feature<Geometry>[];
          (this as VectorSource<Feature<Geometry>>).addFeatures(features);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  }),
  style: foodStoreStyle,
});

interface foodStoreProperties {
  name: string;
  address: string;
  phone: string;
}

export type foodStoreFeature = {
  getProperties(): foodStoreProperties;
} & Feature<Point>;

function foodStoreStyle(f: FeatureLike) {
  return new Style({
    image: new Circle({
      radius: 5, // Set a fixed radius for the circle
      fill: new Fill({ color: "black" }), // Set the fill color to black
    }),
  });
}

export function activeFoodStoreStyle(f: FeatureLike, resolution: number) {
  const feature = f as foodStoreFeature;
  const foodStore = feature.getProperties();

  return new Style({
    image: new Circle({
      radius: 10, // Set a fixed radius for the circle
      fill: new Fill({ color: "black" }), // Set the fill color to black
    }),
    text:
      resolution < 75
        ? new Text({
            text: foodStore.name,
            offsetY: -15,
            font: "bold 14px arial",
            fill: new Fill({ color: "black" }),
            stroke: new Stroke({ color: "white" }),
          })
        : undefined,
  });
}
