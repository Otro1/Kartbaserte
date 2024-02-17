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
import Switch from "../map/switch";
import { KommuneLayerCheckbox } from "../kommune/kommuneLayerCheckbox";
import { kommuneLayer } from "../kommune/kommuneLayerCheckbox";

import { map, MapContext } from "../map/mapContext";
import { Layer } from "ol/layer";
import { KommuneAside } from "../kommune/kommuneAside";
import { FylkeLayerCheckbox } from "../fylke/fylkeLayerCheckbox";
import { fylkeLayer } from "../fylke/fylkeLayerCheckbox";
import { FylkeAside } from "../fylke/fylkeAside";
import { powerplantLayer } from "../kraftverk/powerplantLayerCheckbox";
import { SchoolLayerCheckbox } from "../skoler/schoolLayerCheckbox";
import { schoolLayer } from "../skoler/schoolLayerCheckbox";
import { Feature } from "ol";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
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
        zoom: 18,
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

  const [isAsideBoxVisible, setAsideBoxVisible] = useState(true);

  useEffect(() => {
    const toggleButton = document.getElementById("toggleAsideButton");
    if (toggleButton) {
      toggleButton.addEventListener("click", () => {
        setAsideBoxVisible(!isAsideBoxVisible);
      });
    }
  }, [isAsideBoxVisible]);

  const markerSource = new VectorSource();
  const markerLayer = new VectorLayer({
    source: markerSource,
  });

  const [vectorLayers, setVectorLayers] = useState<Layer[]>([]);
  const layers = useMemo(
    () => [baseLayer, markerLayer, ...vectorLayers],
    [baseLayer, markerLayer, vectorLayers],
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
        {isAsideBoxVisible && (
          <div className="aside-box">
            <FylkeAside />
            <KommuneAside />
            <SchoolAside />
          </div>
        )}
        <div className="info-box">
          <header>
            <h2>TheMap</h2>
          </header>
          <nav className="nav">
            <div className="switches">
              <div className="styled-link" id="toggleAsideButton">
                Toggle Aside
              </div>
              <a href={"#"} onClick={handleFocusUser} className="styled-link">
                Focus on me
              </a>
              <div className="checkbox">
                <Switch layer={fylkeLayer} /> Fylker
              </div>
              <div className="checkbox">
                <Switch layer={kommuneLayer} /> Kommuner
              </div>
              <div className="checkbox">
                <Switch layer={schoolLayer} /> Skoler
              </div>
              <div className="checkbox">
                <Switch layer={powerplantLayer} /> Kraftverk
              </div>
            </div>
            <div className="dropdown">
              <BaseLayerDropdown />
            </div>
          </nav>
        </div>
      </div>
    </MapContext.Provider>
  );
}
