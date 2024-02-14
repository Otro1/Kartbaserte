import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

import "./application.css";
import "ol/ol.css";
import { KommuneLayerCheckbox } from "../kommune/kommuneLayerCheckbox";
import { map, MapContext } from "../map/mapContext";
import { Layer } from "ol/layer";
import { KommuneAside } from "../kommune/kommuneAside";
import { FylkeLayerCheckbox } from "../fylke/fylkeLayerCheckbox";
import { FylkeAside } from "../fylke/fylkeAside";
import { SchoolLayerCheckbox } from "../skoler/schoolLayerCheckbox";
import { SchoolAside } from "../skoler/schoolAside";
import { BaseLayerDropdown } from "../baseLayer/baseLayerDropdown";
import { View } from "ol";

export function MapApplication() {
  function handleFocusUser(e: React.MouseEvent) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      map.getView().animate({
        center: [longitude, latitude],
        zoom: 12,
      });
    });
  }

  const [baseLayer, setBaseLayer] = useState<Layer>(
    () => new TileLayer({ source: new OSM() }),
  );

  const [view, setView] = useState(new View({ center: [10, 59], zoom: 8 }));
  useEffect(() => map.setView(view), [view]);

  useEffect(() => {
    const projection = baseLayer?.getSource()?.getProjection();
    if (projection) {
      setView(
        (oldView) =>
          new View({
            center: oldView.getCenter(),
            zoom: oldView.getZoom(),
            projection,
          }),
      );
    }
  }, [baseLayer]);

  const [vectorLayers, setVectorLayers] = useState<Layer[]>([]);
  const layers = useMemo(
    () => [baseLayer, ...vectorLayers],
    [baseLayer, vectorLayers],
  );
  useEffect(() => map.setLayers(layers), [layers]);

  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  useEffect(() => map.setTarget(mapRef.current), []);

  return (
    <MapContext.Provider
      value={{ map, vectorLayers, setVectorLayers, setBaseLayer }}
    >
      <div className="map-container">
        <div ref={mapRef} className="map" />

        <div className="info-box">
          <header>
            <h1>TheMap</h1>
          </header>

          <nav className="nav">
            <div className="dropdown">
              <BaseLayerDropdown />
            </div>
            <a href={"#"} onClick={handleFocusUser}>
              Focus on me
            </a>
            <div className="checkbox">
              <KommuneLayerCheckbox />
            </div>
            <div className="checkbox">
              <FylkeLayerCheckbox />
            </div>
            <div className="checkbox">
              <SchoolLayerCheckbox />
            </div>
          </nav>
        </div>
        <div className="aside-box">
          <FylkeAside />
          <KommuneAside />
          <SchoolAside />
        </div>
      </div>
    </MapContext.Provider>
  );
}
