import React, { useContext, useEffect, useState } from "react";
import TileLayer from "ol/layer/Tile";
import { OSM, StadiaMaps, WMTS, XYZ } from "ol/source";
import { MapContext } from "../map/mapContext";
import { optionsFromCapabilities } from "ol/source/WMTS";
import { WMTSCapabilities } from "ol/format";
import proj4 from "proj4";
import { register } from "ol/proj/proj4";
import "tailwindcss/tailwind.css";
import Select, { ActionMeta, SingleValue } from "react-select";

interface OptionType {
  value: string;
  label: string;
  layer: any; // replace 'any' with the actual type of 'layer'
}

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

const parser = new WMTSCapabilities();

async function loadWtmsSource(
  url: string,
  config: { matrixSet: string; layer: string },
) {
  const res = await fetch(url);
  const text = await res.text();
  const result = parser.read(text);
  return new WMTS(optionsFromCapabilities(result, config)!);
}

async function loadFlyfotoLayer() {
  return await loadWtmsSource(
    "https://opencache.statkart.no/gatekeeper/gk/gk.open_nib_web_mercator_wmts_v2?SERVICE=WMTS&REQUEST=GetCapabilities",
    {
      layer: "Nibcache_web_mercator_v2",
      matrixSet: "default028mm",
    },
  );
}

async function loadKartverket() {
  return await loadWtmsSource(
    "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?request=GetCapabilities&service=WMS",
    {
      layer: "norgeskart_bakgrunn",
      matrixSet: "EPSG:3857",
    },
  );
}

async function loadPolar() {
  return await loadWtmsSource("/arctic-sdi.xml", {
    layer: "arctic_cascading",
    matrixSet: "3575",
  });
}

const ortoPhotoLayer = new TileLayer();
const kartverketLayer = new TileLayer();

const polarLayer = new TileLayer();

export function BaseLayerDropdown() {
  const { setBaseLayer, map } = useContext(MapContext);

  useEffect(() => {
    loadKartverket().then((source) => kartverketLayer.setSource(source));
    loadFlyfotoLayer().then((source) => ortoPhotoLayer.setSource(source));
    loadPolar().then((source) => polarLayer.setSource(source));
  }, []);

  const baseLayerOptions: OptionType[] = [
    {
      id: "xyz",
      name: "xyz",
      layer: new TileLayer({
        source: new XYZ({
          attributions:
            "Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          maxZoom: 19,
        }),
      }),
    },
    {
      id: "osm",
      name: "Open Street Map",
      layer: new TileLayer({ source: new OSM() }),
    },
    {
      id: "stadia",
      name: "Stadia",
      layer: new TileLayer({
        source: new StadiaMaps({ layer: "outdoors" }),
      }),
    },
    {
      id: "stadia_dark",
      name: "Stadia (dark)",
      layer: new TileLayer({
        source: new StadiaMaps({ layer: "alidade_smooth_dark" }),
      }),
    },
    {
      id: "kartverket",
      name: "Kartverket",
      layer: kartverketLayer,
    },
    {
      id: "ortophoto",
      name: "Flyfoto",
      layer: ortoPhotoLayer,
    },
    {
      id: "polar",
      name: "Arktisk",
      layer: polarLayer,
    },
  ].map(({ id, name, layer }) => ({ value: id, label: name, layer }));

  const [selectedOption, setSelectedOption] = useState<OptionType | null>(
    baseLayerOptions[0],
  );

  useEffect(() => {
    if (selectedOption) {
      setBaseLayer(selectedOption.layer);
    }
  }, [selectedOption]);

  const handleChange = (
    selectedOption: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>,
  ) => {
    setSelectedOption(selectedOption);
  };

  return (
    <div className="dropdown">
      <label htmlFor="baseLayerDropdown" className="dropdown-label">
        Select Base Layer
      </label>
      <Select
        id="baseLayerDropdown"
        options={baseLayerOptions}
        value={selectedOption}
        onChange={handleChange}
        menuPlacement="top"
        className="custom-dropdown" // Add this class
        styles={{
          menu: (provided, state) => ({
            ...provided,
            marginTop: 0, // Reset the default margin-top
          }),
        }}
      />

      {/*  {selectedOption?.label} */}
      {/*  {map.getView().getProjection().getCode()} */}
      {/*  {selectedOption?.layer.getSource()?.getProjection()?.getCode()} */}
    </div>
  );
}
