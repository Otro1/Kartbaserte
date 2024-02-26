import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { OSM } from "ol/source";
import TileLayer from "ol/layer/Tile";
import { map } from "../map/MapContext";
import { Layer } from "ol/layer";
import { MapContext } from "../map/MapContext";
import "./app.css";
import "ol/ol.css";
import OverlayMenu from "../ui/OverlayMenu";
import ActiveFeatureInfo from "../ui/ActiveFeatureInfo";
import proj4 from "proj4";
import { register } from "ol/proj/proj4";

// Register the EPSG:25833 projection
proj4.defs("EPSG:25833", "+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs");
register(proj4);

export default function App() {
  const [activeFeatureDetails, setActiveFeatureDetails] = useState();
  const [baseLayer, setBaseLayer] = useState(
    () => new TileLayer({ source: new OSM() }),
  );
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [vectorLayers, setVectorLayers] = useState<Layer[]>([]);
  const allLayers = useMemo(
    () => [baseLayer, ...vectorLayers],
    [baseLayer, vectorLayers],
  );

  useEffect(() => {
    map.setTarget(mapRef.current);
  }, []);

  useEffect(() => {
    map.setLayers(allLayers);
  }, [allLayers]);

  return (
    <MapContext.Provider
      value={{
        map,
        vectorLayers: vectorLayers,
        setLayers: setVectorLayers,
        setBaseLayer,
        setActiveFeatureDetails,
        activeFeatureDetails,
      }}
    >
      <main>
        <OverlayMenu />
        <ActiveFeatureInfo />
        <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
      </main>
    </MapContext.Provider>
  );
}
