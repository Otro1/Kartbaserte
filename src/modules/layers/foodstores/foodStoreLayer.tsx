import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Circle, Fill, Stroke, Style, Text } from "ol/style";
import { Feature } from "ol";
import { Geometry, Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";
import { boundingExtent } from "ol/extent";

const token = "Z1ZxfmNqzylz2fbCUWZawoyMkaWeo4xnNitq8GM9";

export const foodStoreLayer = new VectorLayer({
  className: "foodStores",
  source: new VectorSource({
    loader: function (extent, resolution, projection) {
      var url = "https://kassal.app/api/v1/physical-stores?size=100";
      console.log("Fetching data from:", url); // Log the URL being fetched
      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          console.log("Response:", response); // Log the response
          return response.json();
        })
        .then((json) => {
          console.log("JSON data:", json); // Log the JSON data
          // Transform the data into GeoJSON format
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
          console.log("GeoJSON:", geojson); // Log the GeoJSON data

          var format = new GeoJSON();
          var features = format.readFeatures(geojson, {
            dataProjection: "EPSG:4326",
            featureProjection: projection,
          }) as Feature<Geometry>[];
          console.log("Features:", features); // Log the features
          (this as VectorSource<Feature<Geometry>>).addFeatures(features);
        })
        .catch((error) => {
          console.error("Error:", error); // Log any errors
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
