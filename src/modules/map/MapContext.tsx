import { useGeographic } from "ol/proj";
import { Map, View } from "ol";
import { Layer } from "ol/layer";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import React from "react";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

useGeographic();

export const map = new Map({
  view: new View({ center: [10.7, 59.9], zoom: 12 }),
});

export const MapContext = React.createContext<{
  map: Map;
  vectorLayers: Layer[];
  setLayers: Dispatch<SetStateAction<Layer[]>>;
  setBaseLayer: Dispatch<SetStateAction<TileLayer<OSM>>>;
  setActiveFeatureDetails: Function;
  activeFeatureDetails: ReactNode;
}>({
  map,
  vectorLayers: [],
  setLayers: () => {},
  setBaseLayer: () => {},
  setActiveFeatureDetails: () => {},
  activeFeatureDetails: undefined,
});
