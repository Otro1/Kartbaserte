import React, { useContext, useEffect, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM, StadiaMaps, WMTS, XYZ } from "ol/source";
import { MapContext } from "../map/MapContext";
import { WMTSCapabilities } from "ol/format";
import { optionsFromCapabilities } from "ol/source/WMTS";

import proj4 from "proj4";
import { register } from "ol/proj/proj4";

proj4.defs([
  [
    "EPSG:3571",
    "+proj=laea +lat_0=90 +lon_0=180 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs",
  ],
  [
    "EPSG:3575",
    "+proj=laea +lat_0=90 +lon_0=10 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs",
  ],
]);
register(proj4);

//test

const parser = new WMTSCapabilities();

const ortoPhotoLayer = new TileLayer();
const kartverketLayer = new TileLayer();
const polarLayer = new TileLayer();

// @ts-ignore
async function loadFlyfotoLayer() {
  const res = await fetch(
    "https://opencache.statkart.no/gatekeeper/gk/gk.open_nib_web_mercator_wmts_v2?SERVICE=WMTS&REQUEST=GetCapabilities",
  ); // Where de we find the information about thr map?
  const text = await res.text();

  const result = parser.read(text);
  const options = optionsFromCapabilities(result, {
    // The URL above can contain multiple views, here we decide what we want
    layer: "Nibcache_web_mercator_v2", //What layer
    matrixSet: "default028mm", //Whatever this means, Johannes doesn't seem to know
  });
  // @ts-ignore
  return new WMTS(options)!;
}

async function loadPolarLayer() {
  const res = await fetch("/arctic.xml"); // Where de we find the information about thr map?
  const text = await res.text();

  const result = parser.read(text);
  const options = optionsFromCapabilities(result, {
    layer: "arctic_cascading",
    matrixSet: "3575",
  });
  // @ts-ignore
  return new WMTS(options)!;
}

async function loadKartverketLayer() {
  const res = await fetch(
    "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?request=GetCapabilities&service=WMS",
  ); // Where de we find the information about thr map?
  const text = await res.text();

  const result = parser.read(text);
  const options = optionsFromCapabilities(result, {
    layer: "norgeskart_bakgrunn",
    matrixSet: "EPSG:3857",
  });
  // @ts-ignore
  return new WMTS(options)!;
}

export function SelectBaseLayer() {
  const { setBaseLayer, map } = useContext(MapContext);

  useEffect(() => {
    loadFlyfotoLayer().then((source) => ortoPhotoLayer.setSource(source));
    // loadPolarLayer().then((source) => polarLayer.setSource(source));
    loadKartverketLayer().then((source) => kartverketLayer.setSource(source));
  }, []);

  const baseLayerOptions = [
    {
      id: "osm",
      name: "Open Street Map",
      layer: new TileLayer({ source: new OSM() }),
      imageUrl: "/Kartbaserte/images/openLayerstreetMapImage.png",
    },
    {
      id: "stadia",
      name: "Stadia",
      layer: new TileLayer({ source: new StadiaMaps({ layer: "outdoors" }) }),
      imageUrl: "/Kartbaserte/images/stadiaLayerImage.png",
    },
    {
      id: "stadia_dark",
      name: "Stadia (dark)",
      layer: new TileLayer({
        source: new StadiaMaps({ layer: "alidade_smooth_dark" }),
      }),
      imageUrl: "/Kartbaserte/images/stadiaDarkLayerImage.png",
    },
    {
      id: "kartverket",
      name: "Kartverket",
      layer: kartverketLayer,
      imageUrl: "/Kartbaserte/images/kartverketLayerImage.png",
    },
    {
      id: "ortophoto",
      name: "Flyfoto",
      layer: ortoPhotoLayer,
      imageUrl: "/Kartbaserte/images/flyfotoLayerImage.png",
    },
    {
      id: "polar",
      name: "Arktisk",
      layer: polarLayer,
      imageUrl: "/Kartbaserte/images/arcticLayerImage.png",
    },
    {
      id: "satellite",
      name: "Satellite",
      layer: new TileLayer({
        source: new XYZ({
          attributions:
            "Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          maxZoom: 19,
        }),
      }),
      imageUrl: "/Kartbaserte/images/satelliteLayerImage.png",
    },
  ];
  const [selectedLayer, setSelectedLayer] = useState(baseLayerOptions[0]);

  useEffect(() => {
    // @ts-ignore
    setBaseLayer(selectedLayer.layer);
  }, [selectedLayer]);

  // @ts-ignore
  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {baseLayerOptions.map(({ id, name, imageUrl }) => {
          return (
            <div
              key={id}
              style={{
                padding: "2px",
                width: "200px",
                display: "flex",
                justifyContent: "center",

                border:
                  selectedLayer.id === id
                    ? "2px solid rgb(238, 238, 241)"
                    : "none",
              }}
              onClick={() =>
                setSelectedLayer(
                  baseLayerOptions.find((l) => l.id === id) ||
                    baseLayerOptions[0],
                )
              }
            >
              <img
                src={imageUrl}
                style={{
                  maxHeight: "50px",
                  maxWidth: "50px",
                  height: "25px",
                  width: "25px",
                  cursor: "pointer",
                }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
