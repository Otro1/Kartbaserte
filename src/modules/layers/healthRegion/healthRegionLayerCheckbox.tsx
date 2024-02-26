import React, {
  MutableRefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MapContext } from "../../map/MapContext";
import { Feature, MapBrowserEvent, Overlay } from "ol";
import { Polygon } from "ol/geom";
import { healthRegionLayer, selectedStyle } from "./healthRegionLayer";
import { useFeatures } from "../../map/useFeatures";

type HealthRegionProperties = {
  navn: string;
};

type HealthRegionFeature = Feature<Polygon> & {
  getProperties(): HealthRegionProperties;
};

export function HealthRegionLayerCheckbox() {
  const [checked, setChecked] = useState(false);
  const [selectedHealthRegion, setSelectedHealthRegion] = useState<
    HealthRegionFeature | undefined
  >();

  const overlay = useMemo(() => new Overlay({}), []);
  const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;

  const { setLayers, map } = useContext(MapContext);

  const { features, visibleFeatures, activeFeature, setActiveFeature } =
    useFeatures<HealthRegionFeature>(
      (l) => l.getClassName() === "healthRegion",
    );

  useEffect(() => {
    activeFeature?.setStyle(selectedStyle);
    return () => activeFeature?.setStyle(undefined);
  }, [activeFeature]);

  useEffect(() => {
    overlay.setElement(overlayRef.current);
    map.addOverlay(overlay);
    return () => {
      map.removeOverlay(overlay);
    };
  }, []);

  function handlePointerMove(e: MapBrowserEvent<MouseEvent>) {
    const source = healthRegionLayer.getSource();
    if (source) {
      const healthRegion = source.getFeaturesAtCoordinate(e.coordinate) as
        | HealthRegionFeature[]
        | null;
      if (healthRegion && healthRegion.length === 1) {
        setActiveFeature(healthRegion[0]);
      } else {
        setActiveFeature(undefined);
      }
    }
  }

  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const source = healthRegionLayer.getSource();
    if (source) {
      const clickedHealthRegion = source.getFeaturesAtCoordinate(
        e.coordinate,
      ) as HealthRegionFeature[] | null;
      if (clickedHealthRegion && clickedHealthRegion.length === 1) {
        setSelectedHealthRegion(clickedHealthRegion[0]);
        overlay.setPosition(e.coordinate);
      } else {
        setSelectedHealthRegion(undefined);
        overlay.setPosition(undefined);
      }
    }
  }

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, healthRegionLayer]);
      map.on("click", handleClick);
      map.on("pointermove", handlePointerMove);
    }
    return () => {
      setLayers((old) => old.filter((l) => l !== healthRegionLayer));
      map.un("click", handleClick);
      map.un("pointermove", handlePointerMove);
    };
  }, [checked]);

  return (
    <>
      <span className="healthRegionCheckbox">
        <button
          className={`focusMe buttons ${checked ? "buttons-open" : ""}`}
          onClick={() => setChecked(!checked)}
        >
          {checked ? "Hide" : "Show"} Health Regions
        </button>
        <div ref={overlayRef} className="info">
          {selectedHealthRegion && (
            <>
              <strong>{selectedHealthRegion.getProperties().navn}</strong>
            </>
          )}
        </div>
      </span>
    </>
  );
}
